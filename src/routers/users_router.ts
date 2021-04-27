import express, { json } from "express";
import { body, validationResult } from "express-validator";
import UsersController from "../controllers/users_controller"


const router = express.Router();

router.post("/", body("email").isEmail(), UsersController.postUser);

router.put("/:userId", body("email").isEmail(), UsersController.replaceUser);

router.patch("/:userId", body("email").isEmail(), UsersController.updateUser);

router.get("/", UsersController.getAllUsers);

router.get("/:userId", UsersController.getUserById);

router.delete("/:userId", UsersController.deleteUser);


export default router;