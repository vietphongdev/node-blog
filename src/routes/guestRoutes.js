import express from "express";
import {
  getHomePage,
  getLoginPage,
  userLogin,
  getRegisterPage,
  userRegister,
  getPost,
  logout,
  addComment,
} from "../controllers/guestController";
import { checkNotAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "guest";
  next();
});

router.route("/login").get(checkNotAuthenticated, getLoginPage).post(userLogin);

router.route("/register").get(getRegisterPage).post(userRegister);

router.get("/logout", logout);

router.route("/").get(getHomePage);

router.route("/posts/:id").get(getPost).post(addComment);

export default router;
