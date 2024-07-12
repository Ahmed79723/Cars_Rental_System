import express from "express";
import { db } from "./DataBase/dbConnection.js";
import customersRouter from "./modules/customers/customers.routes.js";
import carsRouter from "./modules/cars/cars.routes.js";
import rentalsRouter from "./modules/rentals/rentals.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/customers", customersRouter);
app.use("/cars", carsRouter);
app.use("/rentals", rentalsRouter);

app.get("/", (req, res) => res.send("Welcome to my Car Rental System"));
app.listen(port, () => console.log(`App listening on port ${port}!`));