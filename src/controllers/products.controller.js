import productsManagerDB from "../dao/mongo/products.manager.js";
import CartManagerDB from '../dao/mongo/carts.manager.js';
import productsModel from "../dao/models/products.schema.js";

const productManager = new productsManagerDB();

export const getProducts = async (req, res) => {
    const { page, query, limit, order } = req.query;
    let sortBy;
    if(order === "desc") {
        sortBy = -1;
    } else if (order === "asc"){
        sortBy = 1;
    }
    let products;
    if (!query) {
        products = await productsModel.paginate(
            {},
            {
                limit: limit ?? 3,
                lean: true,
                page: page ?? 1,
                sort: { price: sortBy },
            }
        );
    } else {
        products = await productsModel.paginate(
            { category: query},
            {
                limit: limit ?? 3,
                lean: true,
                page: page ?? 1,
                sort: { price: sortBy },
            }
        );
    }
    const cartManager = new CartManagerDB;
    res.render("products", { products, query, order,  user: req.session.user });
};

export const getProductById = async (req, res) => {
    try {
        const pID = req.params.pid;
        const pFound = await productManager.getProductById(pID);
        res.send(pFound);
    } catch (error) {
        res.status(500).send("Error");
    }
};

export const addProduct = async(req, res) => {
    const product = req.body;
    await productManager.addProduct(product);
    res.send({ status: "success" });
};

export const updateProduct = async (req, res) => {
    const prodID = req.params.pid;
    const prodToAdd = req.body;
    const prodToUpdate = await productManager.updateProduct(prodID, prodToAdd);
    res.send(prodToUpdate);
};

export const deleteProduct = async (req, res) => {
    try {
        const prodID = req.params.pid;
        const productToDelete = await productManager.deleteProduct(prodID);
        res.send(productToDelete);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting data.");
    }
};

