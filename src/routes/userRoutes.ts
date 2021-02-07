import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/users", userController.createNewUser);
router.put("/users/:userID", userController.replaceUser);
router.patch("/users/:userID", userController.updateUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:userID", userController.getSpecificUser);
router.delete("/users/:userID", userController.deleteUser);

export default router;
