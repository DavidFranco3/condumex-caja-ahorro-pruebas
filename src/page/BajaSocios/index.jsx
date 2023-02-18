import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import {
    listarPaginacionBajaSocios,
    listarPaginacionBajaSociosxTipo,
    totalBajaSocios,
    totalxTipoBajaSocios,
    listarBajaSocio
} from "../../api/bajaSocios";
import ListBajaSocios from "../../components/BajaSocios/ListBajaSocios";
import RegistroBajaSocios from "../../components/BajaSocios/RegistroBajaSocios";
import BasicModal from "../../components/Modal/BasicModal";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function BajaSocios(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro manual de baja de socios
    const registroSocios = (content) => {
        setTitulosModal("Registrar una baja");
        setContentModal(content);
        setShowModal(true);
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar el listado de bajas de socios
    const [listBajasSocios, setListBajasSocios] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarBajaSocio(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listBajasSocios && data) {
                    setListBajasSocios(formatModelBajaSocios(data));
                } else {
                    const datosBajas = formatModelBajaSocios(data);
                    setListBajasSocios(datosBajas)
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);


    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={8} className="titulo">
                        <h1 className="font-bold">
                            Baja de socios
                        </h1>
                    </Col>

                    <Col xs={6} md={4}>
                        <Col align="right">
                            <Button
                                className="btnRegistro"
                                onClick={() => {
                                    registroSocios(
                                        <RegistroBajaSocios
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar una baja de socios
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Alert>

            {
                listBajasSocios ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListBajaSocios
                                    listBajasSocios={listBajasSocios}
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

function formatModelBajaSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            total: data.total,
            aportacion: data.aportacion,
            rendimiento: data.rendimiento,
            patrimonio: data.patrimonio,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BajaSocios);
