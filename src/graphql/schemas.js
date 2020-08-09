const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    obtenerUsuario(token: String!): Usuario
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

  type Token {
    token: String
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  type Mutation {
    nuevoUsuario(usuario: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token
  }
`;

module.exports = typeDefs;
