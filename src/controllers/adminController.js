import Post from "./../models/PostModel";
import Category from "./../models/CategoryModel";
import Comment from "./../models/CommentModal";
import { mongooseToObject, mutipleMongooseToObject } from "../helpers/mongoose";
import {
  CREATE_POST_SUCCESS,
  ADD_COMMENT_SUCCESS,
} from "../constants/messages";

/**
 * Get admin page
 */
const getAdminPage = (req, res) => {
  res.render("admin-pages/index");
};

/**
 * Categories page
 */
const getCategoriesPage = (req, res) => {
  Category.find().then((categories) =>
    res.render("admin-pages/categories/index", {
      categories: mutipleMongooseToObject(categories),
    })
  );
};

/**
 * Create Categories
 */
const createCategory = (req, res) => {
  let categoryName = req.body.title;
  if (categoryName) {
    const newCategory = new Category({
      title: categoryName,
    });

    newCategory.save().then((category) => {
      res.status(200).json(category);
    });
  }
};

/**
 * Get Edit Categories Page
 */
const getEditCategoryPage = async (req, res) => {
  const catId = req.params.id;
  const categories = await Category.find();
  Category.findById(catId).then((category) => {
    res.render("admin-pages/categories/edit", {
      category: mongooseToObject(category),
      categories: mutipleMongooseToObject(categories),
    });
  });
};

/**
 * Edit Category
 */
const editCategory = (req, res) => {
  const catId = req.params.id;
  const newTitle = req.body.title;
  if (newTitle) {
    Category.findById(catId).then((category) => {
      category.title = newTitle;
      category.save().then(() => {
        res.status(200).json({ url: "/admin/categories" });
      });
    });
  }
};

/**
 * Get posts page
 */
const getPostsPage = (req, res) => {
  Post.find()
    .populate("category")
    .then((posts) => {
      res.render("admin-pages/posts/index", {
        posts: mutipleMongooseToObject(posts),
      });
    });
};

/**
 * Create new Post
 */
const getCreatePostPage = (req, res) => {
  Category.find().then((cats) => {
    res.render("admin-pages/posts/create", {
      categories: mutipleMongooseToObject(cats),
    });
  });
};

const createPost = (req, res) => {
  let filename = "";

  if (req.files) {
    let file = req.files.postThumbnail;
    filename = file.name;
    let filePath = `./src/public/uploads/${filename}`;

    file.mv(filePath, (err) => {
      if (err) throw err;
    });
  }

  const newPost = Object.assign(req.body, {
    allowComments: !!req.body.allowComments,
    postThumbnail: `/uploads/${filename}`,
    user: req.user._id,
  });

  Post(newPost)
    .save()
    .then((post) => {
      req.flash("success-message", CREATE_POST_SUCCESS);
      res.redirect("/admin/posts");
    });
};

/**
 * Edit Post
 */
const getEditPostPage = (req, res) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    Category.find().then((categories) => {
      res.render("admin-pages/posts/edit", {
        post: mongooseToObject(post),
        categories: mutipleMongooseToObject(categories),
      });
    });
  });
};

const editPost = (req, res) => {
  const commentsAllowed = !!req.body.allowComments;
  const id = req.params.id;
  Post.findById(id).then((post) => {
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = commentsAllowed;
    post.content = req.body.description;
    post.category = req.body.category;

    post.save().then((updatePost) => {
      req.flash(
        "success-message",
        `The Post ${updatePost.title} has been updated.`
      );
      res.redirect("/admin/posts");
    });
  });
};

/**
 * Delete Post
 */
const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id).then((deletedPost) => {
    req.flash(
      "success-message",
      `The post ${deletedPost.title} has been deleted.`
    );
    res.redirect("/admin/posts");
  });
};

/**
 * Get comments
 */
const getComments = async (req, res) => {
  const comments = await Comment.find();
  res.render("admin-pages/comments/index", {
    comments: mutipleMongooseToObject(comments),
  });
};

export {
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
};
