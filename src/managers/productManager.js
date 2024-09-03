import { readFile, writeFile, appendFile } from "node:fs/promises";
import { uuidv7 } from "uuidv7";

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAllProducts(limit) {
        try {
            // get all products from file
            const fileContent = await readFile(this.filePath, {
                encoding: "utf8",
            });
            if (fileContent) {
                return limit
                    ? JSON.parse(fileContent).slice(0, limit)
                    : JSON.parse(fileContent);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Error al buscar productos ${error.message}`);
        }
    }

    async getProduct(pid) {
        try {
            // get all products from file
            allProducts = await this.getAllProducts();
            // get product by id
            allProducts.forEach((product) => {
                if (product.id === pid) {
                    return product;
                }
            });
            return [];
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
            // get all products from file
            const allProducts = await this.getAllProducts();
            let newProduct = {};
            let msg = "";
            allProducts.forEach((val) => {
                if (val.code === product.code) {
                    return (msg = `Error al crear el producto con codigo ${val.code}, ya existe`);
                }
            });

            if (msg) {
                return msg;
            }
            newProduct = { id: uuidv7(), ...product };
            allProducts.push(newProduct);
            await writeFile(
                this.filePath,
                JSON.stringify(allProducts, null, 2)
            );
        } catch (error) {
            throw new Error(`Error al crear el producto. ${error.message}`);
        }
    }

    async updateProduct(pid, newProduct) {
        try {
            // get all products from file
            const allProducts = await this.getAllProducts();

            let indexProd = -1;

            // find the product by id
            allProducts.forEach((prod, index) => {
                if (pid === prod.id) {
                    indexProd = index;
                }
            });
            allProducts.splice(indexProd, 1, { pid, ...newProduct });
            await writeFile(
                this.filePath,
                JSON.stringify(allProducts, null, 2)
            );
        } catch {
            throw new Error(
                `Error al actualizar el producto con id: ${pid}.  ${error.message}`
            );
        }
    }

    async deleteProduct(pid) {
        try {
            // get all products from file
            const allProducts = await this.getAllProducts();

            let indexProd = -1;
            allProducts.forEach((prod, index) => {
                if (pid === prod.id) {
                    indexProd = index;
                }
            });

            const spliced = allProducts.toSpliced(indexProd, 1);

            await writeFile(this.filePath, JSON.stringify(spliced, null, 2));
        } catch (error) {
            throw new Error(
                `Error al eliminar el producto con id: ${pid}.  ${error.message}`
            );
        }
    }
}

export default ProductManager;
