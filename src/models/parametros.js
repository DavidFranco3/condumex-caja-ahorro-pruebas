const mongoose = require("mongoose");
const { Schema } = mongoose;

const parametros = new Schema(
  {
    inicioPeriodoEmpleados: { type: String },
    finPeriodoEmpleados: { type: String },
    fechaEnvioEstadosCuentaEmpleados: { type: String },
    fechaAporteEmpleados: { type: String },

    inicioPeriodoSindicalizados: { type: String },
    finPeriodoSindicalizados: { type: String },
    fechaEnvioEstadosCuentaSindicalizados: { type: String },
    fechaAporteSindicalizados: { type: String },
  },
  {
    timestamps: true,
  }
);

parametros.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.tasaInteres = Number(returnedObject.tasaInteres);

    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Parametros", parametros, "Parametros");
