import { useState, useEffect, Suspense } from 'react';
import {useHistory, withRouter } from "react-router-dom";
import {Alert, Button, Col, Row, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { listarAbonos } from "../../api/abonos";
import { listarAportaciones } from "../../api/aportaciones";
import { listarPatrimonio } from "../../api/patrimonio";
import { listarPrestamos } from "../../api/prestamos";
import { listarRendimientos } from "../../api/rendimientos";
import { listarRetiros } from "../../api/retiros";
import { listarBajaSocios } from "../../api/bajaSocios";
import { listarDeudaSocio } from "../../api/deudaSocio";
import {getRazonSocial, getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";
import {exportCSVFile} from "../../utils/exportCSV";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


  return date.toISOString().slice(0, 16);
}

function RespaldosAutomaticos(props) {
    const { datos, setRefreshCheckLogin, location, history } = props;
    
    const enrutamiento = useHistory();
    
    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());
    
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
    const [listAbonos, setListAbonos] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
           listarAbonos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listAbonos && data){
                        setListAbonos(formatModelAbonos(data));
                    } else {
                        setListAbonos(formatModelAbonos(data));
                    }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);
    
    // Almacena los datos de los abonos
    const [listAportaciones, setListAportaciones] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarAportaciones(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listAportaciones && data){
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
    }, [location, formData.inicio, formData.fin]);
    
    // Almacena los datos de los abonos
    const [listPatrimonio, setListPatrimonio] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPatrimonio(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listPatrimonio && data){
                        setListPatrimonio(formatModelPatrimonio(data));
                    } else {
                        const datosPatrimonio = formatModelPatrimonio(data);
                        setListPatrimonio(datosPatrimonio)
                    }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);
    
    // Almacena los datos de los abonos
    const [listPrestamos, setListPrestamos] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarPrestamos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listPrestamos && data){
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
    }, [location, formData.inicio, formData.fin]);
    
     // Almacena los datos de los abonos
    const [listRendimientos, setListRendimientos] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarRendimientos(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listRendimientos && data){
                        setListRendimientos(formatModelRendimientos(data));
                    } else {
                        const datosRendimientos = formatModelRendimientos(data);
                        setListRendimientos(datosRendimientos)
                    }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
           console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);
    
     // Almacena los datos de los abonos
    const [listRetiros, setListRetiros] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarRetiros(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listRetiros && data){
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
    }, [location, formData.inicio, formData.fin]);
    
     // Almacena los datos de los abonos
    const [listBajaSocios, setListBajaSocios] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarBajaSocios(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listBajaSocios && data){
                        setListBajaSocios(formatModelBajaSocios(data));
                    } else {
                        const datosBajaSocios = formatModelBajaSocios(data);
                        setListBajaSocios(datosBajaSocios)
                    }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);
    
    // Almacena los datos de los abonos
    const [listDeudaSocios, setListDeudaSocios] = useState(null);  
    
    useEffect(() => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarDeudaSocio(getRazonSocial(), formData.inicio, formData.fin).then(response => {
                const { data } = response;
                // console.log(data)
                if(!listDeudaSocios && data){
                        setListDeudaSocios(formatModelDeudaSocio(data));
                    } else {
                        const datosDeudaSocios = formatModelDeudaSocio(data);
                        setListDeudaSocios(datosDeudaSocios)
                    }
            }).catch(e => {
                console.log(e)
            })
            
        } catch (e) {
            console.log(e)
        }
    }, [location, formData.inicio, formData.fin]);
    
    const generacionCSVAbonos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listAbonos, "LISTA_ABONOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVAportaciones = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listAportaciones, "LISTA_APORTACIONES")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVPatrimonios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listPatrimonio, "LISTA_PATRIMONIOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVPrestamos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listPrestamos, "LISTA_PRESTAMOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVRendimientos = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listRendimientos, "LISTA_INTERESES")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVRetiros = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listRetiros, "LISTA_RETIROS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVBajaSocios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listBajaSocios, "LISTA_BAJA_SOCIOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const generacionCSVDeudaSocios = () => {
        try {
            toast.info("Estamos empaquetando tu respaldo, espere por favor ....")
            exportCSVFile(listDeudaSocios, "LISTA_DEUDA_SOCIOS")
        } catch (e) {
            console.log(e)
        }
    }
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        }
            
            return (
                <>
<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Respaldos automaticos
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <Form onChange={onChange}>
        <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridFechaInicio">
            <Form.Label>
                    Inicio del rango: 
                </Form.Label>
                    <Form.Control
                        className="mb-3"
                        type="date"
                        defaultValue={formData.inicio}
                        placeholder="Inicio"
                        name="inicio"
                        />      
            </Form.Group>
            
            <Form.Group as={Col} controlId="formGridFechaFin">
            <Form.Label>
                    Fin del rango: 
                </Form.Label>
                    <Form.Control
                        className="mb-3"
                        type="date"
                        defaultValue={formData.fin}
                        placeholder="Fin"
                        name="fin"
                        />          
            </Form.Group>
            </Row>
            </Form>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Abonos
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
            <Button
                className="btnMasivo"
                style={{ marginRight: '10px' }}
                disabled={formData.inicio == undefined || formData.fin == undefined}
                onClick={() => {
                generacionCSVAbonos()
                }}
                >
                <FontAwesomeIcon icon={faFileExcel}/> Descargar CSV
            </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Aportaciones
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVAportaciones()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Patrimonio
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVPatrimonios()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel}/> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Prestamos
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVPrestamos()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Intereses
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVRendimientos()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Retiros
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVRetiros()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Bajas de socios
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVBajaSocios()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>

<Alert className="fondoPrincipalAlert">
    <Row>
        <Col xs={12} md={4} className="titulo">
        <h1 className="font-bold">
            Deudas de los socios
        </h1>
        </Col>
        <Col xs={6} md={8}>
        <div style={{ float: 'right' }}>
        <Button
                    className="btnMasivo"
                    style={{ marginRight: '10px' }}
                    disabled={formData.inicio == undefined || formData.fin == undefined}
                    onClick={() => {
                    generacionCSVDeudaSocios()
                    }}
                    >
                <FontAwesomeIcon icon={faFileExcel} /> Descargar CSV
              </Button>
        </div>
        </Col>
    </Row>
</Alert>
        </>
    );
}

function formatModelAbonos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            abono: data.abono.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelAportaciones(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            aportacion: data.aportacion.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelPatrimonio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            patrimonio: data.patrimonio.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelPrestamos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            prestamoTotal: data.prestamoTotal.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelRendimientos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            rendimiento: data.rendimiento.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelRetiros(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            retiro: data.retiro.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelBajaSocios(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            total: data.total.toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function formatModelDeudaSocio(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            fichaSocio: parseInt(data.fichaSocio),
            saldoActual: parseFloat(data.prestamoTotal - data.abonoTotal).toFixed(2),
            fechaCreacion: fechaToCurrentTimezone(data.createdAt)
        });
    });
    return dataTemp;
}

function initialFormData(data) {
                return {
                createdAt: ""
                }

}

export default withRouter(RespaldosAutomaticos);
