import { ObjectId } from "mongodb";
import { db } from "../../DataBase/dbConnection.js";

//* =====================================|add customer|===================================================
const addCustomer = async (req, res) => {
  let customer = await db.collection("customers").insertOne(req.body);
  if (customer.acknowledged) {
    return res.status(201).json({ msg: "success", customer });
  }
  res.status(404).json({ msg: "customer not added", customer });
};
//* =====================================|update customer|===================================================
const updateCustomer = async (req, res) => {
  try {
    const customer = await db
      .collection("customers")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (customer.modifiedCount) {
      return res.status(200).json({ msg: "updated", customer });
    }
    res.status(404).json({ msg: "customer not found", customer });
  } catch (error) {
    res.status(500).json({ error: "couldn't update customer" });
  }
};
//* =====================================|delete customer|===================================================
const deleteCustomer = async (req, res) => {
  try {
    const customer = await db
      .collection("customers")
      .deleteOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (customer.deletedCount) {
      return res.status(200).json({ msg: "deleted", customer });
    }
    res.status(404).json({ msg: "customer not found", customer });
  } catch (error) {
    res.status(500).json({ error: "couldn't delete customer" });
  }
};
//* =====================================|get all customers|===================================================
const getAllCustomers = async (req, res) => {
  let customers = await db.collection("customers").find({}).toArray();
  res.json({ msg: "success", customers });
};
//* =====================================|get specific customer|===================================================
const getCustomer = async (req, res) => {
  try {
    let customer = await db
      .collection("customers")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!customer) {
      return res.status(404).json({ msg: "customer not found", customer });
    }
    res.status(200).json({ msg: "success", customer });
  } catch (error) {
    res.status(500).json({ error: "couldn't get customer" });
  }
};
export {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
};
