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

module.exports.createApolloSchema = () =>
  makeExecutableSchema({
    typeDefs,
    resolvers,
  });
