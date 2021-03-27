require('dotenv').config()
// Utilizando Env https://humanwhocodes.com/blog/2021/02/introducing-env-javascript-environment-variables/#fn:1
const { Env } = require("@humanwhocodes/env");
const env = new Env()

const PORT = env.first(["PORT", "HTTP_PORT"], 8080);
const MONGO_DB_URI = env.get("MONGO_DB_URI")

module.exports = {
    PORT,
    MONGO_DB_URI
}