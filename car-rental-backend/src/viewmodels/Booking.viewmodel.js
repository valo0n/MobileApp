const BookingModel = require("../models/Booking.model");
const CarModel = require("../models/Car.model");

class BookingViewModel {
  async create(userId, data) {
    const car = await CarModel.findById(data.car_id);
    if (!car) throw { status: 404, message: "Car not found" };
    if (car.status !== "available")
      throw { status: 400, message: "Car is not available" };

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

    // Update car status
    await CarModel.update(data.car_id, { status: "rented" });

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

    await BookingModel.update(bookingId, {
      status: "cancelled",
      cancellation_reason: reason || null,
    });

    // Free the car
    await CarModel.update(booking.car_id, { status: "available" });

    return { message: "Booking cancelled successfully" };
  }

  async updateStatus(bookingId, status) {
    await BookingModel.update(bookingId, { status });
    return BookingModel.findWithDetails(bookingId);
  }
}

module.exports = new BookingViewModel();
