import { readFile, writeFile, appendFile } from "node:fs/promises";
import Cart from "../models/Cart.js";
import { uuidv7 } from "uuidv7";

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async getAllCarts() {
        try {
            // get all carts from file
            const fileContent = await readFile(this.filePath, {
                encoding: "utf8",
            });

            if (fileContent) {
                return JSON.parse(fileContent);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Error al buscar carritos ${error.message}`);
        }
    }

    async getCart(cid) {
        // Listar los products dentro del carrito con el id dado
        try {
            const cart = await Cart.findById(cid).populate("products.product"); // Obtener carrito y popular productos
            return cart;
        } catch (error) {
            throw new Error(
                `Error al buscar el carrito con id: ${cid}.  ${error.message}`
            );
        }
    }

    async createCart(cart) {
        try {
            let newCart = await Cart.create(cart);
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito. ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {
        // Agregar el producto al carrito especificado (si el producto ya exite aumentar la cantidad)
        try {
            const cart = await Cart.findById(cid);
            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === pid
            );

            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: pid, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(
                `Error al agregar el producto con id: ${pid} al carrito con id ${cid}.  ${error.message}`
            );
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            cart.products = cart.products.filter(
                (p) => p.product.toString() !== pid
            );
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw error;
        }
    }

    async clearCart(cid) {
        try {
            const cart = await Cart.findById(cid);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);
            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === pid
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart;
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error(
                "Error al actualizar la cantidad del producto en el carrito:",
                error
            );
            throw error;
        }
    }
}

export default CartManager;
