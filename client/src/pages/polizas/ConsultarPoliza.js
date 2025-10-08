import { useEffect, useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaCheckCircle, FaExclamationTriangle, FaEye, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import api from "../../services/api";

export default function ConsultarPolizas() {
  const [polizas, setPolizas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vehiculosSinPoliza, setVehiculosSinPoliza] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPolizas();
    obtenerVehiculosSinPoliza();
  }, []);

  const obtenerPolizas = async () => {
    try {
      const { data } = await api.get("/api/polizas");
      setPolizas(data);
    } catch (error) {
      console.error("Error al cargar pólizas:", error);
    }
  };

  const obtenerVehiculosSinPoliza = async () => {
    try {
      const { data } = await api.get("/api/polizas/vehiculos-disponibles");
      setVehiculosSinPoliza(data);
    } catch (error) {
      console.error("Error al cargar vehículos sin póliza:", error);
    }
  };

  const eliminarPoliza = async (poliza) => {
    const hoy = new Date();
    const vencimiento = new Date(poliza.Fecha_Vencimiento);
    let mensajeConfirmacion = "¿Está seguro que desea eliminar esta póliza?";
    if (vencimiento >= hoy) {
      mensajeConfirmacion = "La póliza aún está vigente. ¿Está seguro que desea eliminarla?";
    }

    const confirmacion = await Swal.fire({
      title: "Eliminar Póliza",
      text: mensajeConfirmacion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await api.delete(`/api/polizas/${poliza.ID_Poliza}`);
      Swal.fire("Eliminada", "La póliza fue eliminada exitosamente", "success");
      await Promise.all([obtenerPolizas(), obtenerVehiculosSinPoliza()]);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Error al eliminar la póliza", "error");
    }
  };

  const calcularColor = (fechaVencimiento) => {
    if (!fechaVencimiento) return { color: "secondary", icon: null };
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const mesesRestantes =
      (vencimiento.getFullYear() - hoy.getFullYear()) * 12 +
      (vencimiento.getMonth() - hoy.getMonth());
    if (mesesRestantes > 4) return { color: "success", icon: <FaCheckCircle /> };
    if (mesesRestantes >= 2) return { color: "warning", icon: <FaExclamationTriangle /> };
    return { color: "danger", icon: <FaExclamationTriangle /> };
  };

  const polizasFiltradas = polizas.filter((p) =>
    p.Numero_Poliza.toLowerCase().includes(filtro.toLowerCase()) ||
    p.Placa.toLowerCase().includes(filtro.toLowerCase()) ||
    p.Aseguradora.toLowerCase().includes(filtro.toLowerCase())
  );

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Pólizas", 105, 20, null, null, "center");

    const fechaActual = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${fechaActual}`, 14, 30);

    const columnas = [
      { header: "ID", dataKey: "id" },
      { header: "Número", dataKey: "numero" },
      { header: "Placa", dataKey: "placa" },
      { header: "Aseguradora", dataKey: "aseguradora" },
      { header: "Vencimiento", dataKey: "vencimiento" },
    ];
    const filas = polizasFiltradas.map((p) => ({
      id: p.ID_Poliza,
      numero: p.Numero_Poliza,
      placa: p.Placa,
      aseguradora: p.Aseguradora,
      vencimiento: new Date(p.Fecha_Vencimiento).toLocaleDateString(),
    }));

    autoTable(doc, {
      startY: 40,
      columns: columnas,
      body: filas,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, null, null, "center");
    }

    doc.save("reporte_polizas.pdf");
  };

  return (
    <SidebarLayout>
      <div className="container">
        <h2 className="mb-4 text-success">Pólizas</h2>

        {/* Filtro */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Filtrar por número, placa o aseguradora"
            className="form-control"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* Botón Generar PDF */}
        <button className="btn btn-danger mb-3" onClick={generarPDF}>
          <FaFilePdf className="me-2" /> Generar Reporte PDF
        </button>

        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Vehículo</th>
              <th>Aseguradora</th>
              <th>Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {polizasFiltradas.map((p) => {
              const { color, icon } = calcularColor(p.Fecha_Vencimiento);
              return (
                <tr key={p.ID_Poliza}>
                  <td>{p.ID_Poliza}</td>
                  <td>{p.Numero_Poliza}</td>
                  <td>{`${p.Placa} - ${p.Marca} ${p.Linea} ${p.Modelo}`}</td>
                  <td>{p.Aseguradora}</td>
                  <td className={`text-${color} fw-bold`}>
                    {new Date(p.Fecha_Vencimiento).toLocaleDateString()} {icon}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/polizas/detalle/${p.ID_Poliza}`)}>
                        <FaEye /> Ver
                      </button>
                      <button className="btn btn-success btn-sm" onClick={() => navigate(`/polizas/modificar/${p.ID_Poliza}`)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarPoliza(p)}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {vehiculosSinPoliza.length > 0 && (
          <>
            <h3 className="mt-5 text-warning">Vehículos Sin Póliza</h3>
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Línea</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosSinPoliza.map((v) => (
                  <tr key={v.ID_Vehiculo} className="table-warning">
                    <td>{v.ID_Vehiculo}</td>
                    <td>{v.Placa}</td>
                    <td>{v.Tipos}</td>
                    <td>{v.Marca}</td>
                    <td>{v.Linea}</td>
                    <td>{v.Modelo}</td>
                    <td>{v.Estatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
