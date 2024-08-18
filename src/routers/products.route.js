import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager(`${__dirname}/dbs/products.json`);

// get all products
router.get("/", async (req, res) => {
    const data = await productManager.getAllProducts(parseInt(req.query.limit));
    res.send(data);
});

// get product by id
router.get("/:pid", async (req, res) => {
    const data = await productManager.getProduct(req.pid);
    res.send(data);
});

// create product
router.post("/", async (req, res) => {
    const data = await productManager.createProduct(req.body);
    if (data === "no valid") {
        res.send({ status: "Data no valid", msg: "Please check all fields" });
    } else if (data) {
        res.send(data);
    } else {
        res.send({
            status: "Created",
            msg: "Product created sucessfully",
        });
    }
});

// update product by id
router.put("/:pid", async (req, res) => {
    await productManager.updateProduct(req.params.pid, req.body)
    res.send({ status: "Updated", msg: "Product updated sucessfully" });
});

// delete product by id
router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(req.params.pid)
    res.send({ status: "Deleted", msg: "Product deleted sucessfully" });
});

export default router;
