import { Router } from "express";
import * as rentalsController from "./rentals.controllers.js";
import isRented from "../../middleWares/isRented.js";

const rentalsRouter = Router();

rentalsRouter.get("/", rentalsController.getAllRentals);
rentalsRouter.get("/:id", rentalsController.getRental);
rentalsRouter.post("/", isRented, rentalsController.addRental);
rentalsRouter.put("/:id", rentalsController.updateRental);
rentalsRouter.delete("/:id", rentalsController.deleteRental);

export default rentalsRouter;
