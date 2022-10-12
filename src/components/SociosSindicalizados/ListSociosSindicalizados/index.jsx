import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong} from "@fortawesome/free-solid-svg-icons";
import { Badge, Container } from "react-bootstrap";
import TableRow from '@mui/material/TableRow';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DataTable from "react-data-table-component";
import ModificaEstadoSocioSindicalizado from "../ModificaEstadoSocioSindicalizado";
import ModificaSociosSindicalizados from "../ModificaSociosSindicalizados";
import EliminaSocioSindicalizado from "../EliminaSocioSindicalizado";
import {estilos} from "../../../utils/tableStyled";

function ListSociosSindicalizados(props) {
    const { CSV, listSocios, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, totalSocios } = props;

    //console.log(listSocios)

    // Configura el idioma a español
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Campos de las columnas
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);

        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                </TableRow>
            </>
        );
    }
    //

    const columns = [
        {
            name: "Ficha",
            selector: row => row.ficha,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo de socio",
            selector: row => row.tipo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => (
                <>
                    {
                        row.estado === "Activo" ?
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        className="editaEstado"
                                        onClick={() => {
                                            cambiaEstadoSocio(
                                                <ModificaEstadoSocioSindicalizado
                                                    datos={row}
                                                    setShowModal={setShowModal}
                                                    history={history}
                                                    location={location}
                                                />
                                            )
                                        }}
                                    >
                                        Habilitado
                                    </Badge>
                                </>
                            )
                            :
                            (
                                <>
                                    <Badge
                                        bg="danger"
                                        className="editaEstado"
                                        onClick={() => {
                                            cambiaEstadoSocio(
                                                <ModificaEstadoSocioSindicalizado
                                                    datos={row}
                                                    setShowModal={setShowModal}
                                                    history={history}
                                                    location={location}
                                                />
                                            )
                                        }}
                                    >
                                        Deshabilitado
                                    </Badge>
                                    
                                </>
                            )
                    }
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Correo",
            selector: row => row.correo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de afiliación",
            sortable: false,
            center: true,
            reorder: false,
            selector: row => moment(row.fechaCreacion).format('LL')
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                   <div className="flex justify-end items-center space-x-4">
                    <Badge
                bg="success"
                className="editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                onClick={() => {
                  modificacionSocio(
                    <ModificaSociosSindicalizados
                      datos={row}
                      location={location}
                      history={history}
                      setShowModal={setShowModal}
                      setRefreshCheckLogin={setRefreshCheckLogin}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
              </Badge>
                    <Badge
                bg="danger"
                className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                onClick={() => {
                  eliminacionSocio(
                    <EliminaSocioSindicalizado
                      datos={row}
                      location={location}
                      history={history}
                      setShowModal={setShowModal}
                      setRefreshCheckLogin={setRefreshCheckLogin}
                    />
                  )
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
              </Badge>
              </div>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };


    // Eliminar socios
    const eliminacionSocio = (content) => {
        setTitulosModal("Eliminando socio");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionSocio = (content) => {
        setTitulosModal("Modificación socio");
        setContentModal(content);
        setShowModal(true);
    }

    // Cambiar estado del socio
    const cambiaEstadoSocio = (content) => {
        setTitulosModal("Actualizando estado");
        setContentModal(content);
        setShowModal(true);
    }

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listSocios);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={listSocios}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={totalSocios}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListSociosSindicalizados;
