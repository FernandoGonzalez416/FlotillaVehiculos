import { useEffect, useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import Swal from "sweetalert2";
import api from "../../services/api";

export default function AsignarVehiculo() {
  const [pilotos, setPilotos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({
    id_empleado: "",
    id_vehiculo: "",
    observaciones: ""
  });

  const obtenerDisponibles = async () => {
    try {
      const { data } = await api.get("/api/asignacion/disponibles");
      setPilotos(data.pilotos);
      setVehiculos(data.vehiculos);

      if (data.pilotos.length === 0) {
        Swal.fire("Sin pilotos disponibles", "No hay pilotos disponibles para asignar un vehículo.", "info");
      }
      if (data.vehiculos.length === 0) {
        Swal.fire("Sin vehículos disponibles", "No hay vehículos disponibles para asignar a un piloto.", "info");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la información de disponibilidad", "error");
    }
  };

  useEffect(() => {
    obtenerDisponibles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/asignacion", formData);
      Swal.fire("Asignación realizada", "Vehículo asignado al piloto correctamente", "success");
      setFormData({ id_empleado: "", id_vehiculo: "", observaciones: "" });
      obtenerDisponibles();
    } catch (error) {
      const msg = error?.response?.data?.error || "No se pudo asignar el vehículo";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="container">
        <h2 className="mb-4">Asignar Vehículo a Piloto</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Piloto disponible *</label>
              <select className="form-select" name="id_empleado" value={formData.id_empleado} onChange={handleChange} required>
                <option value="">Seleccione un piloto</option>
                {pilotos.map((p) => (
                  <option key={p.ID_Empleado} value={p.ID_Empleado}>
                    {p.Nombres} {p.Apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Vehículo disponible *</label>
              <select className="form-select" name="id_vehiculo" value={formData.id_vehiculo} onChange={handleChange} required>
                <option value="">Seleccione un vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.ID_Vehiculo} value={v.ID_Vehiculo}>
                    {v.Placa} - {v.Marca} {v.Modelo}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Observaciones</label>
              <textarea className="form-control" name="observaciones" value={formData.observaciones} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Asignar Vehículo</button>
        </form>
      </div>
    </SidebarLayout>
  );
}
