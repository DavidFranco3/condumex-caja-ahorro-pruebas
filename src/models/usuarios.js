const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarios = new Schema(
  {
    nombre: { type: String },
    apellidos: { type: String },
    telefonoCelular: { type: String },
    correo: { type: String },
    password: { type: String },
    estado: { type: String },
    createDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

usuarios.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Usuarios", usuarios, "Usuarios");
