const CarModel = require("../models/Car.model");

class CarViewModel {
  async getAll(filters = {}) {
    const cars = await CarModel.findAvailable(filters);
    return cars;
  }

  async getById(carId) {
    const car = await CarModel.findWithDetails(carId);
    if (!car) throw { status: 404, message: "Car not found" };

    const images = await CarModel.getImages(carId);
    return { ...car, images };
  }

  async create(userId, data) {
    const BaseModel = require("../models/Base.model");
    const ownerModel = new BaseModel("car_owners");
    const owner = await ownerModel.findOne({ user_id: userId });
    if (!owner)
      throw { status: 403, message: "You must register as a car owner first" };
    const car = await CarModel.create({ ...data, owner_id: owner.id });
    return car;
  }

  async update(carId, ownerId, data) {
    const car = await CarModel.findById(carId);
    if (!car) throw { status: 404, message: "Car not found" };
    if (car.owner_id !== ownerId)
      throw { status: 403, message: "Not authorized" };

    await CarModel.update(carId, data);
    return CarModel.findWithDetails(carId);
  }

  async delete(carId, ownerId) {
    const car = await CarModel.findById(carId);
    if (!car) throw { status: 404, message: "Car not found" };
    if (car.owner_id !== ownerId)
      throw { status: 403, message: "Not authorized" };

    return CarModel.delete(carId);
  }

  async getCategories() {
    return CarModel.rawQuery(
      `SELECT * FROM car_categories WHERE is_active = TRUE ORDER BY sort_order`,
    );
  }

  async getBrands() {
    return CarModel.rawQuery(`SELECT * FROM car_brands ORDER BY name`);
  }
}

module.exports = new CarViewModel();
