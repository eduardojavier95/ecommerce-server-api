import { Router } from "express";
import CartManager from "../managers/cartManager.js";
import __dirname from "../utils.js";

const router = Router();
const cartManager = new CartManager(`${__dirname}/dbs/carts.json`);

// get cart by id
router.get("/:pid", async (req, res) => {
    const data = await cartManager.getCart(req.params.pid);
    res.send(data);
});

// create cart
router.post("/", async (req, res) => {
    await cartManager.createCart(req.body);
    res.send({ status: "Created", msg: "Cart created sucessfully" });
});

// add product to cart
router.post("/:cid/product/:pid", async (req, res) => {
    await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.send({ status: "Added", msg: "Cart updated sucessfully" });
});

export default router;
