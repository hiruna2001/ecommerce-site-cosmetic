import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productID: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        alternativeNames: {
            type: [String],
            default: [],
            require: true

        },
        description: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            default: [],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        labelPrice: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        }
    }

)

const Product = mongoose.model("Product", productSchema);
export default Product;