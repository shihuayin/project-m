const express = require("express");
const router = express.Router();
const axios = require("axios");

// default london weather
router.get("/", async (req, res) => {
  let cityName = "London";
  try {
    const apiKey = "db87a4742183c10d7cd37e445e4f7dea";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );

    const { temp, humidity } = response.data.main;
    const { speed } = response.data.wind;
    const pressure = response.data.main.pressure;

    res.render("weather", {
      city: cityName,
      temperature: temp,
      humidity: humidity,
      windSpeed: speed,
      pressure: pressure,
    });
  } catch (error) {
    console.error("Failed to retrieve weather:", error);
    res
      .status(500)
      .send("Failed to retrieve weather information. Please try again.");
  }
});

// deal search
router.post("/", async (req, res) => {
  const cityName = req.body.city || "London";

  try {
    const apiKey = "db87a4742183c10d7cd37e445e4f7dea";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );

    const { temp, humidity } = response.data.main;
    const { speed } = response.data.wind;
    const pressure = response.data.main.pressure;

    res.render("weather", {
      city: cityName,
      temperature: temp,
      humidity: humidity,
      windSpeed: speed,
      pressure: pressure,
    });
  } catch (error) {
    console.error("Failed to retrieve weather:", error);
    res.render("weather", {
      city: cityName,
      error: "Failed to retrieve weather information. Please try again.",
    });
  }
});

module.exports = router;
