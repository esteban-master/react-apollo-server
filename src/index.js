const { ApolloServer } = require("apollo-server");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/schemas");

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

server.listen().then(({ url }) => {
  console.log("Servidor en la URL: ", url);
});