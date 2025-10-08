import { useEffect, useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { Bar, Line, Pie } from "react-chartjs-2";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import "chart.js/auto";
import api from "../../services/api";

export default function ReporteriaRecorridos() {
  const [data, setData] = useState({
    topVehicles: [],
    topPilots: [],
    popularRoutes: [],
    performance: []
  });

  useEffect(() => {
    api.get("/api/recorridos/dashboard/summary")
      .then(({ data }) => setData(data))
      .catch(() => Swal.fire("Error", "No se pudo cargar datos del dashboard", "error"));
  }, []);

  const exportExcel = () => {
    api.get("/api/recorridos/dashboard/reporte-excel", { responseType: "blob" })
      .then(({ data }) => {
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "Reporte_Dashboard_Recorridos.xlsx";
        a.click();
      })
      .catch(() => Swal.fire("Error", "No se pudo descargar el reporte", "error"));
  };

  const exportAllExcel = () => {
    api.get("/api/recorridos/all-excel", { responseType: "blob" })
      .then(({ data }) => {
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "Todos_Recorridos.xlsx";
        a.click();
      })
      .catch(() => Swal.fire("Error", "No se pudo descargar el Excel completo", "error"));
  };

  const exportAllPdf = () => {
    api.get("/api/recorridos/all-pdf", { responseType: "blob" })
      .then(({ data }) => {
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "Todos_Recorridos.pdf";
        a.click();
      })
      .catch(() => Swal.fire("Error", "No se pudo descargar el PDF completo", "error"));
  };

  const makeChart = (labels, values, label, type = "bar") => ({
    labels,
    datasets: [{
      label,
      data: values,
      backgroundColor: type === "pie"
        ? ["#4dc9f6","#f67019","#f53794","#537bc4","#acc236"]
        : "rgba(75,192,192,0.6)"
    }]
  });

  return (
    <SidebarLayout>
      <div className="container">
        <h2 className="mb-4">Dashboard de Recorridos</h2>
        <div className="d-flex flex-wrap align-items-start mb-4 gap-2">
          <button className="btn btn-success" onClick={exportExcel}>
            <FaFileExcel className="me-1" /> Exportar Dashboard Excel
          </button>
          <button className="btn btn-primary" onClick={exportAllExcel}>
            <FaFileExcel className="me-1" /> Descargar Todo Excel
          </button>
          <button className="btn btn-danger" onClick={exportAllPdf}>
            <FaFilePdf className="me-1" /> Descargar Todo PDF
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="text-center">Top 5 Vehículos (Nº Recorridos)</h3>
            <Bar
              data={makeChart(
                data.topVehicles.map(r => r.label),
                data.topVehicles.map(r => r.value),
                "Recorridos"
              )}
            />
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="text-center">Top 5 Pilotos (Nº Recorridos)</h3>
            <Pie
              data={makeChart(
                data.topPilots.map(r => r.label),
                data.topPilots.map(r => r.value),
                "Recorridos",
                "pie"
              )}
            />
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="text-center">Rutas más Frecuentes</h3>
            <Bar
              data={makeChart(
                data.popularRoutes.map(r => r.label),
                data.popularRoutes.map(r => r.value),
                "Veces"
              )}
              options={{ indexAxis: "y" }}
            />
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="text-center">Rendimiento Promedio por Vehículo</h3>
            <Line
              data={makeChart(
                data.performance.map(r => r.label),
                data.performance.map(r => r.value),
                "Km / Hora"
              )}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
