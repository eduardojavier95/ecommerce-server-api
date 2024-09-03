import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager(`${__dirname}/dbs/products.json`);

// get all products
router.get("/", async (req, res) => {
    const data = await productManager.getAllProducts(parseInt(req.query.limit));
    res.render("home", { products: data });
});

// real time products
router.get("/realtimeproducts", async (req, res) => {
    const data = await productManager.getAllProducts();
    res.render("realtimeproducts", { products: data });
});

export default router;
