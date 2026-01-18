import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderID: {
            type: String,
            required: true,
            unique: true
        },
        items: {
            type: [
                {
                    productID: {
                        type: String,
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true
                    },
                    image: {
                        type: String,
                        required: true
                    }
                }
            ],
            required: true,
        },
        customerName: {
            type: String,
            required: true  
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: Object,
            required: true,
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "pending", // "pending", "shipped", "delivered"
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)
const order = mongoose.model("order", orderSchema)
export default order