import express from "express";
import {
  getAccessToRoute,
  getAdminAccess,
} from "../middlewares/Authorization/auth.js";
import { checkUserExist } from "../middlewares/database/databaseErrors.js";
import { blockUser, deleteUser } from "../controllers/admin.js";

const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id", checkUserExist, blockUser);
router.delete("/user/:id", checkUserExist, deleteUser);

export default router;
