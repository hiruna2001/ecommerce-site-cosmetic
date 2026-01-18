import Order from "../models/order.js"
import Product from "../models/product.js"
import User from "../models/user.js"
import { isAdmin } from "./userController.js"
export async function createOrder(req, res) {

    //RC00000
    // if (req.user == null) {
    //     res.status(401).json(
    //         {
    //             message: "Unauthorized"
    //         }
    //     )
    //     return
    // }
    try {

        const user = req.user
        if (user == null) {
            res.status(401).json(
                {
                    message: "Unauthorized"
                }
            )
            return
        }

        const orderList = await Order.find().sort({ date: -1 }).limit(1)

        let newOrderID = "RC00000"

        if (orderList.length != 0) {

            let lastOrderIDInString = orderList[0].orderID
            let lastOrderNumberInString = lastOrderIDInString.replace("RC", "")
            let lastOrderNumber = parseInt(lastOrderNumberInString)
            let newOrderNumber = lastOrderNumber + 1
            //padStart
            let newOrderNumberInString = newOrderNumber.toString().padStart(7, "0")
            newOrderID = "RC" + newOrderNumberInString;


        }

        let customerName = req.body.customerName;
        if (customerName == null) {
            customerName = user.firstName + " " + user.lastName
        }

        let phone = req.body.phone;
        if (phone == null) {
            phone = "Not provided";
        }

        const itemsInRequest = req.body.items;
        if (itemsInRequest == null) {
            res.status(400).json(
                {
                    message: "Items not provided"
                }
            )
            return
        }
        if (!Array.isArray(itemsInRequest)) {
            res.status(400).json(
                {
                    message: "Items Should Be An Array."
                }
            )
            return
        }
        const itemsToBeAdded = []
        let total = 0

        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];
            const product = await Product.findOne({ productID: item.productID })

            if (product == null) {
                res.status(404).json({
                    code: "not_found",
                    message: `Product ${item.productID} Not Found`,
                    productID: item.productID
                });
                return;
            }

            if (item.quantity > product.stock) {
                res.status(400).json({
                    code: "stock",
                    message: `Product ${item.productID} Quantity Not Sufficient`,
                    productID: item.productID
                });
                return;
            }

            itemsToBeAdded.push({
                productID: item.productID,
                quantity: item.quantity,
                name: product.name,
                price: product.price,
                image: product.images[0]
            }
            )
            total = total + product.price * item.quantity

        }





        const newOrder = new Order(
            {
                orderID: newOrderID,
                items: itemsToBeAdded,
                customerName: customerName,
                email: user.email,
                address: req.body.address,
                phone: phone,
                total: total,
                status: "Pending"


            }
        )
        const savedOrder = await newOrder.save()

        for (let i = 0; i < itemsToBeAdded.length; i++) {
            const item = itemsToBeAdded[i]
            await Product.updateOne(
                { productID: item.productID },
                { $inc: { stock: -item.quantity } }
            )
        }
        res.status(201).json(
            {
                message: "Order Created Successfully",
                order: savedOrder
            }
        )


    }
    catch (error) {
        res.status(500).json(
            {
                message: "Order Creation Failed",
                error: error.message
            }
        )

    }

}

export async function getOrders(req, res) {
    if (isAdmin(req)) {
        const orders = await Order.find().sort({ date: -1 })
        res.json(orders)
    } else if (isCustomer(req)) {
        const orders = await Order.find({ email: req.user.email }).sort({ date: -1 })
        res.json(orders)

    } else {
        res.status(401).json({
            message: "You Are Unauthorized To View Orders."
        })
    }
}

export async function updateOrderStatus(req, res) {

    if (!isAdmin(req)) {

        res.status(401).json(
            {
                message: "Unauthorized"
            }
        )
        return
    }

    const orderID = req.params.orderID
    const newStatus = req.body.status

    try {
        await Order.updateOne(
            { orderID: orderID },
            { $set: { status: newStatus } }
        )
        res.json(
            {
                message: "Order Status Updated Successfully"
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                message: "Order Status Update Failed",
                error: error.message
            }
        )
    }





}