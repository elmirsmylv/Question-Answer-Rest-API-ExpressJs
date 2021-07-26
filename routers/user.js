import express from "express";
import { getSingleUser, getAllUsers } from "../controllers/user.js";
import { checkUserExist } from "../middlewares/database/databaseErrors.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);

export default router;
