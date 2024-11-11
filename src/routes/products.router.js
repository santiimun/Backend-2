import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productsManager = new ProductsManager();


router.get("/", async (req, res) => {
    try {
        const products = await productsManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await productsManager.getOneById(req.params?.id);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const product = await productsManager.insertOne(req.body, req.file);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const product = await productsManager.updateOneById(req.params?.id, req.body, req.file);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await productsManager.deleteOneById(req.params?.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;