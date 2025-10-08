// server/index.js
const express = require("express");
const cors = require("cors");

const app = express();

// CORS abierto (rápido para la tarea)
app.use(cors());
app.use(express.json());

// ---- Rutas ----
const empleadosRoutes = require("./routes/empleados");
const vehiculosRoutes = require("./routes/vehiculos");
const asignacionRoutes = require("./routes/asignacion");
const polizasRoutes = require("./routes/polizas");
const recorridosRoutes = require("./routes/recorridos");
const mantenimientosRoutes = require("./routes/mantenimientos");
const talleresRoutes = require("./routes/talleres");

app.use("/api/empleados", empleadosRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/polizas", polizasRoutes);
app.use("/api/recorridos", recorridosRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/talleres", talleresRoutes);

// Healthcheck
app.get("/health", (_, res) => res.send("ok"));

// Puerto: Railway define PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
