import { Router } from "express";
import CartsManager from "../managers/CartsManager.js";

const router = Router();
const cartsManager = new CartsManager();

// Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartsManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Obtener un carrito por su ID
router.get("/:id", async (req, res) => {
    try {
        const cart = await cartsManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = await cartsManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Agregar un producto a un carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsManager.addOneProduct(cid, pid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});






router.delete("/:id", async (req, res) => {
    try {
        await cartsManager.deleteOneById(req.params?.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});



// Eliminar un producto de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const cart = await cartsManager.removeProduct(cid, pid); // Método que deberás implementar en CartsManager
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartsManager.updateCart(cid, req.body); // Método que deberás implementar en CartsManager
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser un número mayor que 0" });
        }
        const cart = await cartsManager.updateProductQuantity(cid, pid, quantity); // Método que deberás implementar en CartsManager
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid/products", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsManager.clearCart(cid); // Método que deberás implementar en CartsManager
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;
