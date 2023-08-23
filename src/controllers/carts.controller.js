import CartManagerDB from "../dao/mongo/carts.manager.js";
const cartManager = new CartManagerDB();

export const getCarts = async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send(carts);
}

export const createNewCart = async (req, res) => {
    try {
        const products = req.body;
        const cartAdded = await cartManager.createNewCart(products);
        res.send(cartAdded);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
};

export const getCartByID = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await cartManager.getCartByID(cartID);
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
        const cart = await cartManager.getCartByID(cartID);
        console.log(cart);
        if (cart) {
            const existingProd = cart.products.find(
                (product) => product.product._id.toString() === prodID
            );
            if (existingProd) {
                const quantity = existingProd.quantity + 1;
                await cartManager.updateQuantity(cartID, prodID, quantity);
                return;
            }
        }
        const productAddedToCart = await cartManager.addToCart(cartID, prodID);
        res.send(productAddedToCart);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error, unable to obtain data");
    }
};

export const deleteProdFromCart = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;
    const deleted = await cartManager.deleteProdFromCart(cartID, prodID);
    res.send(deleted);
};

export const updateWholeCart = async (req, res) => {
    const cartID = req.params.cid;
    const prod = req.body;
    // console.log(cartID, prod);
    const updatedCart = await cartManager.updateWholeCart(cartID, prod);
    // console.log("a ver", updatedCart);
    res.send(updatedCart);
};

export const updateQuantity = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await cartManager.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
};

export const deleteCart = async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await cartManager.emptyCart(cid);
    console.log(deletedCart);
    res.send(deletedCart);
};