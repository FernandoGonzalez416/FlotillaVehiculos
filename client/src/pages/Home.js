// client/src/pages/Home.js
import SidebarLayout from "../layouts/SidebarLayout";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home() {
  return (
    <SidebarLayout>
      <div className="container mt-4">
        <h1 className="mb-4 text-center text-primary fw-bold">
          Bienvenido al Sistema de Flotillas
        </h1>

        {/* Carrusel principal */}
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          interval={4000}
          showStatus={false}
          dynamicHeight={false}
          className="mb-5 shadow-lg rounded"
        >
          <div>
            <img src="/images/flota1.jpg" alt="Flota 1" />
          </div>
          <div>
            <img src="/images/flota2.jpg" alt="Flota 2" />
          </div>
          <div>
            <img src="/images/flota3.jpg" alt="Flota 3" />
          </div>
        </Carousel>

        {/* Cards de resumen */}
        <div className="row">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Gestión de Empleados</h5>
                <p className="card-text">
                  Administra la información y control del personal asignado a la flotilla.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Control de Vehículos</h5>
                <p className="card-text">
                  Gestiona la información, asignaciones y estado general de los vehículos.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Historial de Mantenimientos</h5>
                <p className="card-text">
                  Consulta los servicios, mantenimientos y reparaciones realizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
