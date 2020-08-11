const { gql } = require("apollo-server");

const typeDefs = gql`
  type Cliente {
    id: ID
    nombre: String
    apellido: String
    email: String
    empresa: String
    telefono: String
    vendedor: ID
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    password: String
    creado: String
  }

  type Producto {
    id: ID!
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }

  type Pedido {
    id: ID
    pedido: [PedidoGrupo]
    total: Float
    cliente: ID
    vendedor: ID
    creado: String
    estado: EstadoPedido
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
  }

  type Token {
    token: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
  }

  input ClienteInput {
    nombre: String!
    apellido: String!
    email: String!
    empresa: String!
    telefono: String
  }

  input PedidoProductoInput {
    id: ID
    cantidad: Float!
  }

  enum EstadoPedido {
    PENDIENTE
    COMPLETADO
    CANCELADO
  }

  input PedidoInput {
    pedido: [PedidoProductoInput]
    total: Float!
    cliente: ID!
    estado: EstadoPedido
  }

  type Query {
    # Usuarios
    obtenerUsuario(token: String!): Usuario

    #Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto

    # Clientes
    obtenerClientes: [Cliente]
    obtenerClientesVendedor: [Cliente]
    obtenerCliente(id: ID!): Cliente
  }

  type Mutation {
    # Usuarios
    nuevoUsuario(usuario: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
    updateProducto(id: ID!, input: ProductoInput): Producto
    deleteProducto(id: ID!): String

    # Clientes
    nuevoCliente(input: ClienteInput): Cliente
    updateCliente(id: ID!, input: ClienteInput): Cliente
    deleteCliente(id: ID!): String

    # Pedidos
    nuevoPedido(input: PedidoInput): Pedido
  }
`;

module.exports = typeDefs;
