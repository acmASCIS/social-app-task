import express from "express";
import asyncHandler from 'express-async-handler';
import User from "../models/user";

// user functions
const user = {

    createNewUser: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const user = await User.create(req.body);
        res.json(user);
    })),

    replaceUser: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const oldUserID = req.params.userID;
        const newUser = req.body;

        await User.replaceOne({ "_id": oldUserID }, newUser);
        res.json('User replaced successfully.');
    })),

    updateUser: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const updates = req.body;
        const userID = req.params.userID;

        const user = await User.findOne({ "_id": userID });

        const updatedUser = {
            ...user.toObject(),
            ...updates
        }

        await User.updateOne({ "_id": userID }, updatedUser);
        res.json('User updated successfully.');
    })),

    getAllUsers: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const users = await User.find({});
        res.json(users);
    })),

    getSpecificUser: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const userID = req.params.userID;

        const user = await User.findOne({ "_id": userID });
        res.json(user);
    })),

    deleteUser: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const userID = req.params.userID;

        if (await User.exists({ "_id": userID })) {

            await User.deleteOne({ "_id": userID });
            res.json('User deleted successfully.');
        }
        else {
            res.json('User not found.');
        }
    }))

}

export default user;
