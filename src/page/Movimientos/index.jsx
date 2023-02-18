import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getRazonSocial, getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../components/Modal/BasicModal";
import { totalxTipoMovimientosSaldos, listarPaginacionMovimientosSaldosxTipo, listarMovimientoSaldos } from "../../api/movimientosSaldos";
import ListMovimientos from "../../components/Movimientos/ListMovimientos";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function Movimientos(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

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

    // Para almacenar el listado de movimentos
    const [listMovimientos, setListMovimientos] = useState(null);

    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarMovimientoSaldos(getRazonSocial()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMovimientos && data) {
                    setListMovimientos(formatModelMovimientosSocio(data));
                } else {
                    const datosMovimientos = formatModelMovimientosSocio(data);
                    setListMovimientos(datosMovimientos)
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
                            Movimientos
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                    </Col>
                </Row>
            </Alert>

            {
                listMovimientos ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMovimientos
                                    listMovimientos={listMovimientos}
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

function formatModelMovimientosSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fichaSocio: String(data.fichaSocio),
            tipo: data.tipo,
            movimiento: data.movimiento,
            aportacion: data.aportacion,
            prestamo: data.prestamo,
            patrimonio: data.patrimonio,
            rendimiento: data.rendimiento,
            retiro: data.retiro,
            abono: data.abono,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Movimientos);
