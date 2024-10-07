import express from "express";
// import { getUsers, handlerNewUser, updateUser } from "../controllers/usersController.js";
import { deletePegawai, getPegawai, handlerNewPegawai, updatePegawai } from "../controllers/pegawaiController.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();
// const data = {};
// data.employees = employees;

router.route('/')
    .get(verifyRoles("admin", "user"), getPegawai)
    .post(verifyRoles("admin"), handlerNewPegawai)

router.route('/:id')
    .put(verifyRoles("admin"), updatePegawai)
    .delete(verifyRoles("admin"), deletePegawai)
// .get(getEmployee);


export default router 