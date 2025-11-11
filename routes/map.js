const express = require("express");
const router = express.Router();
const Location = require("../models/location");

// Show map page
router.get("/", async (req, res) => {
  const locations = await Location.find();
  res.render("map", { locations });
});

// Save marker
router.post("/add", async (req, res) => {
  const { name, lat, lng } = req.body;
  const loc = new Location({ name, lat, lng });
  await loc.save();
  res.json({ success: true });
});

module.exports = router;
