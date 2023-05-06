const mongoose = require("mongoose");
const { Schema } = mongoose;

const periodos = new Schema(
    {
        folio: { type: Number, required: true },
        nombre: { type: String, required: true },
        tipo: { type: String, required: true },
        fechaInicio: { type: String, required: true },
        fechaCierre: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

periodos.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.folio = Number(returnedObject.folio);
        returnedObject.nombre = String(returnedObject.nombre);
        returnedObject.fechainicio = String(returnedObject.fechaInicio);
        returnedObject.fechaCierre = String(returnedObject.fechaCierre);
        returnedObject.fechaCreacion =
            returnedObject.createDate || returnedObject.createdAt;
        returnedObject.fechaActualizacion = returnedObject.updatedAt;

        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Periodos", periodos, "Periodos");
