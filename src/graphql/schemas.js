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

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  type Mutation {
    nuevoUsuario(usuario: UsuarioInput): Usuario
  }
`;

module.exports = typeDefs;
