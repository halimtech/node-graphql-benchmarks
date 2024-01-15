const fastify = require("fastify")({});
const mongoose = require("mongoose");
const md5 = require("md5");

// Import necessary modules and functions
const pg = require("pg");
const { Client } = pg;

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

fastify.get("/users", async (request, reply) => {
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
      products: products.filter((product) => product.userId === user.id),
    };
  });

  // Wait for all user queries to complete
  const usersWithProducts = await Promise.all(users);
  reply.send(usersWithProducts);
});

fastify.get("/user/:id", async (request, reply) => {
  const userId = request.params.id;
  const queryResult = await pgClient.query(
    "SELECT * FROM users WHERE id = $1",
    [userId],
  );
  if (queryResult.rows.length === 0) {
    reply.code(404).send({ error: "User not found" });
  }
  const user = queryResult.rows[0];
  reply.send({
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

fastify.get("/products", async (request, reply) => {
  const productsEU = await ProductEU.find().exec();
  const productsUS = await ProductUS.find().exec();
  const products = [...productsEU, ...productsUS];
  reply.send(products);
});

fastify.post("/createUser", async (request, reply) => {
  // Emulate the "createUser" mutation
  const { username, email, latitude, longitude, city } = request.body;
  const queryResult = await pgClient.query(
    "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, email, latitude, longitude, city],
  );
  const newUser = queryResult.rows[0];
  reply.send(newUser);
});

fastify.post("/createProduct", async (request, reply) => {
  // Emulate the "createProduct" mutation
  const { name, description, region } = request.body;
  let Product;
  region === "EUROPE" ? (Product = ProductEU) : (Product = ProductUS);
  const product = new Product({
    name,
    description,
    userId: md5("your-secret-salt" + name),
    // Include other product fields as needed
  });
  await product.save();
  reply.send(product);
});

fastify.listen(4001, (err, address) => {
  if (err) {
    process.exit(1);
  }
});
