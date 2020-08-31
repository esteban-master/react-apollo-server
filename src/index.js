const { ApolloServer } = require("apollo-server");
const jsonWebToken = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schemas");
const connectDB = require("./config/db");

connectDB();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    console.log("req:", req);
    if (token) {
      try {
        const usuarioVerificado = jsonWebToken.verify(
          token.replace("Bearer", "").trim(),
          process.env.SECRECT_JSONWEBTOKEN
        );
        // console.log(usuarioVerificado);
        return {
          usuario: usuarioVerificado,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log("Servidor en la URL: ", url);
});
