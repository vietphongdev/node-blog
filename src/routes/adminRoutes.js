import express from "express";
import {
  getAdminPage,
  getPostsPage,
  getCreatePostPage,
  createPost,
  getEditPostPage,
  editPost,
  deletePost,
  getCategoriesPage,
  createCategory,
  getEditCategoryPage,
  editCategory,
  getComments,
} from "../controllers/adminController";
import { checkAuthenticated } from "../middlewares/authentication";

const router = express.Router();

router.all("/*", checkAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.route("/").get(getAdminPage);

/* CATEGORY ROUTE */
router.route("/categories").get(getCategoriesPage);

router.route("/categories/create").post(createCategory);

router.route("/category/edit/:id").get(getEditCategoryPage).post(editCategory);

/* POST ROUTE */
router.route("/posts").get(getPostsPage);

router.route("/posts/create").get(getCreatePostPage).post(createPost);

router.route("/posts/edit/:id").get(getEditPostPage).put(editPost);

router.route("/posts/delete/:id").delete(deletePost);

/* COMMENT ROUTE */
router.route("/comment").get(getComments);

export default router;
