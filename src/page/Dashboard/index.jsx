import { useEffect, useState } from 'react';
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from '../../api/auth';
import { obtenerUsuario } from '../../api/usuarios';
import { toast } from 'react-toastify';
import { Image, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faDonate,
  faMoneyBillWave,
  faPercent,
  faHandHoldingUsd,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
// Importaciones de imagenes del dashboard
import { listarAbono } from '../../api/abonos';
import { listarAportacion } from '../../api/aportaciones';
import { listarRetiro } from '../../api/retiros';
import { listarRendimiento } from '../../api/rendimientos';
import { listarPrestamo } from '../../api/prestamos';
import { listarPatrimonios } from '../../api/patrimonio';
import './Dashboard.scss';

function Dashboard(props) {
  const { setRefreshCheckLogin } = props;

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        toast.warning('Sesión expirada');
        toast.success('Sesión cerrada por seguridad');
        logoutApi();
        setRefreshCheckLogin(true);
      }
    }
  }, []);
  // Termina cerrado de sesión automatico

  // Almacena la razón social, si ya fue elegida
  const [razonSocialElegida, setRazonSocialElegida] = useState("");

  useEffect(() => {
    if (getRazonSocial()) {
      setRazonSocialElegida(getRazonSocial)
    }
  }, []);
  // Almacena los datos de los abonos
  const [listAbonos, setListAbonos] = useState(null);

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAbono(razonSocialElegida).then(response => {
        const { data } = response;
        // console.log(data)
        if (!listAbonos && data) {
          setListAbonos(formatModelAbonos(data));
        } else {
          const datosAbonos = formatModelAbonos(data);
          setListAbonos(datosAbonos)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [razonSocialElegida]);

  // Para almacenar el listado de aportaciones
  const [listAportaciones, setListAportaciones] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAportacion(razonSocialElegida).then(response => {
        const { data } = response;
        // console.log(data)
        if (!listAportaciones && data) {
          setListAportaciones(formatModelAportaciones(data));
        } else {
          const datosAportaciones = formatModelAportaciones(data);
          setListAportaciones(datosAportaciones)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [razonSocialElegida]);

  // Almacena el listado de retiros
  const [listRetiros, setListRetiros] = useState(null);

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarRetiro(razonSocialElegida).then(response => {
        const { data } = response;
        // console.log(data)
        if (!listRetiros && data) {
          setListRetiros(formatModelRetiros(data));
        } else {
          const datosRetiros = formatModelRetiros(data);
          setListRetiros(datosRetiros)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [razonSocialElegida]);

  // Para almacenar el listado de Rendimientos
  const [listRendimientos, setListRendimientos] = useState(null)

  useEffect(() => {
    try {
      listarRendimiento(razonSocialElegida)
        .then((response) => {
          const { data } = response
          if (listRendimientos && data) {
            setListRendimientos(formatModelRendimientos(data))
          } else {
            const datosRendimientos = formatModelRendimientos(data)
            setListRendimientos(datosRendimientos)
          }
        })
        .catch((e) => {
          console.error(e)
        })
    } catch (e) {
      console.log(e)
    }
  }, [razonSocialElegida]);

  // Almacena los datos de los prestamos
  const [listPrestamos, setListPrestamos] = useState(null);

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarPrestamo(razonSocialElegida).then(response => {
        const { data } = response;
        // console.log(data)
        if (!listPrestamos && data) {
          setListPrestamos(formatModelPrestamos(data));
        } else {
          const datosPrestamos = formatModelPrestamos(data);
          setListPrestamos(datosPrestamos)
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }, [razonSocialElegida]);

    // Almacena los datos de los patrimonios
    const [listPatrimonios, setListPatrimonios] = useState(null);

    useEffect(() => {
      try {
        // Inicia listado de detalles de los articulos vendidos
        listarPatrimonios(razonSocialElegida).then(response => {
          const { data } = response;
          // console.log(data)
          if (!listPatrimonios && data) {
            setListPatrimonios(formatModelPatrimonio(data));
          } else {
            const datosPatrimonio = formatModelPatrimonio(data);
            setListPatrimonios(datosPatrimonio)
          }
        }).catch(e => {
          console.log(e)
        })
      } catch (e) {
        console.log(e)
      }
    }, [razonSocialElegida]);

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

  return (
    <>
      <div style={{ margin: "1vw" }}>
        <div>
          <div className="card card-widget widget-user shadow">
            <div
              className="widget-user-header bg-success"
              style={{ textTransform: "capitalize" }}
            >
              <p
                className="widget-user-username homeUserName"
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                Bienvenido!!! {nombreUsuario}
              </p>
              <p className="widget-user-desc rolUser">{nombreUsuario}</p>
            </div>
            <div className="widget-user-image">
              <Image
                className="img-circle elevation-2"
                src="../dist/img/admin.png"
                alt="User Avatar"
              />
            </div>
            <div className="card-footer">
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-info">
                    <div class="inner">
                      <h3>Monto total de abonos</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listAbonos?.reduce((acc, item) => acc + item.abono, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faWallet} />
                    </div>
                  </div>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-danger">
                    <div class="inner">
                      <h3>Monto total de aportaciones</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listAportaciones?.reduce((acc, item) => acc + item.aportacion, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faDonate} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-light">
                    <div class="inner">
                      <h3>Monto total de retiros</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listRetiros?.reduce((acc, item) => acc + item.retiro, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                  </div>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-white">
                    <div class="inner">
                      <h3>Monto total de intereses</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listRendimientos?.reduce((acc, item) => acc + item.rendimiento, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faPercent} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-primary">
                    <div class="inner">
                      <h3>Monto total de prestamos</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listPrestamos?.reduce((acc, item) => acc + item.prestamoTotal, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faHandHoldingUsd} />
                    </div>
                  </div>
                </Col>
                {razonSocialElegida ===
                'Asociación de Empleados Sector Cables A.C.' && (
                <Col sm={12} md={6} lg={6}>
                  <div class="small-box bg-warning">
                    <div class="inner">
                      <h3>Monto total de patrimonios</h3>
                      <h2>
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(listPatrimonios?.reduce((acc, item) => acc + item.patrimonio, 0))} MXN
                      </h2>
                    </div>
                    <div class="icon">
                      <FontAwesomeIcon icon={faWarehouse} />
                    </div>
                  </div>
                </Col>
                )}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function formatModelAbonos(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      abono: data.abono,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

function formatModelAportaciones(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      aportacion: data.aportacion,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

function formatModelRetiros(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      retiro: data.retiro,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

function formatModelRendimientos(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      rendimiento: data.rendimiento,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

function formatModelPrestamos(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      cantidadPagos: data.cantidadPagos,
      abonoPorPago: data.abonoPorPago,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      prestamo: data.prestamo,
      prestamoTotal: data.prestamoTotal,
      tasaInteres: data.tasaInteres,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

function formatModelPatrimonio(data) {
  const dataTemp = []
  data.forEach(data => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      fichaSocio: String(data.fichaSocio),
      tipo: data.tipo,
      patrimonio: data.patrimonio,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt
    });
  });
  return dataTemp;
}

export default Dashboard
