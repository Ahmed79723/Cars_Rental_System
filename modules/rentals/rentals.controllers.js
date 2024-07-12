import { ObjectId } from "mongodb";
import { db } from "../../DataBase/dbConnection.js";

//* =====================================|add rental|===================================================
const addRental = async (req, res) => {
  const { carID, customerID, rental_Date, return_Date } = req.body;
  const rental = await db
    .collection("rentals")
    .insertOne({
      carID: new ObjectId(carID),
      customerID: new ObjectId(customerID),
      rental_Date,
      return_Date,
    });
  if (rental.acknowledged) {
    return res.status(201).json({ msg: "success, Happy Driving", rental });
  }
  res.status(404).json({ msg: "rental not added", rental });
};
//* =====================================|update rental|===================================================
const updateRental = async (req, res) => {
  try {
    const rental = await db
      .collection("rentals")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (rental.modifiedCount) {
      return res.status(200).json({ msg: "updated", rental });
    }
    res.status(404).json({ msg: "rental not found", rental });
  } catch (error) {
    res.status(500).json({ error: "couldn't update rental" });
  }
};
//* =====================================|delete rental|===================================================
const deleteRental = async (req, res) => {
  try {
    const rental = await db
      .collection("rentals")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (rental) {
      await db
        .collection("cars")
        .updateOne(
          { _id: new ObjectId(rental.carID) },
          { $set: { rental_status: "available" } }
        );
      const result = await db
        .collection("rentals")
        .deleteOne({ _id: new ObjectId(req.params.id) });
      console.log(result);
      if (result.deletedCount) {
        return res.status(200).json({ msg: "deleted", result });
      }
    } else {
      res.status(404).json({ msg: "rental not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "couldn't delete rental" });
  }
};
//* =====================================|get all cars|===================================================
const getAllRentals = async (req, res) => {
  const rentals = await db.collection("rentals").find({}).toArray();
  res.json({ msg: "success", rentals });
};
//* =====================================|Get a specific rental|===================================================
const getRental = async (req, res) => {
  try {
    const rental = await db
      .collection("rentals")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!rental) {
      return res.status(404).json({ msg: "rental not found", rental });
    }
    res.status(200).json({ msg: "success", rental });
  } catch (error) {
    res.status(500).json({ error: "couldn't find rental" });
  }
};
export { addRental, updateRental, deleteRental, getAllRentals, getRental };
