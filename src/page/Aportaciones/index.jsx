import { useState, useEffect, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import {
  getRazonSocial,
  getTokenApi,
  isExpiredToken,
  logoutApi,
} from '../../api/auth';
import { toast } from 'react-toastify';
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faSackDollar, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import BasicModal from '../../components/Modal/BasicModal';
import { listarAportacion } from '../../api/aportaciones';
import ListAportaciones from '../../components/Aportaciones/ListAportaciones';
import RegistroAportaciones from '../../components/Aportaciones/RegistroAportaciones';
import CargaMasivaAportaciones from '../../components/Aportaciones/CargaMasivaAportaciones';
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { obtenerFolioActualSaldosGlobales } from '../../api/saldosGlobales';
import EliminaAportacionMasivo from '../../components/Aportaciones/EliminaAportacionMasivo';

function Aportaciones(props) {
  const { setRefreshCheckLogin, location, history } = props

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false)
  const [contentModal, setContentModal] = useState(null)
  const [titulosModal, setTitulosModal] = useState(null)

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

  // Para almacenar el listado de aportaciones
  const [listAportaciones, setListAportaciones] = useState(null)

  useEffect(() => {
    try {
      // Inicia listado de detalles de los articulos vendidos
      listarAportacion(getRazonSocial()).then(response => {
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
  }, [location]);

  //Para el registro de Rendimientos
  const eliminaAportacionMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
  }

  // Para el registro de aportaciones
  const registroAportaciones = (content) => {
    setTitulosModal('Registrar una aportación')
    setContentModal(content)
    setShowModal(true)
  }

  const registroAportacionesCargaMasiva = (content) => {
    setTitulosModal('Carga masiva')
    setContentModal(content)
    setShowModal(true)
  }

  return (
    <>
      <Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Aportaciones</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>

              <Button
                className="btnRegistro"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaAportacionMasivo(
                    <EliminaAportacionMasivo
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} /> Eliminar por fecha
              </Button>

              <Button
                className="btnRegistro"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroAportacionesCargaMasiva(
                    <CargaMasivaAportaciones
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faSackDollar} /> Registro masivo
              </Button>

              <Button
                className="btnRegistro"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  registroAportaciones(
                    <RegistroAportaciones
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar aportación
              </Button>
            </div>
          </Col>
        </Row>
      </Alert>

      {listAportaciones ? (
        <>
          <Suspense fallback={<Spinner />}>
            <ListAportaciones
              setRefreshCheckLogin={setRefreshCheckLogin}
              listAportaciones={listAportaciones}
              history={history}
              location={location}
            />
          </Suspense>
        </>
      ) : (
        <>
          <Lottie loop={true} play={true} animationData={AnimacionLoading} />
        </>
      )}

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  )
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

export default withRouter(Aportaciones);
