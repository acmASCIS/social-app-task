import express, { NextFunction } from "express";
import { body, validationResult } from "express-validator";

import User from "../models/user";

//validations
function validateEmail(req: express.Request, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Email is not valid, Please enter a valid one.");
        error.status = 422;
        next(error);
    }
}

function validateIncompleteData(req: express.Request, next: NextFunction) {
    if (!req.body.name && req.body.email) {
        const error = new Error("Incomplete data, Please check again.");
        error.status = 422;
        next(error)
    }
}

//endpoints
function postUser(req: express.Request, res: express.Response, next: NextFunction) {
    validateIncompleteData(req, next);
    validateEmail(req, next);

    const user = new User(req.body);
    user.save().then(user => {
        res.statusCode = 201;
        res.send(user);
    }).catch(err => next(err));
}

function replaceUser(req: express.Request, res: express.Response, next: NextFunction) {
    validateIncompleteData(req, next);
    validateEmail(req, next);

    User.replaceOne({ _id: req.params.userId }, req.body)
        .then(stat => {
            res.statusCode = 202;
            res.send({ status: "Accepted" });
        }).catch(err => next(err));

}

function updateUser(req: express.Request, res: express.Response, next: NextFunction) {
    if (req.body.email)
        validateEmail(req, next);

    User.updateOne({ _id: req.params.userId }, req.body)
        .then(stat => {
            res.statusCode = 202;
            res.send({ status: "Accepted" });
        }).catch(err => next(err));
}

function getAllUsers(req: express.Request, res: express.Response, next: NextFunction) {
    User.find().sort({ name: 1 }).
        then(users => {
            if (users)
                res.send(users);
            else {
                const error = new Error("No users found.");
                error.status = 404;
                next(error);
            }
        }).catch(err => next(err));
}

function getUserById(req: express.Request, res: express.Response, next: NextFunction) {
    User.findById(req.params.userId).
        then(user => {
            if (user)
                res.send(user);
            else {
                const error = new Error("User not found.");
                error.status = 404;
                next(error);
            }
        }).catch(err => next(err));
}

function deleteUser(req: express.Request, res: express.Response, next: NextFunction) {
    User.findOneAndDelete({ _id: req.params.userId }).
        then(user => res.send(user)).catch(err => next(err));
}

export default { postUser, replaceUser, updateUser, getAllUsers, getUserById, deleteUser };