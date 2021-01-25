import express, { Router } from 'express';
import  userCheck from '../middleware/userCheck';
import User, { IUser } from '../models/user';

const router : express.Router = express.Router();

router.post('/users', async(req: express.Request, res: express.Response) => {
    const user: IUser = new User(req.body);
    try{
       await user.save();
       res.status(201).send(user);
    }catch(e){
        res.status(400).send({message: e.message});
    }
});

router.put('/users/:userId',userCheck, async(req: express.Request, res: express.Response) => {
  try{ 
    const updates = ['name','email'];
    updates.forEach(value => req.user[value] = (req.body[value] || req.user[value]));
    await req.user.save();
    res.send(req.user);
  }
  catch(e){
      res.status(400).send({message: e.message});
  }

});

router.patch('/users/:userId',userCheck, async (req: express.Request, res: express.Response) => {
    try{        
        const updates = Object.keys(req.body);
        const validUpdates = ['name','email'];
        const isValidUpdate = updates.every(value => validUpdates.includes(value));

        if(!isValidUpdate){
            return res.status(400).send({error:'Please provide valid updates'});
        }

        updates.forEach(value => req.user[value] = req.body[value]);

        await req.user.save();        

        res.send(req.user);

    } catch(e){
        res.status(400).send({message: e.message});
    }
});

router.get('/users',async (req: express.Request, res: express.Response) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e){
        res.status(500).send({message: e.message});
    }
});

router.get('/users/:userId', userCheck, async (req: express.Request, res: express.Response) =>{
    try{
        res.send(req.user);
    } catch(e){
        res.status(500).send({message: e.message});
    }
});

router.delete('/users/:userId', userCheck, async (req: express.Request, res: express.Response) => {
    try{
        await req.user.remove();
        res.send(req.user);
    } catch(e){
        res.status(500).send({message: e.message});
    }
})

export default router;