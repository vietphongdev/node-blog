import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;

const globalVariables = (req, res, next) => {
  res.locals.success_message = req.flash("success-message");
  res.locals.error_message = req.flash("error-message");
  res.locals.user = req.user || null; // at : "views/partials/guest/top-navigation" using user variable
  next();
};

export { PORT, MONGO_URI, SECRET, globalVariables };
