import User from '../mongodb/models/user';
import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/error';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });

    res.status(200).json([req.user]);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) })
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
  
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) })
  }
};

const getUserInfoByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (id !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const user = await User.findOne({ _id: id});
    
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
