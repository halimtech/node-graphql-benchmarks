const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Import necessary modules and functions
const md5 = require("md5");
const pg = require("pg");
const { Client } = pg;
const mongoose = require("mongoose");

const pgClient = new Client({
  user: "your-username",
  password: "your-password",
  database: "your-database-name",
  host: "localhost",
  port: 5432,
});
pgClient.connect();

const mongooseEU = mongoose.createConnection(
  "mongodb://your-username:your-password@localhost:27017/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const mongooseUS = mongoose.createConnection(
  "mongodb://your-username:your-password@localhost:27018/",
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
app.get("/users", async (req, res) => {
  const queryResult = await pgClient.query("SELECT * FROM users");
  const users = queryResult.rows.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    location: {
      latitude: user.latitude,
      longitude: user.longitude,
      city: user.city,
    },
  }));
  res.json(users);
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const queryResult = await pgClient.query(
    "SELECT * FROM users WHERE id = $1",
    [userId],
  );
  if (queryResult.rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  const user = queryResult.rows[0];
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    location: {
      latitude: user.latitude,
      longitude: user.longitude,
      city: user.city,
    },
  });
});

app.get("/products", async (req, res) => {
  const productsEU = await ProductEU.find().exec();
  const productsUS = await ProductUS.find().exec();
  const products = [...productsEU, ...productsUS];
  res.json(products);
});

app.post("/createUser", async (req, res) => {
  // Emulate the "createUser" mutation
  const { username, email, latitude, longitude, city } = req.body;
  const queryResult = await pgClient.query(
    "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, email, latitude, longitude, city],
  );
  const newUser = queryResult.rows[0];
  res.json(newUser);
});

app.post("/createProduct", async (req, res) => {
  // Emulate the "createProduct" mutation
  const { name, description, region } = req.body;
  let Product;
  region === "EUROPE" ? (Product = ProductEU) : (Product = ProductUS);
  const product = new Product({
    name,
    description,
    userId: md5("your-secret-salt" + name),
    // Include other product fields as needed
  });
  await product.save();
  res.json(product);
});

// Start the REST server on port 4001
app.listen(4001);
