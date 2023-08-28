export default class MessageRepository {
    constructor(dao) {
        this.dao = dao;
    }
    addMessage = async () => {
        const message = await this.dao.addMessage()
        return message;
    }
    getMessages = async () => {
        const message = await this.dao.getMessages()
        return message;
    }
}