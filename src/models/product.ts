import mongoose, {Document, Schema, Model} from 'mongoose';

export interface IProduct extends Document {
    name: string,
    category: string,
    sub_category?: string,
    unit_of_measure: string,
    article_code_and_model: Array < { [key: string]: string } >,
    min_pack: number,
    trans_pack: number,
    stock: number,
    vp_price: number,
    net_price: number,
    rebate: number,
}

export interface IProductModel extends Model < IProduct > {}

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        default: null
    },
    unit_of_measure: {
        type: String,
        required: true
    },
    article_code_and_model: {
        type: Array < { [key: string]: string } >,
        required: true   
    },
    min_pack: {
        type: Number,
        required: true,
    },
    trans_pack: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    vp_price: {
        type: Number,
        required: true
    },
    net_price: {
        type: Number,
        required: true
    },
    rebate: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const Product = mongoose.model<IProduct, IProductModel>('Product', productSchema);

export default Product;
