import { messageRepository, productRepository } from '../repositories/index.js';

const sendProductList = async () => {
    const products = await productRepository.getProducts();
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
        await messageRepository.addMessage(user, message);
        const messages = await messageRepository.getMessages();
        socket.emit("messageLogs", messages);
    });
};

export const realTimeProducts = async (req, res) => {
    res.render("realTimeProducts");
};