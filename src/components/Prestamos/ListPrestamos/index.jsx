import { useState, useEffect } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong} from "@fortawesome/free-solid-svg-icons";
import { Badge, Container } from "react-bootstrap";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DataTable from "react-data-table-component";
import EliminaPrestamos from "../EliminaPrestamos";
import ModificaPrestamos from "../ModificaPrestamos";
import {estilos} from "../../../utils/tableStyled";

function ListPrestamos(props) {
    const { listPrestamos, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalPrestamos } = props;

    // Configura el idioma a español
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ficha del socio",
            selector: row => row.fichaSocio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Préstamo",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.prestamo)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Interés",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.prestamoTotal - row.prestamo)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.prestamoTotal)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de registro",
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
                  modificacionPrestamos(
                    <ModificaPrestamos
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
                  eliminacionPrestamos(
                    <EliminaPrestamos
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


      // Elimina prestamos
        const eliminacionPrestamos = (content) => {
        setTitulosModal("Eliminando préstamos");
        setContentModal(content);
        setShowModal(true);
        }

        const modificacionPrestamos = (content) => {
        setTitulosModal("Modificación prestamos");
                setContentModal(content);
                setShowModal(true);
        }


    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listPrestamos);
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
                    data={listPrestamos}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalPrestamos}
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

export default ListPrestamos;
