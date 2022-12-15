import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionDeudaSocio,
    listarPaginacionDeudaSocioxTipo,
    totalDeudaSocio,
    totalxTipoDeudaSocio,
    listarDeudasSocios
} from "../../api/deudaSocio";
import ListDeudaSocio from "../../components/DeudaSocio/ListDeudaSocio";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import EliminaDeudaSocioMasivo from '../../components/DeudaSocio/EliminaDeudaSocioMasivo';

function DeudaSocio(props) {
    const { setRefreshCheckLogin, location, history } = props;
    
    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para el registro de Rendimientos
    const eliminaDeudaSocioMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico


    // Almacena los datos de los abonos
    const [listDeudaSocio, setListDeudaSocio] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarDeudasSocios(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listDeudaSocio && data) {
                    setListDeudaSocio(formatModelDeudaSocio(data));
                } else {
                    const datosDeudaSocio = formatModelDeudaSocio(data);
                    setListDeudaSocio(datosDeudaSocio)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);
    
    //console.log(listAbonos);
    
    return (
        <>
<Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Deudas de socios</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaDeudaSocioMasivo(
                    <EliminaDeudaSocioMasivo
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} /> Eliminar por fecha
              </Button>
            
            </div>
          </Col>
        </Row>
      </Alert>

            {
                listDeudaSocio ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListDeudaSocio
                                    listDeudaSocio={listDeudaSocio}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                        <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelDeudaSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            abonoTotal: data.abonoTotal,
            prestamoTotal: data.prestamoTotal,
            saldoActual: parseFloat(data.prestamoTotal - data.abonoTotal),
            movimiento: data.movimiento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(DeudaSocio);
