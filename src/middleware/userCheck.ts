import User, { IUser } from '../models/user';
import express from 'express';

const userCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const userID = req.params.userId;
        const user: IUser = await User.findById(userID);
        if(!user){
            return res.status(400).send({error:'Please provide a correct userID'});
        }
        req.user = user;
        next();
    } catch(e){
        res.status(400).send(e);
    }
}

export default userCheck;