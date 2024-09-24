import { readFile, writeFile, appendFile } from "node:fs/promises";
import { uuidv7 } from "uuidv7";

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw new Error(`Error al buscar productos ${error.message}`);
        }
    }

    async getProduct(pid) {
        try {
            const product = await Product.findById(pid);
            return product;
        } catch (error) {
            throw new Error(
                `Error al buscar el producto con id: ${pid}.  ${error.message}`
            );
        }
    }

    async createProduct(product) {
        try {
            // Validate data
            if (
                !product.title ||
                !product.description ||
                !product.code ||
                !product.price ||
                !product.stock ||
                !product.category
            ) {
                return "no valid";
            }
            const newProduct = await Product.create(product); // Crear un nuevo producto en MongoDB
            return newProduct;
        } catch (error) {
            throw new Error(`Error al crear el producto. ${error.message}`);
        }
    }

    async updateProduct(pid, newProduct) {
        try {
            const product = await Product.findByIdAndUpdate(pid, newProduct, {
                new: true,
            });
            return product;
        } catch (error) {
            throw new Error(
                `Error al actualizar el producto con id: ${pid}.  ${error.message}`
            );
        }
    }

    async deleteProduct(pid) {
        try {
            await Product.findByIdAndDelete(productId); // Eliminar producto por ID en MongoDB
        } catch (error) {
            throw new Error(
                `Error al eliminar el producto con id: ${pid}.  ${error.message}`
            );
        }
    }
}

export default ProductManager;
