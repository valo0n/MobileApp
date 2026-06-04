// ============================================================
// Owner ViewModel — QENT Partner program (become a car owner)
// Krijon car_owner + jep role-in car_owner + krijon veturen
// ============================================================

const BaseModel = require("../models/Base.model");
const CarModel = require("../models/Car.model");

const ownerModel = new BaseModel("car_owners");
const partnershipModel = new BaseModel("partnerships");
const imageModel = new BaseModel("car_images");

class OwnerViewModel {
  // A osht ky user tashme car owner?
  async getMyOwner(userId) {
    return ownerModel.findOne({ user_id: userId });
  }

  // Regjistro user-in si partner/car owner + krijo veturen e pare
  async becomePartner(userId, data) {
    const {
      full_name,
      contact_email,
      contact_phone,
      driving_license,
      brand_id,
      brand_name,
      category, // "Regular Cars" | "Luxury Cars"
      model,
      year,
      color,
      fuel_type,
      transmission,
      license_plate,
      price_per_day,
      price_per_hour,
      description,
      images = [],
    } = data;

    // ── 1) Resolve brand_id ──
    let resolvedBrandId = brand_id;
    if (!resolvedBrandId && brand_name) {
      const b = await CarModel.rawQuery(
        "SELECT id FROM car_brands WHERE name = ? LIMIT 1",
        [brand_name],
      );
      resolvedBrandId = b[0]?.id;
    }
    if (!resolvedBrandId)
      throw { status: 400, message: "Please select a car brand" };

    // ── 2) Resolve category_id (sipas emrit, default Regular Cars) ──
    const catName = category || "Regular Cars";
    let cat = await CarModel.rawQuery(
      "SELECT id FROM car_categories WHERE name = ? LIMIT 1",
      [catName],
    );
    let categoryId = cat[0]?.id;
    if (!categoryId) {
      const any = await CarModel.rawQuery(
        "SELECT id FROM car_categories ORDER BY sort_order LIMIT 1",
      );
      categoryId = any[0]?.id;
    }

    // ── 3) Validime per veturen ──
    if (!model) throw { status: 400, message: "Car model is required" };
    if (!license_plate)
      throw { status: 400, message: "Car registration number is required" };

    const day = parseFloat(price_per_day);
    if (!day || day <= 0)
      throw { status: 400, message: "Valid price per day is required" };
    const hour = price_per_hour
      ? parseFloat(price_per_hour)
      : Math.max(1, Math.round((day / 10) * 100) / 100);

    // Mos lejo targe te dyfishta
    const dup = await CarModel.rawQuery(
      "SELECT id FROM cars WHERE license_plate = ? LIMIT 1",
      [license_plate],
    );
    if (dup[0])
      throw {
        status: 409,
        message: "A car with this registration number already exists",
      };

    // ── 4) Krijo ose merr car_owner ──
    let owner = await ownerModel.findOne({ user_id: userId });
    if (!owner) {
      owner = await ownerModel.create({
        user_id: userId,
        business_name: full_name || null,
        business_license: driving_license || null,
        verification_status: "pending",
      });
    }

    // ── 5) Jep role-in car_owner (INSERT IGNORE = s'duplikon) ──
    await CarModel.rawQuery(
      `INSERT IGNORE INTO user_roles (user_id, role_id)
       SELECT ?, id FROM roles WHERE name = 'car_owner'`,
      [userId],
    );

    // ── 6) Krijo veturen ──
    const car = await CarModel.create({
      owner_id: owner.id,
      brand_id: resolvedBrandId,
      category_id: categoryId,
      model,
      year: year ? parseInt(year) : new Date().getFullYear(),
      color: color || null,
      license_plate,
      transmission: transmission || "automatic",
      fuel_type: (fuel_type || "petrol").toLowerCase(),
      price_per_hour: hour,
      price_per_day: day,
      description: description || null,
      status: "available",
    });

    // ── 7) Ruaj imazhet (i pari = primary) ──
    if (Array.isArray(images) && images.length) {
      for (let i = 0; i < images.length; i++) {
        if (!images[i]) continue;
        await imageModel.create({
          car_id: car.id,
          image_url: images[i],
          is_primary: i === 0,
          sort_order: i,
        });
      }
    }

    // ── 8) Krijo nje partnership record (status pending) ──
    await partnershipModel.create({
      owner_id: owner.id,
      company_name: full_name || "Independent Owner",
      contact_person: full_name || null,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      status: "pending",
    });

    return { owner, car };
  }
}

module.exports = new OwnerViewModel();
