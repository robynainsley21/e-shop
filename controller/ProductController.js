import express from "express";
import bodyParser from "body-parser";
import { Products } from "../model/index.js";

const userRouter = express.Router();

userRouter.use(bodyParser.json())

userRouter.get('/', (req, res) => {
    Products.fetchProducts(req, res)
})

userRouter.get('/:id', (req, res) => {
    Products.fetchProduct(req, res)
})

userRouter.post('/add', (req, res) => {
    Products.addProduct(req, res)
})

userRouter.patch('/product/:id', (req, res) => {
    Products.updateProduct(req, res)
})

userRouter.delete('/product/:id', (req, res) => {
    Products.deleteProduct(req, res)
})

export {
    express,
    userRouter
}