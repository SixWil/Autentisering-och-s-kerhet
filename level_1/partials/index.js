// Importerar Express och bodyParser
import express from "express";
import bodyParser from "body-parser";

// Startar en server
const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// GET-routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// POST-routes
app.post("/register", async (req, res) => {});

app.post("/login", async (req, res) => {});


// Lyssnar efter inkommande förfrågningar
app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});
