const express = require("express");
const router = express.Router();
const CarViewModel = require("../viewmodels/Car.viewmodel");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// GET /api/cars
router.get("/", async (req, res) => {
  try {
    const cars = await CarViewModel.getAll(req.query);
    res.json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await CarViewModel.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/brands
router.get("/brands", async (req, res) => {
  try {
    const brands = await CarViewModel.getBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/:id
router.get("/:id", async (req, res) => {
  try {
    const car = await CarViewModel.getById(req.params.id);
    res.json({ success: true, data: car });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/cars — Car Owner only
router.post(
  "/",
  authenticate,
  authorize("car_owner", "admin"),
  async (req, res) => {
    try {
      const car = await CarViewModel.create(req.userId, req.body);
      res.status(201).json({ success: true, data: car });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

// PUT /api/cars/:id — Car Owner only
router.put(
  "/:id",
  authenticate,
  authorize("car_owner", "admin"),
  async (req, res) => {
    try {
      const car = await CarViewModel.update(
        req.params.id,
        req.userId,
        req.body,
      );
      res.json({ success: true, data: car });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  },
);

// DELETE /api/cars/:id — Car Owner only
router.delete(
  "/:id",
  authenticate,
  authorize("car_owner", "admin"),
  async (req, res) => {
    try {
      await CarViewModel.delete(req.params.id, req.userId);
      res.json({ success: true, message: "Car deleted" });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  },
);

module.exports = router;
