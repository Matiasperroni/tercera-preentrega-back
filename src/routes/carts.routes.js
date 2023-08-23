import { Router } from "express";
import {getCarts, createNewCart, getCartByID, addProductToCart, deleteProdFromCart, updateWholeCart, updateQuantity, deleteCart} from "../controllers/carts.controller.js"
const router = Router();




router.get("/", getCarts);

router.post("/", createNewCart);

router.get("/:cid", getCartByID);

router.post("/:cid/product/:pid", addProductToCart);

router.delete("/:cid/products/:pid", deleteProdFromCart);

router.put("/:cid", updateWholeCart);

router.put("/:cid/products/:pid", updateQuantity);

router.delete("/:cid", deleteCart);

export default router;
