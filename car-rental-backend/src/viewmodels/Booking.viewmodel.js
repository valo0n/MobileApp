const BookingModel = require("../models/Booking.model");
const CarModel = require("../models/Car.model");
const {
  PaymentModel,
  ConversationModel,
  MessageModel,
  NotificationModel,
} = require("../models/index");

// Stripe (init i sigurt — s'e rrezon serverin nese mungon)
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.warn("Stripe not available:", e.message);
}

class BookingViewModel {
  async create(userId, data) {
    const car = await CarModel.findById(data.car_id);
    if (!car) throw { status: 404, message: "Car not found" };
    if (["maintenance", "inactive"].includes(car.status))
      throw { status: 400, message: "Car is not available" };

    // KF-04: kontroll i disponueshmerise sipas datave (konflikt)
    const overlap = await BookingModel.rawQuery(
      `SELECT id FROM bookings
       WHERE car_id = ?
         AND status IN ('pending','confirmed','active')
         AND pickup_datetime < ?
         AND dropoff_datetime > ?
       LIMIT 1`,
      [data.car_id, data.dropoff_datetime, data.pickup_datetime],
    );
    if (overlap.length > 0) {
      throw {
        status: 409,
        message: "Vetura eshte e zene per keto data",
      };
    }

    const booking = await BookingModel.create({
      booking_ref: BookingModel.generateRef(),
      user_id: userId,
      car_id: data.car_id,
      pickup_location_id: data.pickup_location_id || null,
      dropoff_location_id: data.dropoff_location_id || null,
      pickup_address: data.pickup_address || null,
      dropoff_address: data.dropoff_address || null,
      pickup_datetime: data.pickup_datetime,
      dropoff_datetime: data.dropoff_datetime,
      duration_hours: data.duration_hours,
      base_price: data.base_price,
      service_fee: data.service_fee || 0,
      insurance_fee: data.insurance_fee || 0,
      discount_amount: data.discount_amount || 0,
      total_price: data.total_price,
      currency: data.currency || "USD",
      status: data.status || "pending",
    });

    // Mesazh automatik nga pronari te klienti + bisedë e re (që klienti të flasë me pronarin)
    try {
      const ownerRows = await BookingModel.rawQuery(
        `SELECT co.user_id FROM cars c
         JOIN car_owners co ON c.owner_id = co.id
         WHERE c.id = ? LIMIT 1`,
        [data.car_id],
      );
      const ownerUserId = ownerRows[0]?.user_id;
      if (ownerUserId && Number(ownerUserId) !== Number(userId)) {
        const convId = await ConversationModel.findOrCreateBetween(
          userId,
          ownerUserId,
        );
        const carName =
          `${car.make || ""} ${car.model || ""}`.trim() || "vetura";
        await MessageModel.create({
          conversation_id: convId,
          sender_id: ownerUserId,
          content: `Përshëndetje! Faleminderit që rezervuat ${carName}. Rezervimi juaj u konfirmua dhe vetura do të jetë gati për ju. Më shkruani këtu për çdo detaj rreth dorëzimit. 🚗`,
          message_type: "text",
        });

        // Njoftim per pronarin: rezervim i ri
        await NotificationModel.create({
          user_id: ownerUserId,
          title: "Rezervim i ri",
          body: `Keni një rezervim të ri për ${carName}.`,
          type: "booking",
        }).catch(() => {});
      }

      // Njoftim per klientin: rezervimi u krye
      const carNameC =
        `${car.make || ""} ${car.model || ""}`.trim() || "veturën";
      await NotificationModel.create({
        user_id: userId,
        title: "Rezervimi u krye",
        body: `Rezervimi juaj për ${carNameC} u regjistrua me sukses.`,
        type: "booking",
      }).catch(() => {});
    } catch (e) {
      console.warn("Auto-message failed:", e.message);
    }

    return booking;
  }

  async getById(bookingId) {
    const booking = await BookingModel.findWithDetails(bookingId);
    if (!booking) throw { status: 404, message: "Booking not found" };
    return booking;
  }

