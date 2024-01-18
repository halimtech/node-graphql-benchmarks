const Koa = require("koa");
const Router = require("@koa/router");
const mongoose = require("mongoose");
const md5 = require("md5");
const pg = require("pg");
const { Client } = pg;

const app = new Koa();
const router = new Router();

// Import necessary modules and functions
const pgClient = new Client({
  user: "your-username",
  password: "your-password",
  database: "your-database-name",
  host: "127.0.0.1",
  port: 5432,
});
pgClient.connect();

const mongooseEU = mongoose.createConnection(
  "mongodb://your-username:your-password@127.0.0.1:27017/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const mongooseUS = mongoose.createConnection(
  "mongodb://your-username:your-password@127.0.0.1:27018/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const ProductEU = mongooseEU.model("Product", {
  name: String,
  description: String,
  userId: String,
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
  },
  region: String,
});

const ProductUS = mongooseUS.model("Product", {
  name: String,
  description: String,
  userId: String,
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
  },
  region: String,
});

// Define your REST endpoints to emulate GraphQL queries and mutations
router.get("/users", async (ctx) => {
  const queryResult = await pgClient.query("SELECT * FROM users");
  const users = queryResult.rows.map(async (user) => {
    const productsEU = await ProductEU.find({ userId: user.id }).exec();
    const productsUS = await ProductUS.find({ userId: user.id }).exec();
    const products = [...productsEU, ...productsUS];

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      location: {
        latitude: user.latitude,
        longitude: user.longitude,
        city: user.city,
      },
      products: products,
    };
  });

  // Wait for all user queries to complete
  const usersWithProducts = await Promise.all(users);

  ctx.body = usersWithProducts;
});

router.get("/user/:id", async (ctx) => {
  const userId = ctx.params.id;
  const queryResult = await pgClient.query(
    "SELECT * FROM users WHERE id = $1",
    [userId],
  );
  if (queryResult.rows.length === 0) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };
  } else {
    const user = queryResult.rows[0];
    ctx.body = {
      id: user.id,
      username: user.username,
      email: user.email,
      location: {
        latitude: user.latitude,
        longitude: user.longitude,
        city: user.city,
      },
    };
  }
});

router.get("/products", async (ctx) => {
  const productsEU = await ProductEU.find().exec();
  const productsUS = await ProductUS.find().exec();
  const products = [...productsEU, ...productsUS];
  ctx.body = products;
});

router.post("/createUser", async (ctx) => {
  // Emulate the "createUser" mutation
  const { username, email, latitude, longitude, city } = ctx.request.body;
  const queryResult = await pgClient.query(
    "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, email, latitude, longitude, city],
  );
  const newUser = queryResult.rows[0];
  ctx.body = newUser;
});

router.post("/createProduct", async (ctx) => {
  // Emulate the "createProduct" mutation
  const { name, description, region } = ctx.request.body;
  let Product;
  region === "EUROPE" ? (Product = ProductEU) : (Product = ProductUS);
  const product = new Product({
    name,
    description,
    userId: md5("your-secret-salt" + name),
    // Include other product fields as needed
  });
  await product.save();
  ctx.body = product;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4001);
