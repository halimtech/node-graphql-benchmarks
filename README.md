# TL;DR

- graphql-jit helps
- apollo-server adds overhead
- tracing resolvers kills performance
- type-graphql adds overhead

# Explanation

For further details, please check out [this video](https://www.youtube.com/watch?v=JbV7MCeEPb8).

# Usage

```
git clone https://github.com/benawad/benchmarks
cd benchmarks
npm install
npm start
```

# Benchmarks

duration: 5s
connections: 5
pipelining: 1

| Server                                                                                                                                                                  | Requests/s | Latency | Throughput/Mb |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------: | :-----: | ------------: |
| [uWebSockets-graphql+jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/uWebSockets-graphql+jit.js)                                         |    13061.6 |  0.02   |         80.36 |
| [core-graphql-jit-str](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/core-graphql-jit-str.js)                                               |     9383.2 |  0.04   |         58.33 |
| [core-graphql-jit-buf](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/core-graphql-jit-buf.js)                                               |     9272.8 |  0.04   |         57.65 |
| [core-graphql-jit-buf-fjs](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/core-graphql-jit-buf-fjs.js)                                       |     9144.8 |  0.04   |         56.83 |
| [benzene-http](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/benzene-http.js)                                                               |     9050.4 |  0.04   |         56.69 |
| [mercurius+graphql-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/mercurius+graphql-jit.js)                                             |     8790.0 |  0.04   |         55.03 |
| [fastify-REST](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/fastify-REST.js)                                                               |     7885.2 |  0.07   |         63.23 |
| [mercurius+graphql-compose](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/mercurius+graphql-compose.js)                                     |     5355.6 |  0.29   |         33.54 |
| [express-REST](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-REST.js)                                                               |     5333.2 |  0.16   |         43.10 |
| [graphql-api-koa+graphql-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/graphql-api-koa+graphql-jit.js)                                 |     5306.0 |  0.28   |         33.18 |
| [mercurius](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/mercurius.js)                                                                     |     5249.2 |  0.30   |         32.87 |
| [mercurius+graphql-jit+type-graphql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/mercurius+graphql-jit+type-graphql.js)                   |     5040.4 |  0.31   |         31.56 |
| [express-gql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-gql.js)                                                                 |     4674.0 |  0.35   |         29.56 |
| [fastify-express-graphql-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/fastify-express-graphql-jit.js)                                 |     4658.8 |  0.36   |          1.28 |
| [fastify-express-graphql-typed-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/fastify-express-graphql-typed-jit.js)                     |     4375.0 |  0.41   |          1.20 |
| [express-graphql+graphql-jit+graphql-compose](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql+graphql-jit+graphql-compose.js) |     4058.0 |  0.48   |         25.67 |
| [express-graphql+graphql-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql+graphql-jit.js)                                 |     4038.0 |  0.48   |         25.54 |
| [graphql-api-koa](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/graphql-api-koa.js)                                                         |     3790.2 |  0.74   |         23.70 |
| [express-graphql+graphql-jit+type-graphql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql+graphql-jit+type-graphql.js)       |     3727.0 |  0.99   |         23.57 |
| [apollo-server-koa+graphql-jit+type-graphql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-server-koa+graphql-jit+type-graphql.js)   |     3674.6 |  0.67   |         23.00 |
| [fastify-express-grapql-typed](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/fastify-express-grapql-typed.js)                               |     3492.6 |  1.25   |          0.96 |
| [express-graphql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql.js)                                                         |     3198.6 |  1.27   |         20.22 |
| [express-graphql+graphql-compose](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql+graphql-compose.js)                         |     3138.2 |  1.27   |         19.85 |
| [express-graphql+type-graphql](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql+type-graphql.js)                               |     3076.6 |  1.27   |         19.45 |
| [apollo-schema+async](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-schema+async.js)                                                 |     3068.2 |  1.27   |         19.40 |
| [express-graphql-dd-trace-no-plugin](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql-dd-trace-no-plugin.js)                   |     3049.8 |  1.27   |         19.28 |
| [graphql-compose+async](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/graphql-compose+async.js)                                             |     3010.6 |  1.28   |         19.04 |
| [type-graphql+middleware](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/type-graphql+middleware.js)                                         |     2928.6 |  1.27   |         18.52 |
| [type-graphql+async](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/type-graphql+async.js)                                                   |     2777.4 |  1.32   |         17.56 |
| [type-graphql+async-middleware](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/type-graphql+async-middleware.js)                             |     2755.8 |  1.34   |         17.43 |
| [apollo-server-express](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-server-express.js)                                             |     2486.2 |  1.48   |         15.80 |
| [apollo-opentracing](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-opentracing.js)                                                   |     1700.0 |  2.70   |         10.81 |
| [express-graphql-dd-trace-less](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql-dd-trace-less.js)                             |     1562.0 |  2.64   |          9.88 |
| [express-graphql-dd-trace](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/express-graphql-dd-trace.js)                                       |     1530.6 |  2.81   |          9.68 |
| [apollo-server-express-tracing](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-server-express-tracing.js)                             |     1505.6 |  2.87   |         47.90 |
| [yoga-graphql-trace](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/yoga-graphql-trace.js)                                                   |      185.0 |  30.14  |          0.08 |
| [apollo-server-fastify+graphql-jit](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-server-fastify+graphql-jit.js)                     |        0.0 |  0.00   |          0.00 |
| [apollo-server-fastify](https://github.com/benawad/node-graphql-benchmarks/tree/master/benchmarks/apollo-server-fastify.js)                                             |        0.0 |  0.00   |          0.00 |

# Results

Results for 1000 requests, 5 concurrency, 5 pipelining and 10 users with 3 products in each region database (total 60 products).
┌─────────────────┬────────────┬─────────┬───────────────┐
│ Server │ Requests/s │ Latency │ Throughput/Mb │
├─────────────────┼────────────┼─────────┼───────────────┤
│ mercurius │ 345.6 │ 13.93 │ 2.59 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-REST │ 330.4 │ 14.62 │ 0.58 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ benzene-http │ 328.0 │ 14.74 │ 2.46 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ fastify-REST │ 297.4 │ 16.29 │ 0.50 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-gql │ 296.4 │ 16.38 │ 2.24 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ graphql-api-koa │ 294.8 │ 16.45 │ 2.21 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ koa-REST │ 290.0 │ 16.70 │ 0.49 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-graphql │ 289.6 │ 16.75 │ 2.19 │
└─────────────────┴────────────┴─────────┴───────────────┘

Results for 1000 requests, 5 concurrency, 5 pipelining and 20 users with 3 products in each region database (total 120 products).
┌─────────────────┬────────────┬─────────┬───────────────┐
│ Server │ Requests/s │ Latency │ Throughput/Mb │
├─────────────────┼────────────┼─────────┼───────────────┤
│ benzene-http │ 192.6 │ 25.35 │ 3.07 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-gql │ 173.4 │ 28.24 │ 2.78 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ graphql-api-koa │ 172.6 │ 28.30 │ 2.75 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ fastify-REST │ 169.2 │ 28.92 │ 0.54 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-graphql │ 158.8 │ 30.87 │ 2.54 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ mercurius │ 158.8 │ 30.88 │ 2.53 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ koa-REST │ 139.0 │ 35.35 │ 0.44 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-REST │ 138.6 │ 35.41 │ 0.45 │
└─────────────────┴────────────┴─────────┴───────────────┘

Results for 1000 requests, 5 concurrency, 5 pipelining and 30 users with 3 products in each region database (total 180 products).
┌─────────────────┬────────────┬─────────┬───────────────┐
│ Server │ Requests/s │ Latency │ Throughput/Mb │
├─────────────────┼────────────┼─────────┼───────────────┤
│ mercurius │ 111.2 │ 44.21 │ 2.77 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ benzene-http │ 105.8 │ 46.63 │ 2.63 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-graphql │ 105.4 │ 46.67 │ 2.63 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ fastify-REST │ 103.6 │ 47.37 │ 0.48 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ koa-REST │ 95.0 │ 51.94 │ 0.44 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-gql │ 91.6 │ 53.88 │ 2.28 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ graphql-api-koa │ 91.6 │ 53.82 │ 2.28 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-REST │ 90.6 │ 54.39 │ 0.43 │
└─────────────────┴────────────┴─────────┴───────────────┘

Results for 1000 requests, 5 concurrency, 5 pipelining and 40 users with 3 products in each region database (total 240 products).
┌─────────────────┬────────────┬─────────┬───────────────┐
│ Server │ Requests/s │ Latency │ Throughput/Mb │
├─────────────────┼────────────┼─────────┼───────────────┤
│ fastify-REST │ 77.8 │ 63.43 │ 0.48 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-graphql │ 77.0 │ 63.82 │ 2.60 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ koa-REST │ 76.4 │ 64.51 │ 0.47 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ mercurius │ 75.4 │ 65.79 │ 2.54 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ graphql-api-koa │ 74.2 │ 66.26 │ 2.50 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ benzene-http │ 74.0 │ 66.80 │ 2.49 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-REST │ 73.6 │ 66.81 │ 0.46 │
├─────────────────┼────────────┼─────────┼───────────────┤
│ express-gql │ 66.8 │ 73.95 │ 2.25 │
└─────────────────┴────────────┴─────────┴───────────────┘

Results for 1000 requests, 5 concurrency, 5 pipelining and 70 users with 3 products in each region database (total 420 products).
┌───────────────────────┬────────────┬─────────┬───────────────┐
│ Server │ Requests/s │ Latency │ Throughput/Mb │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ express-REST │ 41.6 │ 119.57 │ 0.45 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ fastify-REST │ 40.9 │ 121.60 │ 0.44 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ graphql-api-koa │ 38.8 │ 127.90 │ 2.36 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ benzene-http │ 38.2 │ 130.18 │ 2.32 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ express-gql │ 38.2 │ 129.86 │ 2.32 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ koa-REST │ 37.9 │ 131.24 │ 0.41 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ mercurius │ 37.8 │ 131.54 │ 2.30 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ express-graphql │ 37.7 │ 131.97 │ 2.29 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ apollo-server-express │ 37.5 │ 132.48 │ 2.28 │
├───────────────────────┼────────────┼─────────┼───────────────┤
│ fastify-gql │ 36.4 │ 136.52 │ 2.21 │
└───────────────────────┴────────────┴─────────┴───────────────┘
