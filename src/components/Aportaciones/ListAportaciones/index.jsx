import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong} from "@fortawesome/free-solid-svg-icons";
import { Badge, Container } from "react-bootstrap";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DataTable from "react-data-table-component";
import EliminaAportaciones from "../EliminaAportaciones";
import ModificaAportaciones from "../ModificaAportaciones";
import {estilos} from "../../../utils/tableStyled";
import NombreSocioEmpleado from "../../utils/NombresSocios/NombreSocioEmpleado";
import NombreSocioSindicalizado from "../../utils/NombresSocios/NombreSocioSindicalizado";

function ListAportaciones(props) {
    const { listAportaciones, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, totalAportacion } = props;

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
            name: "Aportación",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.aportacion)} MXN    
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
                  modificacionAportaciones(
                    <ModificaAportaciones
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
                  eliminacionAportaciones(
                    <EliminaAportaciones
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


      // Elimina aportaciones
        const eliminacionAportaciones = (content) => {
        setTitulosModal('Eliminando aportación')
        setContentModal(content)
        setShowModal(true)
        }

        const modificacionAportaciones = (content) => {
        setTitulosModal('Modificación aportación')
        setContentModal(content)
        setShowModal(true)
        }


    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listAportaciones);
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
                    data={listAportaciones}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={totalAportacion}
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

export default ListAportaciones;
