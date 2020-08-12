const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const jsonWebToken = require("jsonwebtoken");
const Pedido = require("../models/Pedido");
require("dotenv").config({ path: "variables.env" });

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuario = jsonWebToken.verify(
        token,
        process.env.SECRECT_JSONWEBTOKEN
      );
      return usuario;
    },
    obtenerProductos: async () => {
      try {
        return await Producto.find({});
      } catch (error) {
        throw new Error(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      try {
        const productoFind = await Producto.findById(id);
        if (!productoFind) throw new Error("Producto no encontrado");
        return productoFind;
      } catch (error) {
        throw new Error(error);
      }
    },
    obtenerClientes: async () => {
      try {
        return await Cliente.find({});
      } catch (error) {
        throw new Error(error);
      }
    },
    obtenerClientesVendedor: async (_, __, { usuario }) => {
      try {
        return await Cliente.find({ vendedor: usuario.id.toString() });
      } catch (error) {
        throw new Error(error);
      }
    },
    obtenerCliente: async (_, { id }, { usuario }) => {
      try {
        const clienteFind = await Cliente.findById(id);

        if (!clienteFind) throw new Error("El cliente no existe");
        if (clienteFind.vendedor.toString() !== usuario.id)
          throw new Error("No tienes las credenciales para ver al cliente");

        return clienteFind;
      } catch (error) {
        throw new Error(error);
      }
    },
    mejoresClientes: async () => {
      const clientes = await Pedido.aggregate([
        { $match: { estado: "COMPLETADO" } },
        {
          $group: {
            _id: "$cliente",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "clientes",
            localField: "_id",
            foreignField: "_id",
            as: "cliente",
          },
        },
        {
          $sort: { total: -1 },
        },
      ]);

      return clientes;
    },
    mejoresVendedores: async () => {
      const vendedores = await Pedido.aggregate([
        { $match: { estado: "COMPLETADO" } },
        {
          $group: {
            _id: "$vendedor",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "_id",
            foreignField: "_id",
            as: "vendedor",
          },
        },
        {
          $limit: 3,
        },
        {
          $sort: { total: -1 },
        },
      ]);

      return vendedores;
    },
    buscarProducto: async (_, { texto }) => {
      return await Producto.find({ $text: { $search: texto } });
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { usuario }) => {
      const { email } = usuario;
      const findUsuario = await Usuario.findOne({ email });
      if (findUsuario) {
        throw new Error("Usuario ya registrado");
      }
      try {
        return new Usuario(usuario).save();
      } catch (error) {
        throw new Error(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      const findUsuario = await Usuario.findOne({ email });
      if (!findUsuario) {
        throw new Error("El usuario no existe");
      }
      if (!findUsuario.compararPassword(password)) {
        throw new Error("Password incorrecto");
      }

      return {
        token: findUsuario.crearToken(process.env.SECRECT_JSONWEBTOKEN, "24h"),
      };
    },
    nuevoProducto: async (_, { input }) => {
      try {
        return await new Producto(input).save();
      } catch (error) {
        throw new Error(error);
      }
    },
    updateProducto: async (_, { id, input }) => {
      const { nombre, existencia, precio } = input;
      const productoUpdate = await Producto.findByIdAndUpdate(
        id,
        {
          nombre,
          existencia,
          precio,
        },
        { new: true }
      );
      if (!productoUpdate) throw new Error("ID Invalido");

      return productoUpdate;
    },
    deleteProducto: async (_, { id }) => {
      try {
        const pro = await Producto.findByIdAndDelete(id);
        if (!pro) throw new Error("Producto no encontrado");
        return "Producto eliminado";
      } catch (error) {
        throw new Error("ID Invalida");
      }
    },
    nuevoCliente: async (_, { input }, { usuario }) => {
      const { email } = input;
      const clienteFind = await Cliente.findOne({ email });
      if (clienteFind) {
        throw new Error("El cliente ya registrado");
      }

      try {
        input.vendedor = usuario.id;
        return await new Cliente(input).save();
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    updateCliente: async (_, { id, input }, { usuario }) => {
      try {
        const clienteFind = await Cliente.findById(id);
        if (!clienteFind) throw new Error("El cliente no existe");
        if (clienteFind.vendedor.toString() !== usuario.id)
          throw new Error("No tienes las credenciales para ver al cliente");

        return await Cliente.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteCliente: async (_, { id }, { usuario }) => {
      try {
        const clienteFind = await Cliente.findById(id);
        if (!clienteFind) throw new Error("El cliente no existe");
        if (clienteFind.vendedor.toString() !== usuario.id)
          throw new Error(
            "No tienes las credenciales para eliminar al cliente"
          );

        await Cliente.findByIdAndDelete(id);
        return "Cliente eliminado";
      } catch (error) {
        throw new Error(error);
      }
    },
    nuevoPedido: async (_, { input }, { usuario }) => {
      const { cliente, pedido } = input;
      const clienteFind = await Cliente.findById(cliente);
      if (!clienteFind) throw new Error("El cliente no existe");
      if (clienteFind.vendedor.toString() !== usuario.id)
        throw new Error("No tienes las credenciales");

      for await (const articulo of pedido) {
        const { id, cantidad } = articulo;
        const producto = await Producto.findById(id);

        if (cantidad > producto.existencia) {
          throw new Error(
            `El articulo ${producto.nombre} excede la cantidad disponible`
          );
        } else {
          producto.existencia = producto.existencia - cantidad;
          await producto.save();
        }
      }

      input.vendedor = usuario.id;
      return await new Pedido(input).save();
    },
  },
};

module.exports = resolvers;
