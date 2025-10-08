import { useEffect, useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AgregarMantenimiento() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [formData, setFormData] = useState({
    id_vehiculo: "",
    tipo_mantenimiento: "",
    fecha: "",
    kilometraje: "",
    titulo_mantenimiento: "",
    descripcion: "",
    id_taller: "",
    costo: "",
    frecuencia_servicio: "",
    kilometraje_proximo_servicio: ""
  });

  // Obtener vehículos y talleres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculosRes, talleresRes] = await Promise.all([
          api.get("/api/vehiculos/activos"),
          api.get("/api/talleres"),
        ]);
        setVehiculos(vehiculosRes.data);
        setTalleres(talleresRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };
    fetchData();
  }, []);

  // Recalcular servicio de motor
  useEffect(() => {
    if (formData.tipo_mantenimiento === "Servicio de Motor") {
      const frecuencia = 7000;
      setFormData((prev) => ({
        ...prev,
        frecuencia_servicio: frecuencia,
        kilometraje_proximo_servicio:
          parseInt(prev.kilometraje || 0) + frecuencia
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        frecuencia_servicio: "",
        kilometraje_proximo_servicio: ""
      }));
    }
  }, [formData.tipo_mantenimiento, formData.kilometraje]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "tipo_mantenimiento" && value === "Servicio de Motor") {
        updated.frecuencia_servicio = 7000;
      }
      if (name === "tipo_mantenimiento" && value !== "Servicio de Motor") {
        updated.frecuencia_servicio = "";
      }
      const km = parseInt(updated.kilometraje);
      const freq = parseInt(updated.frecuencia_servicio);
      updated.kilometraje_proximo_servicio =
        !isNaN(km) && !isNaN(freq) ? km + freq : "";
      return updated;
    });
  };

  const vehiculoOptions = vehiculos.map((v) => ({
    value: v.ID_Vehiculo,
    label: `${v.Placa} - ${v.Marca} ${v.Linea} ${v.Modelo}`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/mantenimientos", formData);
      Swal.fire("Mantenimiento registrado", "El registro fue exitoso", "success");
      setFormData({
        id_vehiculo: "",
        tipo_mantenimiento: "",
        fecha: "",
        kilometraje: "",
        titulo_mantenimiento: "",
        descripcion: "",
        id_taller: "",
        costo: "",
        frecuencia_servicio: "",
        kilometraje_proximo_servicio: ""
      });
      navigate("/mantenimientos/consultar");
    } catch (error) {
      const msg = error?.response?.data?.error || "No se pudo registrar el mantenimiento";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="container">
        <h2 className="mb-4">Agregar Mantenimiento</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Vehículo */}
            <div className="col-md-12 mb-3">
              <label className="form-label">Vehículo *</label>
              <Select
                options={vehiculoOptions}
                value={vehiculoOptions.find(opt => opt.value === parseInt(formData.id_vehiculo))}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, id_vehiculo: selected.value }))
                }
                placeholder="Seleccione un vehículo..."
                isSearchable
              />
            </div>

            {/* Tipo */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo de Mantenimiento *</label>
              <select
                name="tipo_mantenimiento"
                className="form-select"
                value={formData.tipo_mantenimiento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione tipo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Servicio de Motor">Servicio de Motor</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha *</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Título */}
            <div className="col-12 mb-3">
              <label className="form-label">Título del Mantenimiento *</label>
              <input
                type="text"
                name="titulo_mantenimiento"
                className="form-control"
                value={formData.titulo_mantenimiento}
                onChange={handleChange}
                required
              />
            </div>

            {/* Descripción */}
            <div className="col-12 mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>

            {/* Kilometraje */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Kilometraje *</label>
              <input
                type="number"
                name="kilometraje"
                className="form-control"
                value={formData.kilometraje}
                onChange={handleChange}
                required
              />
            </div>

            {/* Frecuencia */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Frecuencia de Servicio (km) *</label>
              <input
                type="number"
                name="frecuencia_servicio"
                className="form-control"
                value={formData.frecuencia_servicio}
                onChange={handleChange}
                readOnly={formData.tipo_mantenimiento === "Servicio de Motor"}
                required
              />
            </div>

            {/* Próximo servicio */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Próximo Servicio (km)</label>
              <input
                type="number"
                className="form-control"
                value={formData.kilometraje_proximo_servicio || ""}
                readOnly
              />
            </div>

            {/* Costo */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Costo</label>
              <input
                type="number"
                step="0.01"
                name="costo"
                className="form-control"
                value={formData.costo}
                onChange={handleChange}
              />
            </div>

            {/* Taller */}
            <div className="col-md-12 mb-4">
              <label className="form-label">Taller</label>
              <select
                name="id_taller"
                className="form-select"
                value={formData.id_taller}
                onChange={handleChange}
              >
                <option value="">Seleccione un taller</option>
                {talleres.map((t) => (
                  <option key={t.ID_Taller} value={t.ID_Taller}>
                    {t.Nombre_Taller}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Guardar Mantenimiento
              </button>
            </div>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
