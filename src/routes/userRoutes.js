import { Router } from 'express';
import { registerUser, authUser, getUserProfile ,getUsers, getUserById, deleteUser, updateUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

const router = Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/',protect,admin,getUsers);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id',protect,admin,deleteUser);
router.put('/profile', protect, updateUserProfile);

export default router;