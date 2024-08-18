import { readFile, writeFile, appendFile } from "node:fs/promises";
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
            // get all carts from file
            const allCarts = await this.getAllCarts();
            let prods = [];
            // get cart by id
            allCarts.forEach((cart) => {
                if (cart.id === cid) {
                    cart.products.forEach((prod) => prods.push(prod));
                }
            });

            return prods ? prods : [];
        } catch (error) {
            throw new Error(
                `Error al buscar el carrito con id: ${cid}.  ${error.message}`
            );
        }
    }

    async createCart(cart) {
        try {
            // get all carts from file
            const allCarts = await this.getAllCarts();
            let newCart = { id: uuidv7(), products: [...cart] };
            allCarts.push(newCart);
            await writeFile(this.filePath, JSON.stringify(allCarts, null, 2));
        } catch (error) {
            console.log(this.filePath);

            throw new Error(`Error al crear el carrito. ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {
        // Agregar el producto al carrito especificado (si el producto ya exite aumentar la cantidad)
        try {
            // get all carts from file
            const allCarts = await this.getAllCarts();
            let existCart = false;
            let existProd = false;
            allCarts.forEach((cart, index) => {
                if (cart.id === cid) {
                    existCart = true;
                    cart.products.forEach((prod) => {
                        if (prod.product === pid) {
                            existProd = true;
                            prod.quantity += 1;
                        }
                    });
                }
            });
            if (!existCart) {
                return `Carrito con id ${cid} no encontrado.`;
            }

            if (!existProd) {
                const newProd = { product: pid, quantity: 1 };
                let index = -1;
                allCarts.forEach((cart, i) => {
                    if (cart.id === cid) {
                        index = i;
                    }
                });
                allCarts[index].products = [
                    ...allCarts[index].products,
                    newProd,
                ];
            }

            await writeFile(this.filePath, JSON.stringify(allCarts, null, 2));
        } catch (error) {
            throw new Error(
                `Error al agregar el producto con id: ${pid} al carrito con id ${cid}.  ${error.message}`
            );
        }
    }
}

export default CartManager;
