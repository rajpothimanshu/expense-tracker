// import express from "express";
// import { login , logout, register} from "../controller/user.controller.js";


// const router = express.Router();


// router.route("/register").post(register)   
// router.route("/login").post(login);
// router.route("/logout").post(logout)
// export d
// efault router;




import express from "express";
import { login, logout, register } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)


export default router;
