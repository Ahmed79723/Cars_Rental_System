import { ObjectId } from "mongodb";
import { db } from "../../DataBase/dbConnection.js";

//* =====================================|add car|===================================================
const addCar = async (req, res) => {
  const { name, model, rental_status } = req.body;
  const car = await db
    .collection("cars")
    .insertOne({ name, model, rental_status });
  if (car.acknowledged) {
    return res.status(201).json({ msg: "success", car });
  }
  res.status(404).json({ msg: "car not added", car });
};
//* =====================================|update car|===================================================
const updateCar = async (req, res) => {
  try {
    const car = await db
      .collection("cars")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (car.modifiedCount) {
      return res.status(200).json({ msg: "updated", car });
    }
    res.status(404).json({ msg: "car not found", car });
  } catch (error) {
    res.status(500).json({ msg: "car not updated", car });
  }
};
//* =====================================|delete car|===================================================
const deleteCar = async (req, res) => {
  try {
    const car = await db
      .collection("cars")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (car.deletedCount) {
      return res.json({ msg: "deleted", car });
    }
    res.status(404).json({ msg: "car not found", car });
  } catch (error) {
    res.status(500).json({ msg: "car not deleted" });
  }
};
//* =====================================|get all cars|===================================================
const getAllCars = async (req, res) => {
  const cars = await db.collection("cars").find({}).toArray();
  if (cars.length) {
    return res.status(200).json({ msg: "success", cars });
  }
  res.status(404).json({ msg: "couldn't get cars", cars });
};
//* =====================================|Get a specific car|===================================================
const getCar = async (req, res) => {
  try {
    const car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!car) {
      return res.status(404).json({ msg: "car not found", car });
    }
    res.status(200).json({ msg: "success", car });
  } catch (error) {
    res.status(500).json({ error: "couldn't get car" });
  }
};
//~ =====================================|Get a specific car by models|===================================================
const getCarByModel = async (req, res) => {
  console.log(req.query);
  const { name } = req.query;

  // Check if model query parameter is provided
  if (!name) {
    return res.status(400).send("Model query parameter is required");
  }

  // Convert the model query parameter to an array
  const models = name.split(",");
  try {
    const cars = await db
      .collection("cars")
      .find({ name: { $in: models } })
      .toArray();
    if (cars.length) {
      return res.status(200).json({ msg: "success", cars });
    }
    res.status(404).json({ msg: "cars not found", cars });
  } catch (error) {
    res.status(500).json({ error: "couldn't get cars" });
  }
};
//~ =====================================|Get available cars by model|===================================================
const getAvailableCarByModel = async (req, res) => {
  const { name } = req.query;

  // Check if model query parameter is provided
  if (!name) {
    return res.status(400).send("Model query parameter is required");
  }

  // Convert the model query parameter to an array
  const models = name.split(",");
  try {
    const cars = await db
      .collection("cars")
      .find({ name: { $in: models }, rental_status: "available" })
      .toArray();
    if (cars.length) {
      return res.status(200).json({ msg: "success", cars });
    }
    res.status(404).json({ msg: "cars not found", cars });
  } catch (error) {
    res.status(500).json({ error: "couldn't get cars" });
  }
};
//? =====================================|auto update car status every day at 11:59 PM|===================================================
// Function to check and update car rental status
async function checkAndUpdateCarStatus() {
  let date = new Date();
  let today = date.toLocaleDateString("en-GB"); // British English: "DD/MM/YYYY"
  console.log(today); // Outputs: e.g., "08/06/2024"

  try {
    const rentals = await db
      .collection("rentals")
      .find({
        return_Date: today,
      })
      .toArray();
    console.log("rentals", rentals);
    if (rentals.length > 0) {
      for (const item of rentals) {
        await db.collection("cars").findOneAndUpdate(
          {
            rental_status: "rented",
            _id: new ObjectId(item.carID),
          },
          { $set: { rental_status: "available" } }
        );
      }
      console.log(`Updated ${rentals.length} cars to 'available' status.`);
    } else {
      console.log("No cars to update today.");
    }
  } catch (error) {
    console.error("Error updating car status:", error);
  }
}

// Function to schedule daily check at 11:59 PM
function scheduleDailyCheck() {
  const now = new Date();
  const targetTime = new Date();

  targetTime.setHours(23, 59, 0, 0); // 11:59 PM today
  let timeUntilCheck = targetTime.getTime() - now.getTime();

  // If the target time has already passed today, schedule for tomorrow
  if (timeUntilCheck < 0) {
    targetTime.setDate(targetTime.getDate() + 1);
    timeUntilCheck = targetTime.getTime() - now.getTime();
  }

  // Schedule the first check
  setTimeout(() => {
    // Run the check at 11:59 PM
    checkAndUpdateCarStatus();
    console.log("checked");

    // Schedule the daily interval after the first check
    setInterval(checkAndUpdateCarStatus, 24 * 60 * 60 * 1000); // Every 24 hours
  }, timeUntilCheck);
}
scheduleDailyCheck();
export {
  addCar,
  updateCar,
  deleteCar,
  getAllCars,
  getCar,
  getCarByModel,
  getAvailableCarByModel,
};
