import mongoose, {Document, Schema, Model} from 'mongoose';

export interface IOrder extends Document {
    itemNum: string;
    prodCode: string;
    prodName: string;
    prodCate: string;
    unit: string;
    salePrice: string;
}

export interface IOrderModel extends Model < IOrder > {}

const orderSchema: Schema = new Schema({
    itemNum: {
        type: String,
        required: true
    },
    prodCode: {
        type: String,
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    prodCate: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    salePrice: {
        type: String
    },
    
}, {timestamps: true})

const Order = mongoose.model<IOrder, IOrderModel>('Order', orderSchema);

export default Order;
