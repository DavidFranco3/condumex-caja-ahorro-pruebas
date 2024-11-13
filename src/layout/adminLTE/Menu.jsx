import React, { useEffect, useState } from 'react'
import LogoCajadeAhorro from '/src/assets/png/caja-de-ahorro.png'
import { getRazonSocial } from '../../api/auth'
import { Link, useNavigate } from 'react-router-dom'

const Menu = () => {
  const enrutamiento = useNavigate()

  const goTo = (ruta) => enrutamiento(ruta)

  const ItemCard = ({ path, title, logo }) => (
    <li className="nav-item">
      <a
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => goTo(path)}
        style={{ cursor: 'pointer' }}
      >
        <i className={`nav-icon fas ${logo}`} />
        <p>{title}</p>
      </a>
    </li>
  )

  const [optionSelect, setOptionSelect] = useState(null)

  useEffect(() => {
    if (getRazonSocial()) {
      setOptionSelect(getRazonSocial)
    }
  }, [])

  // Determinar el color de la barra lateral basado en optionSelect
  const sidebarColor =
    optionSelect === 'Asociación de Empleados Sector Cables A.C.'
      ? 'bg-gray-900'
      : optionSelect ===
        'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
        ? 'bg-orange-900'
        : optionSelect === 'CONDUMEX S.A. DE C.V.'
          ? 'bg-sky-900'
          : 'bg-white-900' // Puedes agregar más condiciones si es necesario

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
        <hr style={{ color: "white", marginTop: "5px" }} />
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
            <ItemCard
                path={'/'}
                logo={'fa-home'}
                title={'Inicio'}
              />
              <ItemCard
                path={'/socios'}
                logo={'fa-users'}
                title={'Socios'}
              />
              <ItemCard
                path={'/baja-de-socios'}
                logo={'fa-user-minus'}
                title={'Baja de socios'}
              />
              <ItemCard
                path={'/aportaciones'}
                logo={'fa-donate'}
                title={'Aportaciones'}
              />
              <ItemCard
                path={'/prestamos'}
                logo={'fa-hand-holding-usd'}
                title={'Préstamos'}
              />
              <ItemCard
                path={'/retiros'}
                logo={'fa-money-bill-wave'}
                title={'Retiros'}
              />
              <ItemCard
                path={'/intereses'}
                logo={'fa-percent'}
                title={'Intereses'}
              />

              {optionSelect ===
                'Asociación de Empleados Sector Cables A.C.' && (
                  <ItemCard
                    path={'/patrimonio'}
                    logo={'fa-warehouse'}
                    title={'Patrimonio'}
                  />
                )}

              <ItemCard
                path={'/abonos'}
                logo={'fa-wallet'}
                title={'Abonos'}
              />
              <ItemCard
                path={'/deudaSocio'}
                logo={'fa-user-clock'}
                title={'Deudas de los socios'}
              />
              <ItemCard
                path={'/interesesSocios'}
                logo={'fa-chart-line'}
                title={'Intereses de los socios'}
              />
              <ItemCard
                path={'/saldosSocios'}
                logo={'fa-balance-scale'}
                title={'Saldos de los socios'}
              />
              <ItemCard
                path={'/movimientos'}
                logo={'fa-exchange-alt'}
                title={'Movimientos'}
              />
              <ItemCard
                path={'/estados-de-cuenta'}
                logo={'fa-file-invoice-dollar'}
                title={'Estados de cuenta'}
              />
              <ItemCard
                path={'/periodos'}
                logo={'fa-cogs'}
                title={'Ajustes'}
              />
              <ItemCard
                path={'/respaldo-informacion'}
                logo={'fa-database'}
                title={'Respaldos'}
              />
              <ItemCard
                path={'/usuarios'}
                logo={'fa-user-cog'}
                title={'Usuarios'}
              />
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  )
}

export default Menu
