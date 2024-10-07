import { Router } from 'express';
import { handleLogout } from '../controllers/authController.js';

const router = Router();

router.get('/', handleLogout);

export default router