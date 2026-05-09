import User from '../mongodb/models/user.js';
import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/error.js';
import { getQueryNumber } from '../utils/query.js';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = getQueryNumber(req.query._end);
    let usersQuery = User.find({});
    if (limit !== undefined) usersQuery = usersQuery.limit(limit);
    const users = await usersQuery;

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) })
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if(userExists) return res.status(200).json(userExists);
  
    const newUser = await User.create({
      name,
      email,
      avatar
    })
  
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) })
  }
};

const getUserInfoByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ _id: id}).populate('allProperties');
    
    if(user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) })
  }
}; 

export {
  getAllUsers,
  createUser,
  getUserInfoByID,
}
