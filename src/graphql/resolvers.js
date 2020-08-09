const Usuario = require("../models/Usuario");

const resolvers = {
  Query: {
    obtenerCurso: () => "Holaaaa",
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
  },
};

module.exports = resolvers;
