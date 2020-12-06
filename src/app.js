import express from "express";
import path from "path";
import connectDB from "./config/db";
import exphbs from "express-handlebars";
import guestRoutes from "./routes/guestRoutes";
import adminRoutes from "./routes/adminRoutes";
import { SECRET, globalVariables } from "./config";
import flash from "connect-flash";
import session from "express-session";
import methodOverride from "method-override";
import {
  checkboxHelper,
  selectHelper,
  toDateString,
  disabledHelper,
} from "./helpers/customFunctions";
import fileUpload from "express-fileupload";
import passport from "passport";

const __dirname = path.resolve();

// Connect to Database
connectDB();

// Init app
const app = express();

// View engine setup
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "guest",
    layoutsDir: path.join(__dirname, "src", "views", "layouts"),
    partialsDir: path.join(__dirname, "src", "views", "partials"),
    helpers: { selectHelper, checkboxHelper, disabledHelper, toDateString },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

// Set public folder
app.use(express.static(path.join(__dirname, "src", "public")));

// Body Parser middleware - parse application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*  Flash and Session*/
app.use(
  session({
    secret: SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);

/* File Upload Middleware*/
app.use(fileUpload());

/* Method Override Middleware*/
app.use(methodOverride("newMethod"));

/* Routes */
app.use("/", guestRoutes);
app.use("/admin", adminRoutes);

export default app;
