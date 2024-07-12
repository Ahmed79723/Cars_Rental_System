import { Router } from "express";
import * as customersController from "./customers.controller.js";
import isExists from "../../middleWares/isExists.js";

const customersRouter = Router();

customersRouter.get("/",customersController.getAllCustomers);
customersRouter.get("/:id",customersController.getCustomer);
customersRouter.post("/",isExists,customersController.addCustomer);
customersRouter.put("/:id",customersController.updateCustomer);
customersRouter.delete("/:id",customersController.deleteCustomer);

export default customersRouter;
