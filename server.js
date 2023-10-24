// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const https = require("https")

const server = jsonServer.create();

// Uncomment to allow write operations
const fs = require('fs')
const path = require('path')
const filePath = path.join('db.json')
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db)

// Comment out to allow write operations
// const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);
// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/auth/login?email=:email&password=:password":
      "/users?email=:email&password=:password",
    "/auth/user/:id": "/users/:id",
  })
);

server.use(router);


const keyFile = path.join(__dirname, 'server.key');
const certFile = path.join(__dirname, 'server.cert');


https.createServer({
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
}, server).listen(8000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;