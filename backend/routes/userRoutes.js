import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';


const router = express.Router();

// Create a new user
router.post('/user', createUser);

// Get all users
router.get('/users', getUsers);

// Get a single user by ID
router.get('/user/:userId', getUserById);

// Update a user
router.put('/user/:userId', updateUser);

// Delete a user
router.delete('/user/:userId', deleteUser);

export default router;
