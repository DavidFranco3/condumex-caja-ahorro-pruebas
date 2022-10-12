import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faEye, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionPatrimonio,
    listarPaginacionPatrimonioxTipo,
    totalPatrimonio,
    totalxTipoPatrimonio
} from "../../api/patrimonio";
import ListPatrimonios from "../../components/Patrimonio/Listar";
import RegistroPatrimonio from "../../components/Patrimonio/Registrar";
import BasicModal from "../../components/Modal/BasicModal";
import CargaMasivaPatrimonio from '../../components/Patrimonio/Cargar';
import EliminaPatrimonioMasivo from '../../components/Patrimonio/EliminaMasivo';
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function Patrimonio(props) {
    const { datos, setRefreshCheckLogin, location, history } = props;
    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalPatrimonios, setNoTotalPatrimonios] = useState(0);

    const enrutamiento = useHistory();

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

    // Para el registro de patrimonios
    const registroPatrimonio = (content) => {
        setTitulosModal("Registro un patrimonio");
        setContentModal(content);
        setShowModal(true);
    }
    
    const registroPatrimonioCargaMasiva = (content) => {
        setTitulosModal('Carga masiva')
        setContentModal(content)
        setShowModal(true)
    }
    
    //Para el registro de Rendimientos
    const eliminaPatrimonioMasivo = (content) => {
    setTitulosModal('Eliminar elementos')
    setContentModal(content)
    setShowModal(true)
    }

    // Almacena los datos de los patrimonios
    const [listPatrimonios, setListPatrimonios] = useState(null);

    useEffect(() => {
        try {
            totalxTipoPatrimonio(getRazonSocial()).then(response => {
                const { data } = response;
                setNoTotalPatrimonios(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if(page === 0) {
                setPage(1)
                listarPaginacionPatrimoniosxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listPatrimonios && data){
                        setListPatrimonios(formatModelPatrimonio(data));
                    } else {
                        const datosPatrimonios = formatModelPatrimonio(data);
                        setListPatrimonios(datosPatrimonios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionPatrimonioxTipo(page, rowsPerPage, getRazonSocial()).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listPatrimonios && data){
                        setListPatrimonios(formatModelPatrimonio(data));
                    } else {
                        const datosPatrimonios = formatModelPatrimonio(data);
                        setListPatrimonios(datosPatrimonios)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);


    return (
        <>
            <Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Patrimonio</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: 'right' }}>
            
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  eliminaPatrimonioMasivo(
                    <EliminaPatrimonioMasivo
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
                  registroPatrimonioCargaMasiva(
                    <CargaMasivaPatrimonio
                      setShowModal={setShowModal}
                      location={location}
                      history={history}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registro masivo
              </Button>
              
              <Button
                className="btnRegistro"
                onClick={() => {
                   registroPatrimonio(
                      <RegistroPatrimonio
                         setShowModal={setShowModal}
                         location={location}
                          history={history}
                          />
                  )
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar patrimonio
              </Button>
            </div>
          </Col>
        </Row>
      </Alert>

            {
                listPatrimonios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListPatrimonios
                                    listPatrimonios={listPatrimonios}
                                    history={history}
                                    location={location}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalPatrimonios={noTotalPatrimonios}
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

function formatModelPatrimonio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: parseInt(data.fichaSocio),
            tipo: data.tipo,
            patrimonio: data.patrimonio,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Patrimonio);
