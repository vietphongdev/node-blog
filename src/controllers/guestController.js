import { mongooseToObject, mutipleMongooseToObject } from "../helpers/mongoose";
import Category from "./../models/CategoryModel";
import Post from "./../models/PostModel";
import User from "./../models/UserModel";
import bcrypt from "bcryptjs";
import { validatorRegister } from "../helpers/validator";
import {
  BCRYPT_ERROR,
  EMAIL_ALREADY,
  HASHING_PASSWORD_ERROR,
  REGISTER_SUCCESS,
  LOGOUT_SUCCESS,
  POST_NOT_FOUND,
  ADD_COMMENT_SUCCESS,
} from "../constants/messages";
import passport from "passport";
import passportConfig from "../config/passport";
import Comment from "./../models/CommentModal";

passportConfig(passport);

const getHomePage = async (req, res) => {
  Promise.all([Post.find().populate("user"), Category.find()])
    .then(([posts, categories]) =>
      res.render("guest-pages/home", {
        posts: mutipleMongooseToObject(posts),
        categories: mutipleMongooseToObject(categories),
      })
    )
    .catch((error) => console.log(error));
};

// login
const getLoginPage = (req, res) => {
  res.render("guest-pages/login");
};

const userLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
    session: true,
  })(req, res, next);
};

// register
const getRegisterPage = (req, res) => {
  res.render("guest-pages/register");
};

const userRegister = async (req, res) => {
  const errors = validatorRegister(req.body);
  const { firstName, lastName, email, password } = req.body;

  if (errors.length > 0) {
    res.render("guest-pages/register", {
      errors,
      firstName,
      lastName,
      email,
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash("error-message", EMAIL_ALREADY);
      res.redirect("/login");
    } else {
      const salt = await bcrypt.genSalt(10);
      if (!salt) throw Error(BCRYPT_ERROR);

      const hash = await bcrypt.hash(password, salt);
      if (!hash) throw Error(HASHING_PASSWORD_ERROR);

      const newUser = new User(req.body);

      newUser.password = hash;

      newUser.save().then((user) => {
        req.flash("success-message", REGISTER_SUCCESS);
        res.redirect("/login");
      });
    }
  } catch (error) {
    throw Error(error);
  }
};

// log-out
const logout = (req, res) => {
  req.logOut();
  req.flash("success-message", LOGOUT_SUCCESS);
  res.redirect("/");
};

const getPost = (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("category")
    .populate("user")
    .populate("comments")
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: POST_NOT_FOUND });
      } else {
        res.render("guest-pages/post-detail", {
          post: mongooseToObject(post),
          comments: mutipleMongooseToObject(post.comments),
        });
      }
    });
};

/**
 * add comments
 */
const addComment = async (req, res) => {
  if (req.user) {
    try {
      let post = await Post.findById(req.body.id);
      const newComment = new Comment({
        user: req.user._id,
        body: req.body.comment_body,
      });
      post.comments.push(newComment);
      await post.save();
      await newComment.save();
      req.flash("success-message", ADD_COMMENT_SUCCESS);
      res.redirect(`/posts/${post._id}`);
    } catch (error) {
      console.log("error >>>", error);
      req.flash("error-message", error);
    }
  } else {
    req.flash("error-message", LOGIN_FIRST_TO_COMMENT);
    res.redirect("/login");
  }
};

export {
  getHomePage,
  getLoginPage,
  getPost,
  userLogin,
  getRegisterPage,
  userRegister,
  logout,
  addComment,
};
