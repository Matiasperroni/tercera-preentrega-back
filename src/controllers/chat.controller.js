import ProductsManagerDB from "../dao/mongo/products.manager.js";
import MessagesManagerDB from "../dao/mongo/messages.manager.js";



const productManager = new ProductsManagerDB();
const messageManager = new MessagesManagerDB();

const sendProductList = async () => {
    const products = await productManager.getProducts();
    return products;
};

export const ioConnection = async (socket) => {
    console.log("Nuevo cliente conectado");
    const products = await sendProductList();
    socket.emit("sendProducts", products);

    socket.on("message", async (data) => {
        console.log("from data", data);
        let user = data.user;
        let message = data.message;
        await messageManager.addMessage(user, message);
        const messages = await messageManager.getMessages();
        socket.emit("messageLogs", messages);
    });
};

export const realTimeProducts = async (req, res) => {
    res.render("realTimeProducts");
};