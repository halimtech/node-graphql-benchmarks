#!/usr/bin/env node

const { fork } = require("child_process");
const ora = require("ora");
const path = require("path");
const { fire } = require("./autocannon");

const doBench = async (opts, handler) => {
  const spinner = ora(`Started ${handler}`).start();
  const forked = fork(path.join(__dirname, "..", "benchmarks", handler));
  // Checking if the handler is a rest
  const isRest = handler.endsWith("REST");
  const randomId = () => {
    const out = Math.floor(Math.random() * 10) + 43;
    console.log(out);
    return out;
  };
  const optsGQL = {
    url: "http://localhost:4001/graphql",
    method: "POST",
    body: JSON.stringify({
      query: `{\n  users {\n    id\n    username\n    email\n    products {\n  id \n      name\n    description\n  region \n   }\n location{\n latitude\n longitude\n city\n}  }}`,
    }),
    headers: {
      "content-type": "application/json",
    },
  };
  const optsREST = [
    {
      ...opts,
      url: "http://localhost:4001/users",
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    },
    // {
    //   ...opts,
    //   url: "http://localhost:4001/products",
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // },
  ];
  const query = isRest ? optsREST : optsGQL;
  try {
    spinner.color = "magenta";
    spinner.text = `Warming ${handler}`;

    await fire({ ...opts, body: query, rest: isRest }, handler, false);
  } catch (error) {
    return console.log(error);
  } finally {
    spinner.color = "yellow";
    spinner.text = `Working ${handler}`;
  }

  try {
    await fire({ ...opts, body: query, rest: isRest }, handler, true);
    forked.kill("SIGINT");
    spinner.text = `Results saved for ${handler}`;
    spinner.succeed();
    return true;
  } catch (error) {
    return console.log(error);
  }
};

let index = 0;
const start = async (opts, list) => {
  if (list.length === index) {
    return true;
  }

  try {
    await doBench(opts, list[index]);
    index += 1;
    return start(opts, list);
  } catch (error) {
    return console.log(error);
  }
};

module.exports = start;
