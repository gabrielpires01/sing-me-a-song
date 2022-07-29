import { Router } from "express";
import resetDatabase from "../controllers/testsController.js";

const testRouter = Router();

testRouter.post("/reset", resetDatabase);

export default testRouter;