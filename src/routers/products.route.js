import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager(`${__dirname}/dbs/products.json`);

// get all products
// router.get("/", async (req, res) => {
//     const data = await productManager.getAllProducts(parseInt(req.query.limit));
//     res.send(data);
// });
router.get("/", async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
        const filter = query ? { category: query } : {};
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        };
        const products = await Product.paginate(filter, options);
        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.page - 1 : null,
            nextPage: products.hasNextPage ? products.page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/products?page=${products.page - 1}`
                : null,
            nextLink: products.hasNextPage
                ? `/products?page=${products.page + 1}`
                : null,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// get product by id
router.get("/:pid", async (req, res) => {
    const data = await productManager.getProduct(req.pid);
    res.status(200).send(data);
});

// create product
router.post("/", async (req, res) => {
    const data = await productManager.createProduct(req.body);
    if (data === "no valid") {
        res.status(404).send({
            status: "Data no valid",
            msg: "Please check all fields",
        });
    } else if (data) {
        res.status(200).send(data);
    } else {
        res.status(200).send({
            status: "Created",
            msg: "Product created sucessfully",
        });
    }
});

// update product by id
router.put("/:pid", async (req, res) => {
    await productManager.updateProduct(req.params.pid, req.body);
    res.status(200).send({
        status: "Updated",
        msg: "Product updated sucessfully",
    });
});

// delete product by id
router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    res.status(200).send({
        status: "Deleted",
        msg: "Product deleted sucessfully",
    });
});

export default router;
