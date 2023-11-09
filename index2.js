import express from "express";
import path, { dirname } from "path";

const app = express();
const PORT = 2000;

//using middleware
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(path.join(path.resolve() + "/index.html"));
  res.sendFile(path.join(path.resolve() + "/index.html"));
  //   res.send("Home page");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send("DOne");
});

app.listen(PORT, (req) => {
  console.log("Connected");
});
