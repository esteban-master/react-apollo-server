const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    obtenerCurso: String
  }
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    password: String
    creado: String
  }
`;

module.exports = typeDefs;
