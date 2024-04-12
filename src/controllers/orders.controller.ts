import {Request, Response} from 'express';
import Order from '../models/order';

const getOrders = async (req : Request, res : Response) => {
    try {
        const orders = await Order.find();
        if (! orders) {
            res.json({errorMsg: "No Article"})
        }
        res.json({orders: orders})
    } catch (error) {
        res.json({error: error});
    }
}


const ordersController = {
    getOrders
}

export default ordersController;
