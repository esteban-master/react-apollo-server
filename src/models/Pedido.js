const mongoose = require("mongoose");

const PedidoSchema = mongoose.Schema({
  pedido: { type: Array, required: true },
  total: { type: Number, required: true },
  estado: { type: String, default: "PENDIENTE" },
  creado: { type: Date, default: Date.now() },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente",
  },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
