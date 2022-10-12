import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
// import BasicModal from "../../Modal/BasicModal";
import { Button, Col, Form, Row, Spinner, Container, Badge, InputGroup } from "react-bootstrap";
import EliminaAjusteParametros from "../EliminaAjusteParametros";
import ModificaAjusteParametros from "../ModificaAjusteParametros";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./ListAjusteParametros.scss"
import { FormControl } from "@mui/material";
import DatePicker, { CalendarContainer, registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import { parseISO } from "date-fns";
import { actualizaParametros } from "../../../api/parametros";
import { toast } from "react-toastify";
import queryString from "query-string";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../../assets/json/loading.json";

function ListAjusteParametros (props) {
    const { setRefreshCheckLogin, listAjusteParametros, history, location, rowsPerPage, setRowsPerPage, page, setPage, totalSocios, camposHabilitados, setCamposHabilitados, razonSocialElegida } = props;

    // console.log(listAjusteParametros[0])
    const { id, tasaInteres, inicioPeriodoSyE, inicioPeriodoContabilidad, inicioPeriodoPeregrinacion, finPeriodoSyE, finPeriodoContabilidad, finPeriodoPeregrinacion, fechaEnvioEstadosCuenta, fechaAporteEmpleados, fechaAporteSindicalizados } = listAjusteParametros[0];

    registerLocale("es", es);

    // Estados para controlar las fecha de inicio y de periodos

    // Tasa de interes
    const [tasaInteresAlmacenado, setTasaInteresAlmacenado] = useState(tasaInteres);
    // Inicio de periodos
    const [inicioPeriodoSyEAlmacenado, setInicioPeriodoSyEAlmacenado] = useState(Date.parse(inicioPeriodoSyE));
    const [inicioPeriodoContabilidadAlmacenado, setInicioPeriodoContabilidadAlmacenado] = useState(Date.parse(inicioPeriodoContabilidad));
    const [inicioPeriodoPeregrinacionAlmacenado, setInicioPeriodoPeregrinacionAlmacenado] = useState(Date.parse(inicioPeriodoPeregrinacion));
    // Fin de periodos
    const [finPeriodoSyEAlmacenado, setFinPeriodoSyEAlmacenado] = useState(Date.parse(finPeriodoSyE));
    const [finPeriodoContabilidadAlmacenado, setFinPeriodoContabilidadAlmacenado] = useState(Date.parse(finPeriodoContabilidad));
    const [finPeriodoPeregrinacionAlmacenado, setFinPeriodoPeregrinacionAlmacenado] = useState(Date.parse(finPeriodoPeregrinacion));
    // Fechas de control del sistema
    const [fechaEnvioEstadoCuentaAlmacenado, setFechaEnvioEstadoCuentaAlmacenado] = useState(Date.parse(fechaEnvioEstadosCuenta));
    const [fechaAportacionesEmpleados, setFechaAportacionesEmpleados] = useState(fechaAporteEmpleados);
    const [fechaAportacionesSindicalizados, setFechaAportacionesSindicalizados] = useState(fechaAporteSindicalizados);

    moment.locale("es");

    // Date.parse()

    const contenedorFechas = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ background: "#f0f0f0" }}>
                        Seleccione la fecha
                    </div>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

    // Para cancelar la modificación
    const cancelarModificacion = () => {
        setLoading(false)
        setCamposHabilitados(true)
    }

    // Para editar la información
    const editarInformacion = () => {
        setCamposHabilitados(false)
    }

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setCamposHabilitados(true)
        setLoading(true)

        // Inicia procesamiento de fechas, para antes de guardarlas
        const inicioPeriodoSyETemp = new Date(inicioPeriodoSyEAlmacenado);
        const inicioPeriodoContabilidadTemp = new Date(inicioPeriodoContabilidadAlmacenado);
        const inicioPeriodoPeregrinacionTemp = new Date(inicioPeriodoPeregrinacionAlmacenado);
        const finPeriodoSyETemp = new Date(finPeriodoSyEAlmacenado);
        const finPeriodoContabilidadTemp = new Date(finPeriodoContabilidadAlmacenado);
        const finPeriodoPeregrinacionTemp = new Date(finPeriodoPeregrinacionAlmacenado);
        const fechaEnvioEstadosCuentaTemp = new Date(fechaEnvioEstadoCuentaAlmacenado);
        // console.log(date.toUTCString()) --- Procesamiento en UTC
        // Termina procesamiento de fechas, para antes de guadarlas

        const dataTemp = {
            tasaInteres: tasaInteresAlmacenado,
            inicioPeriodoSyE: inicioPeriodoSyEAlmacenado === Date.parse(inicioPeriodoSyE) ? inicioPeriodoSyETemp : inicioPeriodoSyEAlmacenado,
            inicioPeriodoContabilidad: inicioPeriodoContabilidadAlmacenado === Date.parse(inicioPeriodoContabilidad) ? inicioPeriodoContabilidadTemp : inicioPeriodoContabilidadAlmacenado,
            inicioPeriodoPeregrinacion: inicioPeriodoPeregrinacionAlmacenado === Date.parse(inicioPeriodoPeregrinacion) ? inicioPeriodoPeregrinacionTemp : inicioPeriodoPeregrinacionAlmacenado,
            finPeriodoSyE: finPeriodoSyEAlmacenado === Date.parse(finPeriodoSyE) ? finPeriodoSyETemp : finPeriodoSyEAlmacenado,
            finPeriodoContabilidad: finPeriodoContabilidadAlmacenado === Date.parse(finPeriodoContabilidad) ? finPeriodoContabilidadTemp : finPeriodoContabilidadAlmacenado,
            finPeriodoPeregrinacion: finPeriodoPeregrinacionAlmacenado === Date.parse(finPeriodoPeregrinacion) ? finPeriodoPeregrinacionTemp : finPeriodoPeregrinacionAlmacenado,
            fechaEnvioEstadosCuenta: fechaEnvioEstadoCuentaAlmacenado === Date.parse(fechaEnvioEstadosCuenta) ? fechaEnvioEstadosCuentaTemp : fechaEnvioEstadoCuentaAlmacenado,
            fechaAporteEmpleados: fechaAportacionesEmpleados,
            fechaAporteSindicalizados: fechaAportacionesSindicalizados
        }

        // console.log(inicioPeriodoSyEAlmacenado)

        // console.log(dataTemp)
        // console.log(id)

        // Inicia modificación de parametros
        try {
            actualizaParametros(id, dataTemp).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                setLoading(false)
                history.push({
                    search: queryString.stringify(""),
                });
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
        // Termino de modificación de parametros

    }

    // Configuracion de la animacion
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: AnimacionLoading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
            {/* Inicia estructura base para separación de razones sociales */}
            {
                razonSocialElegida === "Sin Selección" ?
                    (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )
                    :
                    (
                        razonSocialElegida === "Asociación de Empleados Sector Cables A.C." ?
                            (
                                <>
                                    {/* Inicia empleados */}
                                    <div className="datosParametros">
                                        <Form onSubmit={onSubmit}>
                                            
                                            {/* Inicio y Fin periodo sindicalizados y empleados */}
                                            <hr />
                                            <div className="sindicalizadosyEmpleados">
                                                <Badge bg="secondary" className="tituloSeccion">
                                                    <h4>
                                                        Fechas indicativas periodo
                                                    </h4>
                                                </Badge>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formGridFechaInicioPeriodoSyE">
                                                        <Form.Label>Inicio del periodo</Form.Label>
                                                        <DatePicker
                                                            locale="es"
                                                            selected={inicioPeriodoSyEAlmacenado}
                                                            onChange={(date) => { setInicioPeriodoSyEAlmacenado(date) }}
                                                            disabled={camposHabilitados}
                                                            calendarContainer={contenedorFechas}
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            todayButton="Fecha actual"
                                                        />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridFechaFinPeriodoSyE">
                                                        <Form.Label>Fin del periodo</Form.Label>
                                                        <DatePicker
                                                            locale="es"
                                                            selected={finPeriodoSyEAlmacenado}
                                                            onChange={(date) => { setFinPeriodoSyEAlmacenado(date) }}
                                                            disabled={camposHabilitados}
                                                            calendarContainer={contenedorFechas}
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            todayButton="Fecha actual"
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                            {/* Inicio y Fin periodo Contabilidad */}
                                            <hr />
                                            {/* Fecha de envio de estados de cuenta, fecha de aportaciones de empleados, Fecha de aporte de sindicalizados */}
                                            <hr />
                                            <div className="detallesFinales">
                                                <Badge bg="secondary" className="tituloSeccion">
                                                    <h4>
                                                        Fechas generales
                                                    </h4>
                                                </Badge>

                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formGridFechaEstadosCuenta">
                                                        <Form.Label>Envio de estados de cuenta</Form.Label>
                                                        <DatePicker
                                                            locale="es"
                                                            selected={fechaEnvioEstadoCuentaAlmacenado}
                                                            onChange={(date) => { setFechaEnvioEstadoCuentaAlmacenado(date) }}
                                                            disabled={camposHabilitados}
                                                            calendarContainer={contenedorFechas}
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            todayButton="Fecha actual"
                                                        />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridFechaAportacionesEmpleados">
                                                        <Form.Label>Aportaciones de empleados</Form.Label>
                                                        {/* Seleción -> Semanal, Quincenal */}
                                                        <Form.Select
                                                            name="aportacionesEmpleados"
                                                            defaultValue={fechaAportacionesEmpleados}
                                                            onChange={(e) => setFechaAportacionesEmpleados(e.target.value)}
                                                            disabled={camposHabilitados}
                                                        >
                                                            <option value="" selected>Elige....</option>
                                                            <option value="Semanal" selected={fechaAportacionesEmpleados === "Semanal"}>Semanal</option>
                                                            <option value="Quincenal" selected={fechaAportacionesEmpleados === "Quincenal"}>Quincenal</option>
                                                        </Form.Select>
                                                    </Form.Group>

                                                </Row>
                                            </div>
                                            {/* Botones */}
                                            {
                                                camposHabilitados ?
                                                    (
                                                        <>
                                                            <Form.Group as={Row} className="botones">
                                                                <Button
                                                                    onClick={() => {
                                                                        editarInformacion()
                                                                    }}
                                                                    variant="success"
                                                                    className="editaParametros"
                                                                >
                                                                    {camposHabilitados ? "Edita la información" : "Guarda los cambios"}
                                                                </Button>
                                                            </Form.Group>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <Form.Group as={Row} className="botones">
                                                                <Col>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="success"
                                                                        className="registrar"
                                                                    >
                                                                        {!loading ? "Guarda los cambios" : <Spinner animation="border" />}
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button
                                                                        variant="danger"
                                                                        className="cancelar"
                                                                        onClick={() => {
                                                                            cancelarModificacion()
                                                                        }}
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                </Col>
                                                            </Form.Group>
                                                        </>
                                                    )
                                            }
                                        </Form>
                                    </div>
                                    {/* Termina empleados*/}
                                </>
                            )
                            :
                            (
                                razonSocialElegida === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." ?
                                    (
                                        <>
                                            {/* Inicia sindicalizados */}
                                            <div className="datosParametros">
                                                <Form onSubmit={onSubmit}>
                                                    {/* Inicio y Fin periodo sindicalizados y empleados */}
                                                    <hr />
                                                    <div className="sindicalizadosyEmpleados">
                                                        <Badge bg="secondary" className="tituloSeccion">
                                                            <h4>
                                                                Fechas indicativas del periodo
                                                            </h4>
                                                        </Badge>
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridFechaInicioPeriodoSyE">
                                                                <Form.Label>Inicio del periodo</Form.Label>
                                                                <DatePicker
                                                                    locale="es"
                                                                    selected={inicioPeriodoSyEAlmacenado}
                                                                    onChange={(date) => { setInicioPeriodoSyEAlmacenado(date) }}
                                                                    disabled={camposHabilitados}
                                                                    calendarContainer={contenedorFechas}
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    todayButton="Fecha actual"
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridFechaFinPeriodoSyE">
                                                                <Form.Label>Fin del periodo</Form.Label>
                                                                <DatePicker
                                                                    locale="es"
                                                                    selected={finPeriodoSyEAlmacenado}
                                                                    onChange={(date) => { setFinPeriodoSyEAlmacenado(date) }}
                                                                    disabled={camposHabilitados}
                                                                    calendarContainer={contenedorFechas}
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    todayButton="Fecha actual"
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                    </div>
                                                    {/* Inicio y Fin periodo Contabilidad */}
                                                    <hr />
                                                    <div className="detallesFinales">
                                                        <Badge bg="secondary" className="tituloSeccion">
                                                            <h4>
                                                                Fechas generales
                                                            </h4>
                                                        </Badge>

                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridFechaEstadosCuenta">
                                                                <Form.Label>Envio de estados de cuenta</Form.Label>
                                                                <DatePicker
                                                                    locale="es"
                                                                    selected={fechaEnvioEstadoCuentaAlmacenado}
                                                                    onChange={(date) => { setFechaEnvioEstadoCuentaAlmacenado(date) }}
                                                                    disabled={camposHabilitados}
                                                                    calendarContainer={contenedorFechas}
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    todayButton="Fecha actual"
                                                                />
                                                            </Form.Group>

                                                            {/* Aportaciones de sindicalizados */}
                                                            <Form.Group as={Col} controlId="formGridFechaAportacionesSindicalizados">
                                                                <Form.Label>Aportaciones de sindicalizados</Form.Label>
                                                                <Form.Select
                                                                    name="aportacionesSindicalizados"
                                                                    defaultValue={fechaAportacionesSindicalizados}
                                                                    onChange={(e) => setFechaAportacionesSindicalizados(e.target.value)}
                                                                    disabled={camposHabilitados}
                                                                >
                                                                    <option value="" selected>Elige....</option>
                                                                    <option value="Semanal" selected={fechaAportacionesEmpleados === "Semanal"}>Semanal</option>
                                                                    <option value="Quincenal" selected={fechaAportacionesEmpleados === "Quincenal"}>Quincenal</option>
                                                                </Form.Select>
                                                            </Form.Group>

                                                        </Row>
                                                    </div>
                                                    {/* Botones */}
                                                    {
                                                        camposHabilitados ?
                                                            (
                                                                <>
                                                                    <Form.Group as={Row} className="botones">
                                                                        <Button
                                                                            onClick={() => {
                                                                                editarInformacion()
                                                                            }}
                                                                            variant="success"
                                                                            className="editaParametros"
                                                                        >
                                                                            {camposHabilitados ? "Edita la información" : "Guarda los cambios"}
                                                                        </Button>
                                                                    </Form.Group>
                                                                </>
                                                            )
                                                            :
                                                            (
                                                                <>
                                                                    <Form.Group as={Row} className="botones">
                                                                        <Col>
                                                                            <Button
                                                                                type="submit"
                                                                                variant="success"
                                                                                className="registrar"
                                                                            >
                                                                                {!loading ? "Guarda los cambios" : <Spinner animation="border" />}
                                                                            </Button>
                                                                        </Col>
                                                                        <Col>
                                                                            <Button
                                                                                variant="danger"
                                                                                className="cancelar"
                                                                                onClick={() => {
                                                                                    cancelarModificacion()
                                                                                }}
                                                                            >
                                                                                Cancelar
                                                                            </Button>
                                                                        </Col>
                                                                    </Form.Group>
                                                                </>
                                                            )
                                                    }
                                                </Form>
                                            </div>
                                            {/* Termina sindicalizados */}
                                        </>
                                    )
                                    :
                                    (
                                        razonSocialElegida === "CONDUMEX S.A. DE C.V." ?
                                            (
                                                <>
                                                    {/* Inicia especiales */}
                                                    <div className="datosParametros">
                                                        <Form onSubmit={onSubmit}>
                                                            {/* Inicio y Fin periodo Contabilidad */}
                                                            <hr />
                                                            <div className="contabilidad">
                                                                <Badge bg="secondary" className="tituloSeccion">
                                                                    <h4>
                                                                        Contabilidad
                                                                    </h4>
                                                                </Badge>

                                                                <Row className="mb-3">
                                                                    <Form.Group as={Col} controlId="formGridFechaInicioPeriodoContabilidad">
                                                                        <Form.Label>Inicio del periodo</Form.Label>
                                                                        <DatePicker
                                                                            locale="es"
                                                                            selected={inicioPeriodoContabilidadAlmacenado}
                                                                            onChange={(date) => { setInicioPeriodoContabilidadAlmacenado(date) }}
                                                                            disabled={camposHabilitados}
                                                                            calendarContainer={contenedorFechas}
                                                                            peekNextMonth
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            todayButton="Fecha actual"
                                                                        />
                                                                    </Form.Group>

                                                                    <Form.Group as={Col} controlId="formGridFechaFinPeriodoContabilidad">
                                                                        <Form.Label>Fin del periodo</Form.Label>
                                                                        <DatePicker
                                                                            locale="es"
                                                                            selected={finPeriodoContabilidadAlmacenado}
                                                                            onChange={(date) => { setFinPeriodoContabilidadAlmacenado(date) }}
                                                                            disabled={camposHabilitados}
                                                                            calendarContainer={contenedorFechas}
                                                                            peekNextMonth
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            todayButton="Fecha actual"
                                                                        />
                                                                    </Form.Group>
                                                                </Row>
                                                            </div>
                                                            {/* Inicio y Fin periodo Peregrinación */}
                                                            <hr />
                                                            <div className="peregrinacion">
                                                                <Badge bg="secondary" className="tituloSeccion">
                                                                    <h4>
                                                                        Peregrinación
                                                                    </h4>
                                                                </Badge>

                                                                <Row className="mb-3">
                                                                    <Form.Group as={Col} controlId="formGridFechaInicioPeriodoPeregrinacion">
                                                                        <Form.Label>Inicio del periodo</Form.Label>
                                                                        <DatePicker
                                                                            locale="es"
                                                                            selected={inicioPeriodoPeregrinacionAlmacenado}
                                                                            onChange={(date) => { setInicioPeriodoPeregrinacionAlmacenado(date) }}
                                                                            disabled={camposHabilitados}
                                                                            calendarContainer={contenedorFechas}
                                                                            peekNextMonth
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            todayButton="Fecha actual"
                                                                        />
                                                                    </Form.Group>

                                                                    <Form.Group as={Col} controlId="formGridFechaFinPeriodoPeregrinacion">
                                                                        <Form.Label>Fin del periodo</Form.Label>
                                                                        <DatePicker
                                                                            locale="es"
                                                                            selected={finPeriodoPeregrinacionAlmacenado}
                                                                            onChange={(date) => { setFinPeriodoPeregrinacionAlmacenado(date) }}
                                                                            disabled={camposHabilitados}
                                                                            calendarContainer={contenedorFechas}
                                                                            peekNextMonth
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            todayButton="Fecha actual"
                                                                        />
                                                                    </Form.Group>
                                                                </Row>
                                                            </div>
                                                            {/* Fecha de envio de estados de cuenta, fecha de aportaciones de empleados, Fecha de aporte de sindicalizados */}
                                                            <hr />
                                                            <div className="detallesFinales">
                                                                <Badge bg="secondary" className="tituloSeccion">
                                                                    <h4>
                                                                        Fechas generales
                                                                    </h4>
                                                                </Badge>

                                                                <Row className="mb-3">
                                                                    <Form.Group as={Col} controlId="formGridFechaEstadosCuenta">
                                                                        <Form.Label>Envio de estados de cuenta</Form.Label>
                                                                        <DatePicker
                                                                            locale="es"
                                                                            selected={fechaEnvioEstadoCuentaAlmacenado}
                                                                            onChange={(date) => { setFechaEnvioEstadoCuentaAlmacenado(date) }}
                                                                            disabled={camposHabilitados}
                                                                            calendarContainer={contenedorFechas}
                                                                            peekNextMonth
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            todayButton="Fecha actual"
                                                                        />
                                                                    </Form.Group>

                                                                    <Form.Group as={Col} controlId="formGridFechaAportacionesEmpleados">
                                                                        <Form.Label>Aportaciones de empleados</Form.Label>
                                                                        {/* Seleción -> Semanal, Quincenal */}
                                                                        <Form.Select
                                                                            name="aportacionesEmpleados"
                                                                            defaultValue={fechaAportacionesEmpleados}
                                                                            onChange={(e) => setFechaAportacionesEmpleados(e.target.value)}
                                                                            disabled={camposHabilitados}
                                                                        >
                                                                            <option value="" selected>Elige....</option>
                                                                            <option value="Semanal" selected={fechaAportacionesEmpleados === "Semanal"}>Semanal</option>
                                                                            <option value="Quincenal" selected={fechaAportacionesEmpleados === "Quincenal"}>Quincenal</option>
                                                                        </Form.Select>
                                                                    </Form.Group>

                                                                </Row>
                                                            </div>
                                                            {/* Botones */}
                                                            {
                                                                camposHabilitados ?
                                                                    (
                                                                        <>
                                                                            <Form.Group as={Row} className="botones">
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        editarInformacion()
                                                                                    }}
                                                                                    variant="success"
                                                                                    className="editaParametros"
                                                                                >
                                                                                    {camposHabilitados ? "Edita la información" : "Guarda los cambios"}
                                                                                </Button>
                                                                            </Form.Group>
                                                                        </>
                                                                    )
                                                                    :
                                                                    (
                                                                        <>
                                                                            <Form.Group as={Row} className="botones">
                                                                                <Col>
                                                                                    <Button
                                                                                        type="submit"
                                                                                        variant="success"
                                                                                        className="registrar"
                                                                                    >
                                                                                        {!loading ? "Guarda los cambios" : <Spinner animation="border" />}
                                                                                    </Button>
                                                                                </Col>
                                                                                <Col>
                                                                                    <Button
                                                                                        variant="danger"
                                                                                        className="cancelar"
                                                                                        onClick={() => {
                                                                                            cancelarModificacion()
                                                                                        }}
                                                                                    >
                                                                                        Cancelar
                                                                                    </Button>
                                                                                </Col>
                                                                            </Form.Group>
                                                                        </>
                                                                    )
                                                            }
                                                        </Form>
                                                    </div>
                                                    {/* Termina especiales */}
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <Lottie
                                                        loop={true}
                                                        play={true}
                                                        animationData={AnimacionLoading}
                                                    />
                                                </>
                                            )
                                    )
                            )
                    )
            }
            {/* Termina estructura base para separación de razones sociales */}
        </>
    );
}

function initialFormData (datos) {
    const { tasaInteres, inicioPeriodoSyE, inicioPeriodoContabilidad, inicioPeriodoPeregrinacion, finPeriodoSyE, finPeriodoContabilidad, finPeriodoPeregrinacion, fechaEnvioEstadosCuenta, fechaAporteEmpleados, fechaAporteSindicalizados } = datos;

    return {
        tasaInteres: tasaInteres,
        inicioPeriodoSyE: inicioPeriodoSyE,
        inicioPeriodoContabilidad: inicioPeriodoContabilidad,
        inicioPeriodoPeregrinacion: inicioPeriodoPeregrinacion,
        finPeriodoSyE: finPeriodoSyE,
        finPeriodoContabilidad: finPeriodoContabilidad,
        finPeriodoPeregrinacion: finPeriodoPeregrinacion,
        fechaEnvioEstadosCuenta: fechaEnvioEstadosCuenta,
        fechaAporteEmpleados: fechaAporteEmpleados,
        fechaAporteSindicalizados: fechaAporteSindicalizados
    }
}

export default ListAjusteParametros;

