const Usuario = require("../models/Usuario");
const jsonWebToken = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

function crearToken(usuario, secrect, expiresIn) {
  const { id, email, nombre, apellido } = usuario;
  return jsonWebToken.sign({ id, email, nombre, apellido }, secrect, {
    expiresIn,
  });
}

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuario = jsonWebToken.verify(
        token,
        process.env.SECRECT_JSONWEBTOKEN
      );
      return usuario;
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
        token: crearToken(findUsuario, process.env.SECRECT_JSONWEBTOKEN, "24h"),
      };
    },
  },
};

module.exports = resolvers;
