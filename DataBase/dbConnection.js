import { MongoClient } from "mongodb";

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
await client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch((err) => {
    console.log("db err", err);
  });
export const db = client.db("Car_Rental_System");
