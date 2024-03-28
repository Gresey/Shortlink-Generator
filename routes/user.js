import { Router } from "express";
import {handleUserSignup} from "../controller/user.js"; // Corrected path
import { handleUserLogin } from "../controller/user.js";
const router = Router(); // Change Router to router

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);


export default router; 