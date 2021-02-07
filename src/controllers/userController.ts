import express from "express";
import asyncHandler from 'express-async-handler';
import User from "../models/user";

const router = express.Router();

// user endpoints
router.post("/users", asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = await User.create(req.body);
    res.json(user);
}));

router.put("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const oldUserID = req.params.userID;
    const newUser = req.body;

    const result = await User.replaceOne({ "_id": oldUserID }, newUser);
    res.json(result);
}));

router.patch("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const updates = req.body;
    const userID = req.params.userID;

    const user = await User.findOne({ "_id": userID });

    const updatedUser = {
        ...user.toObject(),
        ...updates
    }

    const result = await User.updateOne({ "_id": userID }, updatedUser);
    res.json(result);
}));

router.get("/users", asyncHandler(async (_req: express.Request, res: express.Response) => {
    const users = await User.find({});
    res.json(users);
}));

router.get("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID;

    const user = await User.findOne({ "_id": userID });
    res.json(user);
}));

router.delete("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID;

    if (await User.exists({ "_id": userID })){
        
        await User.deleteOne({ "_id": userID });
        res.json('User deleted successfully.');
    }
    else{
        res.json('User not found.');
    }

}));

export default router;
