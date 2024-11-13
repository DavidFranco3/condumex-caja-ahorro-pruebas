import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { Form, Dropdown, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  getRazonSocial,
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
  setRazonSocial,
} from '../../api/auth';
import { obtenerUsuario } from "../../api/usuarios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Header = (props) => {
  const { setRefreshCheckLogin, setOptionSelect } = props
  const redirecciona = useNavigate()

  //Para cerrar la sesión
  const cerrarSesion = () => {
    toast.success('Sesión cerrada')
    redirecciona('')
    logoutApi()
    setRefreshCheckLogin(true)
  }

  const [nombreUsuario, setNombreUsuario] = useState("");

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          setNombreUsuario(data.nombre + " " + data.apellidos);
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            //console.log("No hay internet")
            toast.error("Conexión al servidor no disponible");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  // Para almacenar en localStorage la razón social
  const almacenaRazonSocial = (razonSocial) => {
    if (
      razonSocial === 'Asociación de Empleados Sector Cables A.C.' ||
      razonSocial === 'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.' ||
      razonSocial === 'CONDUMEX S.A. DE C.V.'
    ) {
      setRazonSocial(razonSocial)
      setOptionSelect(razonSocial)
    }
    window.location.reload()
  };

  const [razonSocialElegida, setRazonSocialElegida] = useState('')

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial())
    }
  }, [])

  // Cerrado de sesión automático
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

  // Para ir hacia el inicio
  const enrutaInicio = () => {
    redirecciona('/')
  }

  return (
    <nav
      className={`main-header navbar navbar-expand navbar-white navbar-light ${razonSocialElegida === 'Asociación de Empleados Sector Cables A.C.'
        ? 'bg-gray-900'
        : razonSocialElegida === 'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
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
      <ul className="navbar-nav menuH">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            //href="#"
            //role="button"
          >
            <i className="fas fa-bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block"></li>
      </ul>
      {/* Selector de Razón Social, centrado */}
      <div className="d-flex justify-content-center w-100">
        <div style={{ minWidth: '250px' }}> {/* Limita el ancho del contenedor */}
          <Form.Control
            as="select"
            className="form-control form-control-sm text-center"
            aria-label="indicadorRazonSocial"
            name="razonSocial"
            defaultValue={razonSocialElegida}
            onChange={(e) => almacenaRazonSocial(e.target.value)}
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
        </div>
      </div>

      {/* Right navbar links */}
      <ul class="navbar-nav ml-auto perfilDropdown text-right">
        <li className="perfilCierreBarra">
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="dropPerfil"
              id="dropdown-basic"
            >
              <FontAwesomeIcon icon={faCircleUser} className="iconoUsuario" />
              <span className="nombreUsuario">
                {nombreUsuario}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <NavDropdown.Item onClick={() => cerrarSesion()}>
                <i class="fas fa-user-times iconoCerrarS" /> Cerrar sesión
              </NavDropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </nav>
  )
}

export default Header
