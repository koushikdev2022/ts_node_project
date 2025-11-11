import express, { Router } from "express";
const userRoute: Router = express.Router();
import {register} from "../../../controller/api/user/auth/auth.controller";

userRoute.post("/create",register)


export default userRoute;