import { Router } from 'express';
import {isConnected, isDisconnected, isAdmin} from "../middlewares/middlewares.js";
import { addMessage, getMessages, register, login, profile} from "../controllers/views.controller.js"

const router = Router();


router.post("/chat/:user/:message", addMessage)

router.get("/chat", getMessages)

router.get('/register', isConnected, register)

router.get('/login', isConnected, login)

router.get('/current', isDisconnected, isAdmin, profile)



export default router;