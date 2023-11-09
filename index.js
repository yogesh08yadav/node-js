console.log("sdfsdf");
import http from "http";
import * as obj from "./features.js";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "node_backend",
  })
  .then(() => console.log("Database Connected"));

const schema = new mongoose.Schema({
  name: String,
  email: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const contact = mongoose.model("contacts", schema);
const Users = mongoose.model("users", userSchema);

console.log("http", obj.getLovePercent());

const app = express();

// using middleware
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Setting up view engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  // console.log("req.cookies", req.cookies);
  const { token } = req.cookies;

  if (token) {
    const decode = jwt.verify(token, "sdfsdf");
    // console.log("decode", decode);
    req.user = await Users.findById(decode._id);
    next();
  } else {
    res.redirect("/login");
    // res.render("index", { name: "Yogesh Kumar" });
  }
};
app.get("/", isAuthenticated, (req, res) => {
  // console.log("req.user", req.user);
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });
  if (!user) return res.redirect("/register");

  let passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    res.render("login", { message: "Incorrect password", email: email });
  else {
    let token = jwt.sign({ _id: user._id }, "sdfsdf");
    // console.log("token", token);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const findUser = await Users.findOne({ email: email });
  console.log("findUser", findUser);
  if (findUser) {
    console.log("User already exists");
    return res.redirect("/");
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  let user = await Users.create({ name, email, password: hashedPassword });
  // let token = jwt.sign({ _id: user._id }, "sdfsdf");
  // // console.log("token", token);
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 60 * 1000),
  // });
  res.redirect("/login");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("server is runnning");
});

// app.get("/add", (req, res) => {
//   contact.create({ name: "Sample", email: "sample@yopmail.com" }).then(() => {
//     res.send("Document created");
//   });
// });

// app.get("/getproducts", (req, res) => {
//   res.status(200).send("Products");
// });

// app.post("/contact", async (req, res) => {
//   console.log(req.body);
//   const contactData = { name: req.body.name, email: req.body.email };
//   await contact.create(contactData);
//   // res.render("success");
//   res.redirect("/success");
// });

// app.get("/success", (req, res) => {
//   res.sendFile(path.join(path.resolve() + "/views/success.html"));
// });

// app.get("/users", (req, res) => {
//   res.json({ users });
// });

// const server = http.createServer((req, res) => {
//   console.log(req.url);
//   if (req.url == "/about") {
//     res.end("<h1>About</>");
//   }
//   if (req.url == "/") {
//     res.end("<h1>Home</>");
//   } else {
//     res.end("<h1>Page not found</>");
//   }
// });

// server.listen(5000, () => {
//   console.log("server is running");
// });

////EXPRESS////
