import {Router} from "express";
import ordersController from "../controllers/orders.controller";

import {verifyToken} from "../middlewares/auth.middleware";


const ordersRoute: Router = Router();

ordersRoute.get("/all", verifyToken, ordersController.getOrders);

export default ordersRoute;
