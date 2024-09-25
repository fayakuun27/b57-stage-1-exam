const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const { queryObjects } = require("v8");

const sequelize = new Sequelize(config.development);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "my-session",
    secret: "ewVsqWOyeb",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/register", registerView);
app.post("/register", register);
app.get("/login", loginView);
app.post("/login", login);
app.get("/logout", logout);
app.get("/add-collection", addCollectionView);
app.post("/add-collection", addCollection);
app.get("/collection-detail/:id", collectionDetail);
app.post("/add-task/:id", addTask);
app.get("/delete-collection/:id", deleteCollection);

async function deleteCollection(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  const { id } = req.params;

  const query = `DELETE FROM public.collections_tb WHERE id = ${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/");
}

async function addTask(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }
  const { id } = req.params;

  const { taskName } = req.body;
  console.log(req.body);
  const queryInsert = `INSERT INTO public.task_tb("taskName", is_done, collections_id) VALUES ( '${taskName}', false, '${id}')`;

  await sequelize.query(queryInsert, { type: QueryTypes.INSERT });

  res.redirect(`/collection-detail/${id}`);
}

async function collectionDetail(req, res) {
  const user = req.session.user;

  const { id } = req.params;
  const query = `SELECT public.task_tb.*,public.collections_tb.*,public.users_tb.username  FROM public.collections_tb  
	LEFT JOIN public.users_tb on public.collections_tb.user_id = public.users_tb.id
	LEFT JOIN public.task_tb on public.task_tb.collections_id = public.collections_tb.id
		WHERE public.collections_tb.id = ${id}`;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  const collectionName = result[0].collectionName;
  const collectionId = id;

  let owner = false;
  if (user && result) {
    if (user.id == result[0].user_id) {
      owner = true;
    }
  }

  for (let i = 0; i < result.length; i++) {
    if (owner) {
      result[i].owner = true;
    }
  }

  res.render("collection-detail", {
    data: result,
    user,
    collectionName,
    owner,
    collectionId,
  });
}

async function home(req, res) {
  const user = req.session.user;

  const query = `SELECT public.collections_tb.*, public.users_tb.username FROM public.collections_tb JOIN public.users_tb ON public.collections_tb.user_id = public.users_tb.id`;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("index", { data: result, user });
}

function registerView(req, res) {
  const user = req.session.user;

  if (user) return res.redirect("/");
  res.render("register");
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO public.users_tb(email,password,username) VALUES ('${email}','${hashedPassword}','${username}')`;

    await sequelize.query(query, { type: QueryTypes.INSERT });

    req.flash("success", "Register berhasil! Silahkan login");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "Register gagal! Email sudah digunakan");
    res.redirect("/register");
  }
}

function loginView(req, res) {
  const user = req.session.user;
  if (user) return res.redirect("/");
  res.render("login");
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM public.users_tb WHERE public.users_tb.email = '${email}' LIMIT 1`;

    // cek email user apakah ada di database
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (!result) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    // cek password apakah valid dengan password yang sudah di hash
    const isValidPassword = await bcrypt.compare(password, result[0].password);

    if (!isValidPassword) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    req.session.user = result[0];
    req.flash("success", "Login berhasil!");

    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/login");
  }
}

function logout(req, res) {
  req.session.user = null;
  res.redirect("/");
}

function addCollectionView(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  res.render("add-collection", { user });
}

async function addCollection(req, res) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }
  const { collectionName } = req.body;
  const userId = req.session.user.id;

  const query = `INSERT INTO public.collections_tb("collectionName",user_id) VALUES ('${collectionName}','${userId}')`;

  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("/");
}
app.listen(port, () => {
  console.log("Server is running on PORT :", port);
});
