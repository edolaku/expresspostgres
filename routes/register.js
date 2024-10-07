import { Router } from 'express';
import { handlerNewUser } from '../controllers/registerController.js';

const router = Router();

router.post('/', handlerNewUser);

export default router