import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import handlebars, { create } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./routers/products.route.js";
import cartsRouter from "./routers/carts.route.js";
import viewsRouter from "./routers/views.route.js";

const app = express();
const httpServer = createServer(app);
const socketServer = new Server(httpServer);
const PORT = 8080;

// connect to database
const MONGO_URI = "";
const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to database", error);
    }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuracion para handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/views", viewsRouter);

app.get("/", (req, res) => {
    res.send("Pagina principal");
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

socketServer.use((socket, next) => {
    const baseUrl = socket.request.headers.host;
    const url = socket.request.headers.referer;
    const urlCompleta = `http://${baseUrl}/api/views/realtimeproducts`;

    if (url === urlCompleta) {
        console.log("Conectado a la ruta de real time products");
        next();
    }
});

socketServer.on("connection", (socket) => {
    // toda la logica referente a socket va aqui dentro

    console.log("Nuevo cliente conectado");

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });

    socket.on("product", (data) => {
        const baseUrl = socket.request.headers.host;
        const absoluteUrl = `http://${baseUrl}/api/products`;

        fetch(absoluteUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok && res.status !== "Data no valid") {
                    return fetch(absoluteUrl, {
                        method: "GET",
                    });
                } else {
                    throw new Error("Error al crear el producto");
                }
            })
            .then((res) => res.json())
            .then((products) => {
                socketServer.emit("updateProducts", products);
                console.log("Producto creado con exito");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

    socket.on("deleteProduct", (productId) => {
        const baseUrl = socket.request.headers.host;
        const absoluteUrlDelete = `http://${baseUrl}/api/products/${productId}`;
        const absoluteUrlAllProducts = `http://${baseUrl}/api/products`;
        fetch(absoluteUrlDelete, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    return fetch(absoluteUrlAllProducts, {
                        method: "GET",
                    });
                } else {
                    throw new Error("Error al eliminar el producto");
                }
            })
            .then((res) => res.json())
            .then((products) => {
                socketServer.emit("updateProducts", products);
                console.log("Producto eliminado con exito");
            })
            .catch((error) => {
                console.error("Error eliminando:", error);
            });
    });
});
