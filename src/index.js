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
    // console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const usuarioVerificado = jsonWebToken.verify(
          token,
          process.env.SECRECT_JSONWEBTOKEN
        );
        return {
          usuario: usuarioVerificado,
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log("Servidor en la URL: ", url);
});
