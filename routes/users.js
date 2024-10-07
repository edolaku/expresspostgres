import express from "express";
import { deleteUser, getUsers, handlerNewUser, updateUser } from "../controllers/usersController.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();
// const data = {};
// data.employees = employees;

router.route('/')
    .get(verifyRoles("admin"), getUsers)
    .post(verifyRoles("admin"), handlerNewUser)

router.route('/:cuid')
    .put(verifyRoles("admin"), updateUser)
    .delete(verifyRoles("admin"), deleteUser)
// .get(getEmployee);


export default router 