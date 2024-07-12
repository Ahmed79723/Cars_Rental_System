import bcrypt from "bcrypt";
import { db } from "../DataBase/dbConnection.js";

const isExists = async (req, res, next) => {
  let result = await db.collection("customers").findOne({email: req.body.email});
  if (result) {
    return res.status(409).json({ msg: "User already exists", result });
  }
  req.body.pass = bcrypt.hashSync(req.body.pass, 8);
  next();
};

export default isExists;
