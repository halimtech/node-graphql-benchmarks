const faker = require("faker");

const randomRegionBetweenEUropeAndAmerica = () => {
  if (Math.random() < 0.5) {
    return "EUROPE";
  }
  return "AMERICA";
};

const createFakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  region: randomRegionBetweenEUropeAndAmerica(),
  latitude: parseFloat(faker.address.latitude()),
  longitude: parseFloat(faker.address.longitude()),
  city: faker.address.city(),
});

const createFakeProduct = (userId, region) => ({
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  userId,
  location: {
    latitude: parseFloat(faker.address.latitude()),
    longitude: parseFloat(faker.address.longitude()),
    city: faker.address.city(),
  },
  region,
});

const createFakeData = () => {
  const users = [];
  const products = [];

  // Create 10 fake users
  for (let i = 0; i < 10; i++) {
    const user = createFakeUser();
    users.push(user);

    // Create 3 fake products in EUROPE
    for (let j = 0; j < 3; j++) {
      const product = createFakeProduct(
        md5("your-secret-salt" + user.username),
        "EUROPE",
      );
      products.push(product);
    }

    // Create 3 fake products in AMERICA
    for (let k = 0; k < 3; k++) {
      const product = createFakeProduct(
        md5("your-secret-salt" + user.username),
        "AMERICA",
      );
      products.push(product);
    }
  }

  return { users, products };
};

const insertFakeData = async () => {
  const { users, products } = createFakeData();

  // Insert fake users into PostgreSQL
  for (const user of users) {
    await pgClient.query(
      "INSERT INTO users (username, email, latitude, longitude, city) VALUES ($1, $2, $3, $4, $5)",
      [user.username, user.email, user.latitude, user.longitude, user.city],
    );
  }

  // Insert fake products into MongoDB
  for (const product of products) {
    const ProductModel = product.region === "EUROPE" ? ProductEU : ProductUS;
    const newProduct = new ProductModel(product);
    await newProduct.save();
  }
};

// Call the function to insert fake data
insertFakeData();

// SQL query to §create the users table
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   latitude FLOAT,
//   longitude FLOAT,
//   city VARCHAR(255),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
