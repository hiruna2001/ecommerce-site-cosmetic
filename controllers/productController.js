import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message:"Unauthorized"
        })
        return;
    }

    
    try{
        const productData = req.body;

        const product = new Product(productData)

        await product.save()

        res.json({

            message: "Product Created Successfully"
        }
        );
    }
    catch{
        res.json({
            message:"Product Creation Failed"
        })
    }


}


export async function getProducts(req,res){
    
    try{
        const products = await Product.find()
        res.json(products)
    }catch{
        console.error(error)
        res.status(401).json({
            message: "Failed to fetch products"
    })
    }
}

export async function deleteProduct(req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message:"Unauthorized"
        })
        return;
    }
    try{
        const productID= req.params.productID


        await Product.deleteOne({productID:productID})
        res.json({
            message:"Product Deleted Successfully"
        })
    }
    catch(error){
        res.status(500). json({
            message:"Product Deletion Failed"
        })
    }
}

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(401).json({
            message:"Unauthorized"
        })
        return;
    }
    
    try{
        const productID = req.params.productID
        const updateData = req.body

        await Product.updateOne(
            {productID:productID},
            updateData
        )
        res.json({
            message:"Product Updated Successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Product Update Failed"
        })
    }

    } 

export async function getProductByID(req,res){
    try{
        const productID= req.params.productID
        const product = await Product.findOne(
            {productID:productID}
        )
        if(product==null){
            res.status(404).json({
                message:"Product Not Found "
            })
        }else{
            res.json(product)   
        }
    }catch{
        res.status(500).json({
            message:"Product Not Found"
        })
    }
}