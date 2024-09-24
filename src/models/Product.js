import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
