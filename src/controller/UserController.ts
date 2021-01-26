import express from 'express';
import User from "../Model/User";

const createUser = async (req: express.Request, res: express.Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.json({
            status: "Failed",
            error: "please add all the fields",
        });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
        return res.json({
            status: "Failed",
            error: "email already exists",
        });

    const newUser = await new User({ name, email }).save();
    return res.json({
        user: newUser,
    });
}



const replaceUser = async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const { name, email } = req.body;
    const oldUser = await User.findById(id);

    if (!name || !email) {
        return res.json({
            status: "Failed",
            error: "please add all the fields",
        });
    }

    if (!oldUser) {
        return res.json({
            status: "Failed",
            error: "Please Enter Valid User Id",
        });
    }

    const replacedUser = await User.findByIdAndUpdate(id, { name, email });
    return res.json({
        user: replacedUser
    })
}

const updateUser = async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    //you can only update name because email should be unique
    const { name } = req.body;
    if (!name) {
        return res.json({
            status: "Failed",
            error: "please add name",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name });
    if (!updatedUser) {
        return res.json({
            status: "Failed",
            error: "Please Enter Valid User Id",
        });
    }

    return res.json({
        user: updatedUser
    })
}

const getUsers = async (req: express.Request, res: express.Response) => {
    const users = await User.find();
    if (!users)
        return res.json({
            users: []
        });
    else
        return res.json({
            users
        })
}

const getUser = async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
        return res.json({
            status: "Failed",
            error: "Please Enter Valid User Id",
        });
    }
    else {
        return res.json({
            user
        })
    }
}

const deleteUser = async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const deletedUser = await User.findByIdAndRemove(id);
    if (!deletedUser)
        return res.json({
            status: "Failed",
            error: "Please Enter Valid User Id",
        });
    else
        return res.json({
            status: 'Success',
            message: 'User Deleted Successfully'
        })
}

export { createUser, replaceUser, updateUser, getUsers, getUser, deleteUser };