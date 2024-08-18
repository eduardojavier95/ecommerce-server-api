import express from 'express'
import productsRouter from './routers/products.route.js'
import cartsRouter from './routers/carts.route.js'


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get('/ping', (req, res) => {
    res.send("pong")
})


app.listen(PORT, () => console.log("Escuchando el puerto 8080"))

