import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  getRazonSocial,
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
  setRazonSocial,
} from '../../api/auth'
import ImagenPerfil from '../../assets/png/user-avatar.png'
import LogoCajadeAhorro from '../../assets/png/caja-de-ahorro.png'

const Header = (props) => {
  console.log('props', props)
  const { setRefreshCheckLogin, children, setOptionSelect } = props

  const redirecciona = useNavigate()

  //Para cerrar la sesion
  const cerrarSesion = () => {
    toast.success('Sesión cerrada')
    redirecciona('')
    logoutApi()
    setRefreshCheckLogin(true)
  }

  // Para almacenar en localStorage la razón social
  const almacenaRazonSocial = (razonSocial) => {
    if (
      razonSocial === 'Asociación de Empleados Sector Cables A.C.' ||
      razonSocial === 'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.' ||
      razonSocial === 'CONDUMEX S.A. DE C.V.'
    ) {
      setRazonSocial(razonSocial); // Actualiza el estado local para la razón social
      setOptionSelect(razonSocial); // Actualiza el estado en el Layout
    }
    window.location.reload()
  };

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, [])

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        toast.warning('Sesión expirada')
        toast.success('Sesión cerrada por seguridad')
        logoutApi()
        setRefreshCheckLogin(true)
      }
    }
  }, [])
  // Termina cerrado de sesión automatico

  // Para ir hacia el inicio
  const enrutaInicio = () => {
    redirecciona('/')
  }
  return (
    <nav
      className={`main-header navbar navbar-expand navbar-white navbar-light ${
        razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.'
          ? 'bg-gray-900'
          : razonSocialElegida ===
              'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
            ? 'bg-orange-900'
            : razonSocialElegida === 'CONDUMEX S.A. DE C.V.'
              ? 'bg-sky-900'
              : 'bg-black'
      }`}
      style={{
        backgroundColor:
          razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.'
            ? '#0a0a0a'
            : '',
      }}
    >
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            style={{ color: 'white' }}
          >
            <i className="fas fa-bars" />
          </a>
        </li>
        <li className="nav-item flex justify-center w-full">
          {/* Selector de Razón Social */}
          <Form.Control
            as="select"
            className="form-control form-control-sm"
            aria-label="indicadorRazonSocial"
            name="razonSocial"
            defaultValue={razonSocialElegida}
            onChange={(e) => almacenaRazonSocial(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            <option value="">Selecciona la razón social</option>
            <option
              value="Asociación de Empleados Sector Cables A.C."
              selected={
                razonSocialElegida ===
                'Asociación de Empleados Sector Cables A.C.'
              }
            >
              Asociación de Empleados Sector Cables A.C.
            </option>
            <option
              value="Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C."
              selected={
                razonSocialElegida ===
                'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
              }
            >
              Asociación de Trabajadores Sindicalizados en Telecomunicaciones
              A.C.
            </option>
          </Form.Control>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Botón de perfil con menú desplegable */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#" role="button">
            <img
              src={ImagenPerfil}
              className="img-circle elevation-2"
              alt="User Image"
              style={{ width: '30px', height: '30px' }}
            />
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <button
              className="dropdown-item cerrarSesion"
              onClick={() => cerrarSesion()}
            >
              Cerrar sesión
            </button>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Header
