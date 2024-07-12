import { ObjectId } from "mongodb";
import { db } from "../DataBase/dbConnection.js";

const isRented = async (req, res, next) => {
  try {
    let result = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(req.body.carID) });
    console.log(result);
    if (!result) {
      return res.status(500).json({ error: "car not found" });
    } else if (result.rental_status == "rented") {
      return res.status(409).json({ msg: "car is already rented", result });
    } else {
      await db
        .collection("cars")
        .updateOne(
          { _id: new ObjectId(req.body.carID) },
          { $set: { rental_status: "rented" } }
        );
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "couldn't add rental, plz recheck your inputs" });
  }
};

export default isRented;
