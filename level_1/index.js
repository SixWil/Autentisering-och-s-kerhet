// Importerar Express och bodyParser
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt"

// Startar en server
const app = express();
const port = 3000;

const saltRounds = 10;

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "OgreMail",
  port: 5432,
});

db.connect();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET-routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

let EpostError = "";
let LösenordError_a = "";
let LösenordError_b = "";
let Epost = "";
let lösen = "";

app.get("/login", (req, res) => {
  res.render("login.ejs", { EpostError: EpostError, LösenordError_a: LösenordError_a, LösenordError_b: LösenordError_b, Epost: Epost, lösen: lösen });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// POST-routes
app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);

  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  try {

    if (checkResult.rows.length > 0) {
      console.log("Användaren finns redan");
    }
    else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {

        const result = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2)",
          [email, hash]
        );
      });

      // console.log(result);
      res.render("secrets.ejs");
    }

  } catch (error) { console.error(error); }
});

app.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email);
  console.log(password);

  try {

    const search = await db.query(

      "SELECT * FROM users WHERE email = $1",
      [email] /// Ger [] om användaren inte finns

    );

    console.log(search.rows);
    // console.log(search.rows.toString());
    console.log(search.rows.length);

    // if (search.rows != []) {
    //   res.render("secrets.ejs");
    // }

    if (search.rows.length > 0) {

      const användare = search.rows[0];
      const lösenord = användare.password;

      bcrypt.compare(password, lösenord, (err, result) => {

        if (result == true) { res.render("secrets.ejs"); }
        else {
          EpostError = "";
          LösenordError_a = "Fel";
          LösenordError_b = "för den e-postadressen";

          Epost = email;
          lösen = password;
          res.redirect("/login");
        }
      })
    }
    else {
      EpostError = "hittas inte";
      LösenordError_a = "";
      LösenordError_b = "";

      Epost = email;
      lösen = password;
      res.redirect("/login");
    }

  } catch (error) { console.error(error); }

});

// Lyssnar efter inkommande förfrågningar
app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});