  async getByUser(userId, status = null) {
    return BookingModel.findByUser(userId, status);
  }

  async cancel(bookingId, userId, reason) {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) throw { status: 404, message: "Booking not found" };
    if (booking.user_id !== userId)
      throw { status: 403, message: "Not authorized" };
    if (!["pending", "confirmed"].includes(booking.status)) {
      throw { status: 400, message: "Booking cannot be cancelled" };
    }

    // KF-08: politika e rimbursimit — 100% nese mbeten > 48h deri ne marrje
    const hoursUntilPickup =
      (new Date(booking.pickup_datetime).getTime() - Date.now()) / 3600000;
    const eligible = hoursUntilPickup > 48;
    const refundAmount = eligible ? Number(booking.total_price) : 0;

    await BookingModel.update(bookingId, {
      status: "cancelled",
      cancellation_reason: reason || null,
    });

    // Liro veturen
    await CarModel.update(booking.car_id, { status: "available" });

    // Procesoji rimbursimin (Stripe nese ka, perndryshe vetem shenoje)
    if (eligible && refundAmount > 0) {
      try {
        const payments = await PaymentModel.findByBooking(bookingId);
        const paid = (payments || []).find(
          (p) => p.status === "completed" && p.transaction_id,
        );
        if (paid) {
          if (stripe && String(paid.transaction_id).startsWith("pi_")) {
            await stripe.refunds.create({
              payment_intent: paid.transaction_id,
            });
          }
          await PaymentModel.update(paid.id, { status: "refunded" });
        }
      } catch (e) {
        console.warn("Refund issue:", e.message);
      }
    }

    return {
      message: "Booking cancelled successfully",
      eligible,
      refunded: refundAmount,
      policy: "100% refund nese anulohet > 48 ore para marrjes",
    };
  }

  async updateStatus(bookingId, status) {
    await BookingModel.update(bookingId, { status });
    const booking = await BookingModel.findWithDetails(bookingId);

    try {
      const customerId = booking.user_id;
      const carName = booking.model || "vetura";

      let title = "Rezervimi u përditësua";
      let body = `Statusi i rezervimit për ${carName} është tani: ${status}.`;
      let chatMsg = null;

      if (status === "completed") {
        title = "Rezervimi u përfundua";
        body = `Faleminderit që zgjodhët ${carName}! Shpresojmë t'ju shohim sërish.`;
        chatMsg = `Faleminderit për besimin! Rezervimi i ${carName} u përfundua. Shpresojmë të riktheheni së shpejti. 🙏`;
      } else if (status === "active") {
        title = "Vetura është gati";
        body = `${carName} është aktive — udhëtim të mbarë!`;
        chatMsg = `Vetura ${carName} është gati dhe rezervimi juaj është aktiv. Udhëtim të mbarë! 🚗`;
      } else if (status === "cancelled") {
        title = "Rezervimi u anulua";
        body = `Rezervimi për ${carName} u anulua.`;
      }

      await NotificationModel.create({
        user_id: customerId,
        title,
        body,
        type: "booking",
      }).catch(() => {});

      // Mesazh nga pronari (per completed/active)
      if (chatMsg) {
        const ownerRows = await BookingModel.rawQuery(
          `SELECT co.user_id FROM cars c
           JOIN car_owners co ON c.owner_id = co.id
           WHERE c.id = ? LIMIT 1`,
          [booking.car_id],
        );
        const ownerUserId = ownerRows[0]?.user_id;
        if (ownerUserId && Number(ownerUserId) !== Number(customerId)) {
          const convId = await ConversationModel.findOrCreateBetween(
            customerId,
            ownerUserId,
          );
          await MessageModel.create({
            conversation_id: convId,
            sender_id: ownerUserId,
            content: chatMsg,
            message_type: "text",
          });
        }
      }
    } catch (e) {
      console.warn("Status notify failed:", e.message);
    }

    return booking;
  }
}

module.exports = new BookingViewModel();
