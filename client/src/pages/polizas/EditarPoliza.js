import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarLayout from "../../layouts/SidebarLayout";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

export default function EditarPoliza() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero_poliza: "",
    aseguradora: "",
    monto: "",
    fecha_emision: "",
    fecha_vencimiento: ""
  });
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    const obtenerPoliza = async () => {
      try {
        const { data } = await api.get(`/api/polizas/${id}`);
        setFormData({
          numero_poliza: data.Numero_Poliza || "",
          aseguradora: data.Aseguradora || "",
          monto: data.Monto || "",
          fecha_emision: data.Fecha_Emision?.slice(0,10) || "",
          fecha_vencimiento: data.Fecha_Vencimiento?.slice(0,10) || ""
        });
        setVehiculo(`${data.Placa} - ${data.Marca} ${data.Linea} ${data.Modelo}`);
      } catch (error) {
        console.error("Error al cargar datos de la póliza:", error);
      }
    };
    obtenerPoliza();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/polizas/${id}`, formData);
      Swal.fire("Actualizado", "La póliza fue actualizada correctamente", "success");
      navigate("/polizas/consultar");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la póliza", "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="container">
        <h2 className="mb-4">Editar Póliza</h2>
        <button className="btn btn-secondary mb-4" onClick={() => navigate("/polizas/consultar")}>
          <FaArrowLeft className="me-2" /> Volver
        </button>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {vehiculo && (
              <div className="col-12 mb-3">
                <label className="form-label">Vehículo Asignado</label>
                <input type="text" className="form-control" value={vehiculo} readOnly />
              </div>
            )}

            <div className="col-md-6 mb-3">
              <label className="form-label">Número de Póliza *</label>
              <input
                type="text"
                className="form-control"
                name="numero_poliza"
                value={formData.numero_poliza}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Aseguradora</label>
              <input
                type="text"
                className="form-control"
                name="aseguradora"
                value={formData.aseguradora}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                className="form-control"
                name="monto"
                step="0.01"
                value={formData.monto}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Fecha de Emisión</label>
              <input
                type="date"
                className="form-control"
                name="fecha_emision"
                value={formData.fecha_emision}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Fecha de Vencimiento</label>
              <input
                type="date"
                className="form-control"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar Cambios
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}
