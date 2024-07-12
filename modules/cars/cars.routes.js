import { Router } from "express";
import * as carsController from "./cars.controllers.js";

const carsRouter = Router();

carsRouter.get("/", carsController.getAllCars);
carsRouter.get("/model", carsController.getCarByModel);
carsRouter.get("/available", carsController.getAvailableCarByModel);
carsRouter.get("/:id", carsController.getCar);
carsRouter.post("/", carsController.addCar);
carsRouter.put("/:id", carsController.updateCar);
carsRouter.delete("/:id", carsController.deleteCar);

export default carsRouter;
