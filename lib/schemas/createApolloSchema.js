const { makeExecutableSchema } = require("@graphql-tools/schema");
const { gql } = require("apollo-server-express");
const pg = require("pg");
const { Client } = pg;
const mongoose = require("mongoose");
const md5 = require("md5");
require("dotenv").config();

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

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    products: [Product!]!
    region: Region!
    location: Location
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    user: User!
    region: Region!
    location: Location
  }

  type Location {
    latitude: Float!
    longitude: Float!
    city: String!
  }

  enum Region {
    EUROPE
    AMERICA
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products(region: Region!): [Product!]!
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      latitude: Float
      longitude: Float
      city: String
    ): User
    createProduct(name: String!, description: String!, region: Region!): Product
  }
`;

const resolvers = {
  User: {
    products: async (parent) => {
      const productsEU = await ProductEU.find({ userId: parent.id }).exec();
      const productsUS = await ProductUS.find({ userId: parent.id }).exec();
      return [...productsEU, ...productsUS];
    },
  },
  Product: {
    user: async (parent) => {
      // Fetch the user who created the product from PostgreSQL
      const queryResult = await pgClient.query(
        "SELECT * FROM users WHERE id = $1",
        [parent.userId],
      );
      return queryResult.rows[0];
    },
  },
  Query: {
    user: async (parent, args) => {
      const queryResult = await pgClient.query(
        "SELECT * FROM users WHERE id = $1",
        [args.id],
      );
      return queryResult.rows[0];
    },
    users: async () => {
      const queryResult = await pgClient.query("SELECT * FROM users");
      return queryResult.rows.map((user) => {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          location: {
            latitude: user.latitude,
            longitude: user.longitude,
            city: user.city,
          },
        };
      });
    },
    products: async () => {
      const products = await ProductEU.find().exec();
      return products;
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const queryResult = await pgClient.query(
        "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [args.username, args.email, args.latitude, args.longitude, args.city],
      );
      return queryResult.rows[0];
    },
    createProduct: async (parent, args) => {
      let Product;
      args.region == "EUROPE" ? (Product = ProductEU) : (Product = ProductUS);
      const product = new Product({
        name: args.name,
        description: args.description,
        userId: md5("your-secret-salt" + args.name),
      });
      await product.save();
      return product;
    },
  },
};

// // const { Factory } = require("rosie");
// const faker = require("faker");

// const createFakeUser = () => ({
//   username: faker.internet.userName(),
//   email: faker.internet.email(),
//   latitude: parseFloat(faker.address.latitude()),
//   longitude: parseFloat(faker.address.longitude()),
//   city: faker.address.city(),
// });

// const createFakeProduct = (userId, region) => ({
//   name: faker.commerce.productName(),
//   description: faker.lorem.sentence(),
//   userId,
//   location: {
//     latitude: parseFloat(faker.address.latitude()),
//     longitude: parseFloat(faker.address.longitude()),
//     city: faker.address.city(),
//   },
//   region,
// });

// const createFakeData = () => {
//   const users = [];
//   const products = [];

//   // Create 20 fake users
//   for (let i = 0; i < 10; i++) {
//     const user = createFakeUser();
//     users.push(user);

//     // Create 3 fake products in EUROPE
//     for (let j = 0; j < 3; j++) {
//       const product = createFakeProduct(
//         md5("your-secret-salt" + user.username),
//         "EUROPE",
//       );
//       products.push(product);
//     }

//     // Create 3 fake products in AMERICA
//     for (let k = 0; k < 3; k++) {
//       const product = createFakeProduct(
//         md5("your-secret-salt" + user.username),
//         "AMERICA",
//       );
//       products.push(product);
//     }
//   }

//   return { users, products };
// };

// const insertFakeData = async () => {
//   const { users, products } = createFakeData();
//   console.log("users :", users, "\n products :", products);

//   // Insert fake users into PostgreSQL
//   for (const user of users) {
//     await pgClient.query(
//       "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5)",
//       [user.username, user.email, user.latitude, user.longitude, user.city],
//     );
//   }

//   // Insert fake products into MongoDB
//   for (const product of products) {
//     const ProductModel = product.region === "EUROPE" ? ProductEU : ProductUS;
//     const newProduct = new ProductModel(product);
//     await newProduct.save();
//   }
//   console.log("====================================");
//   console.log("Fake data inserted into PostgreSQL and MongoDB");
//   console.log("====================================");
// };

// // Call the function to insert fake data
// insertFakeData();
module.exports.createApolloSchema = () =>
  makeExecutableSchema({
    typeDefs,
    resolvers,
  });
