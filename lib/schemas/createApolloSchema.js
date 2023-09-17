const { makeExecutableSchema } = require("@graphql-tools/schema");
const { gql } = require("apollo-server-express");
const axios = require("axios");
const pg = require("pg");
const { Client } = pg;
const mongoose = require("mongoose");
const md5 = require("md5");

const pgClient = new Client({
  user: "your-username",
  password: "your-password",
  database: "your-database-name",
  host: "localhost",
  port: 5432,
});
pgClient.connect();

mongoose.connect("mongodb://your-username:your-password@localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model("Product", {
  name: String,
  description: String,
  userId: String,
});

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    products: [Product!]!
    location: Location
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    user: User!
  }

  type Location {
    latitude: Float!
    longitude: Float!
    city: String!
  }

  type Weather {
    temperature: String!
    description: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    weather(longitude: Float!, latitude: Float!): Weather
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      latitude: Float
      longitude: Float
      city: String
    ): User
    createProduct(name: String!, description: String!): Product
  }
`;

const resolvers = {
  User: {
    products: async (parent) => {
      const products = await Product.find({ userId: parent.id }).exec();
      return products;
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
      return queryResult.rows;
    },
    products: async () => {
      const products = await Product.find().exec();
      return products;
    },
    weather: async (parent, args) => {
      const { data } = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=your-api-key&q=${args.latitude},${args.longitude}`,
      );
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
      };
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
