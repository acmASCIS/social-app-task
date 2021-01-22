import joi from '@hapi/joi';
import { Request, Response } from 'express';

import { hashSHA512 } from '../wcrypto';
import { User } from '../model/User';

const preValidationUpdate = (data: object) => {
  const schema = joi.object({
    name: joi.string().min(6).max(255),
    email: joi.string().email(),
    password: joi.string().min(8).max(1024),
  });

  return schema.validate(data);
};

const preValidation = (data: object) => {
  const schema = joi.object({
    name: joi.string().min(6).max(255).required(),
    email: joi.string().required().email(),
    password: joi.string().required().min(8).max(1024),
  });

  return schema.validate(data);
};

const postValidation = (data: object) => {
  const schema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(8).max(1024),
  });

  return schema.validate(data);
};

const newUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { error } = preValidation(req.body);

    if (error) {
      res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (!name && !email && !password) {
      return res.status(422).json({
        status: 'Failed',
        error: 'please add all the fields',
      });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ error: 'email is already exists' });
    }

    const id = (await User.find({})).length + 1;
    const newUser = await new User({ id, name, email, password }).save();

    return res.status(200).json({
      user: { id: id, name: name, email: email },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const usersList = await User.find();
  const users = {};

  for (let i = 0; i < usersList.length; i++) {
    users[usersList[i].id] = usersList[i];
  }

  return res.status(200).json({
    users: users,
  });
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await User.findOne({ id: id });

  if (!user) {
    return res.status(422).json({ error: "user, doesn't exist" });
  }

  return res.status(200).json({
    user: user,
  });
};

// put
const updateAllById = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { error } = preValidation({ name, email, password });

    if (error) {
      res.status(400).json({
        error: error.details[0].message,
      });
    }

    const id = req.params.userId;
    const user = await User.find({ id: id });

    if (!user) {
      return res.status(422).json({ error: "user, doesn't exist" });
    }

    User.updateOne(
      { id: id },
      { id: id, name: name, email: email, password: hashSHA512(password) }
    )
      .then((modified) => {
        return res.status(200).json({
          modified: modified,
          user: { id: id, name: name, email: email, password: password },
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 'error',
          error: err.message,
        });
      });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

// patch
const updateById = async (req: Request, res: Response) => {
  try {
    const inputs = {};

    for (let key in req.body) {
      inputs[key] = req.body[key];
    }

    const { error } = preValidationUpdate(inputs);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const id = req.params.userId;
    const user = await User.findOne({ id: id });

    if (!user) {
      return res.status(422).json({ error: "user, doesn't exist" });
    }

    for (let key in inputs) {
      if (key == 'password') {
        user[key] = hashSHA512(inputs[key]);
      } else {
        user[key] = inputs[key];
      }
    }

    User.updateOne({ id: id }, user)
      .then((modified) => {
        return res.status(200).json({
          modified: modified,
          user: user,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 'error',
          error: err.message,
        });
      });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

// delete
const deleteById = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await User.findOne({ id: id });

  if (!user) {
    return res.status(422).json({ error: "user, doesn't exist" });
  }

  User.deleteOne({ id: id })
    .then((deleted) => {
      return res.status(200).json({
        deleted: deleted,
        user: user,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: 'error',
        error: err.message,
      });
    });
};

export {
  newUser,
  getAllUsers,
  getUserById,
  updateAllById,
  updateById,
  deleteById,
};
