import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import 'moment/dist/locale/es';
import BasicModal from "../../Modal/BasicModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import TableRow from '@mui/material/TableRow';
import DataTable from "react-data-table-component";
import {estilos} from "../../../utils/tableStyled";
import NombreSocioEmpleado from "../../utils/NombresSocios/NombreSocioEmpleado";
import NombreSocioSindicalizado from "../../utils/NombresSocios/NombreSocioSindicalizado";

function ListMovimientos(props) {
    const { listMovimientos, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalMovimientos } = props;

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
            name: "Patrimonio",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.patrimonio)} MXN    
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
                        }).format(row.rendimiento)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Retiro",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.retiro)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Abono",
            selector: row => (
                    <>
                ${''}
                        {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(row.abono)} MXN    
                </>
        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Movimiento",
            selector: row => row.movimiento,
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


    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listMovimientos);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={listMovimientos}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalMovimientos}
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

export default ListMovimientos;
