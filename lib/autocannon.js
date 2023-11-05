const autocannon = require("autocannon");
const fs = require("fs");
const compare = require("autocannon-compare");
const path = require("path");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const resultsDirectory = path.join(process.cwd(), "results");

const run = (opts = {}) =>
  new Promise((resolve, reject) => {
    const restCannons = [];

    if (!opts.rest) {
      // Single autocannon request
      autocannon(
        {
          ...opts,
          url: opts.body.url,
          method: opts.body.method,
          body: opts.body.body,
          headers: opts.body.headers,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result); // Resolve with a single-item array
          }
        },
      );
    } else {
      // Multiple autocannon requests
      opts.body.forEach((element) => {
        restCannons.push(
          new Promise((resolve, reject) => {
            autocannon(
              {
                ...opts,
                url: element.url,
                method: element.method,
                body: element.body,
                headers: element.headers,
              },
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              },
            );
          }),
        );
      });

      // Use Promise.all to resolve with an array of results
      Promise.all(restCannons)
        .then((results) => {
          resolve(results[0]);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });

const writeResult = async (handler, result) => {
  try {
    await access(resultsDirectory);
  } catch (e) {
    await mkdir(resultsDirectory);
  }

  result.server = handler;

  const dest = path.join(resultsDirectory, `${handler}.json`);
  return writeFile(dest, JSON.stringify(result));
};

module.exports.fire = async (opts, handler, save) => {
  const result = await run(opts);
  return save ? writeResult(handler, result) : null;
};

module.exports.compare = (a, b) => {
  const resA = require(`${resultsDirectory}/${a}.json`);
  const resB = require(`${resultsDirectory}/${b}.json`);
  const comp = compare(resA, resB);
  if (comp.equal) {
    return true;
  }
  if (comp.aWins) {
    return {
      diff: comp.requests.difference,
      fastest: a,
      slowest: b,
      fastestAverage: resA.requests.average,
      slowestAverage: resB.requests.average,
    };
  }
  return {
    diff: compare(resB, resA).requests.difference,
    fastest: b,
    slowest: a,
    fastestAverage: resB.requests.average,
    slowestAverage: resA.requests.average,
  };
};
