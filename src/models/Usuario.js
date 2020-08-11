const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");

const UsuarioSchema = mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  creado: { type: Date, default: Date.now() },
});

UsuarioSchema.pre("save", function (next) {
  const usuario = this;
  if (!usuario.isModified("password")) return next();
  const hash = bcryptjs.hashSync(usuario.password, bcryptjs.genSaltSync(10));
  usuario.password = `${hash}`;
  next();
});

UsuarioSchema.methods.compararPassword = function (password) {
  return bcryptjs.compareSync(password, this.password);
};

UsuarioSchema.methods.crearToken = function (secrect, expiresIn) {
  const { id, email, nombre, apellido } = this;
  return jsonWebToken.sign({ id, email, nombre, apellido }, secrect, {
    expiresIn,
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
