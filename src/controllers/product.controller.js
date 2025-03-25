import Controllers from "./controller.manager.js";
import { productService } from "../services/product.service.js";

class ProductsController extends Controllers{
    constructor(){
        super(productService)
    }

    getAll = async (req, res, next) => {
        try {
            const products = await this.service.getAll(req.query);
            res.status(200).json({ status: "success", payload: products });
        } catch (error) {
            next (error)
        }
    }

    getByOneId = async (req,res,next) => {
        try {
            const product = await this.service.getById(req.params.id);
        res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            next (error)
        }
    }

    insertProd = async (req, res, next) => {
        try {
            const product = await this.service.insertOne(req.body);
            res.status(201).json({ status: "success", payload: product });
        } catch (error) {
            next(error)
        }
    }

    updateProd = async (req,res,next) => {
        try {
            const product = await this.service.updateOneById(req.params?.id, req.body);
            res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            next (error)
        }
    }
    deleteProd = async (req, res, next) => {
        try {
            await this.service.deleteOneById(req.params?.id);
            res.status(200).json({ status: "success" });
        } catch (error) {
            next (error)
        }
    }
}

export const productController = new ProductsController();
