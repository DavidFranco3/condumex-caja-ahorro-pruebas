import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LogoCajadeAhorro from '/src/assets/png/caja-de-ahorro.png';
import { getRazonSocial } from '../../api/auth';

const Menu = () => {
  const enrutamiento = useNavigate();
  const location = useLocation(); // Obtiene la ruta actual

  const goTo = (ruta) => enrutamiento(ruta);

  // Componente para los elementos del menú
  const ItemCard = ({ path, title, logo }) => (
    <li
      className="nav-item"
      style={{
        backgroundColor: location.pathname === path ? 'blue' : '', // Fondo azul si el path coincide
      }}
    >
      <a
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => goTo(path)}
        style={{
          cursor: 'pointer',
          color: location.pathname === path ? 'white' : '', // Texto blanco si el fondo es azul
          fontWeight: location.pathname === path ? 'bold' : 'normal',
        }}
      >
        <i className={`nav-icon fas ${logo}`} />
        <p>{title}</p>
      </a>
    </li>
  );

  const [optionSelect, setOptionSelect] = useState(null);

  useEffect(() => {
    if (getRazonSocial()) {
      setOptionSelect(getRazonSocial());
    }
  }, []);

  // Determina el color de la barra lateral basado en `optionSelect`
  const sidebarColor =
    optionSelect === 'Asociación de Empleados Sector Cables A.C.'
      ? 'bg-gray-900'
      : optionSelect === 'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
      ? 'bg-orange-900'
      : optionSelect === 'CONDUMEX S.A. DE C.V.'
      ? 'bg-sky-900'
      : 'bg-white-900';

  return (
    <div>
      <aside
        className={`main-sidebar sidebar-dark-primary elevation-4 ${sidebarColor}`}
        style={{
          backgroundColor:
            optionSelect === 'Asociación de Empleados Sector Cables A.C.'
              ? '#0a0a0a'
              : '',
        }}
      >
        {/* Brand Logo */}
        <Link to="/">
          <img
            src={LogoCajadeAhorro}
            alt="Caja de ahorro"
            style={{ height: '50px' }}
          />
        </Link>

        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <ItemCard path="/" logo="fa-home" title="Inicio" />
              <ItemCard path="/socios" logo="fa-users" title="Socios" />
              <ItemCard path="/baja-de-socios" logo="fa-user-minus" title="Baja de socios" />
              <ItemCard path="/aportaciones" logo="fa-donate" title="Aportaciones" />
              <ItemCard path="/prestamos" logo="fa-hand-holding-usd" title="Préstamos" />
              <ItemCard path="/retiros" logo="fa-money-bill-wave" title="Retiros" />
              <ItemCard path="/intereses" logo="fa-percent" title="Intereses" />

              {optionSelect === 'Asociación de Empleados Sector Cables A.C.' && (
                <ItemCard path="/patrimonio" logo="fa-warehouse" title="Patrimonio" />
              )}

              <ItemCard path="/abonos" logo="fa-wallet" title="Abonos" />
              <ItemCard path="/deudaSocio" logo="fa-user-clock" title="Deudas de los socios" />
              <ItemCard path="/interesesSocios" logo="fa-chart-line" title="Intereses de los socios" />
              <ItemCard path="/saldosSocios" logo="fa-balance-scale" title="Saldos de los socios" />
              <ItemCard path="/movimientos" logo="fa-exchange-alt" title="Movimientos" />
              <ItemCard path="/estados-de-cuenta" logo="fa-file-invoice-dollar" title="Estados de cuenta" />
              <ItemCard path="/periodos" logo="fa-cogs" title="Ajustes" />
              <ItemCard path="/respaldo-informacion" logo="fa-database" title="Respaldos" />
              <ItemCard path="/usuarios" logo="fa-user-cog" title="Usuarios" />
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Menu;
