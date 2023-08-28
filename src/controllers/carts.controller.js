// import CartManagerDB from "../dao/mongo/carts.manager.js";
// const cartManager = new CartManagerDB();
// import ProductDTO from '../dto/products.dto.js';
import { cartRepository } from "../repositories/index.js";

export const getCarts = async (req, res) => {
    const carts = await cartRepository.getAllCarts();
    res.send(carts);
};

export const createNewCart = async (req, res) => {
    try {
        const cart = await cartRepository.createNewCart();
        res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
};

export const getCartByID = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await cartRepository.getById(cartID);
        const products = cart.products;
        // res.send({products});
        res.render("cart", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
};

export const addProductToCart = async (req, res) => {
    //TODO: Hacer que se agreguen los productos y se cree el carrito si no existe
    try {
        const cartID = req.params.cid;
        const prodID = req.params.pid;
        const cart = await cartRepository.getById(cartID);
        console.log(cart);
        if (cart) {
            const existingProd = cart.products.find(
                (product) => product.product._id.toString() === prodID
            );
            if (existingProd) {
                const quantity = existingProd.quantity + 1;
                await cartRepository.updateQuantity(cartID, prodID, quantity);
                return;
            }
        }
        const productAddedToCart = await cartRepository.addToCart(
            cartID,
            prodID
        );
        res.send(productAddedToCart);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error, unable to obtain data");
    }
};

export const deleteProdFromCart = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;
    const deleted = await cartRepository.deleteProduct(cartID, prodID);
    res.send(deleted);
};

export const updateWholeCart = async (req, res) => {
    const cartID = req.params.cid;
    const prod = req.body;
    // console.log(cartID, prod);
    const updatedCart = await cartRepository.updateWholeCart(cartID, prod);
    // console.log("a ver", updatedCart);
    res.send(updatedCart);
};

export const updateQuantity = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await cartRepository.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
};

export const deleteCart = async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await cartRepository.emptyCart(cid);
    console.log(deletedCart);
    res.send(deletedCart);
};

export const finishPurchase = async (req, res) => {
    try {
        console.log("reqsessionuser", req?.session?.user);
        const user = req?.session?.user;
        const cartID = req.params.cid;
        const cart = await cartRepository.purchase(cartID, user.email);
        console.log("el cart", cart);
        cart.newTicket.purchaser = `Name: ${user.first_name} Last Name: ${user.last_name}. Email: ${user.email}`;
        if(cart) {
            const newTicket = cart.newTicket;
            res.render("purchase", {newTicket});
        } else {
            res.status(500).send("error: error trying to purchase.")
        }


        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error purchasing.");
    }
};
