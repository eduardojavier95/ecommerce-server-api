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

// get products from cart
router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getById(req.params.cid);
    res.json(cart);
});

// delete product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await CartManager.deleteProduct(
            req.params.cid,
            req.params.pid
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update cart
router.put("/:cid", async (req, res) => {
    const { products } = req.body;
    try {
        const cart = await CartManager.updateCart(req.params.cid, products);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update product quantity
router.put("/:cid/products/:pid", async (req, res) => {
    const { quantity } = req.body;
    try {
        const cart = await CartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            quantity
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// clear cart
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await CartManager.clearCart(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
