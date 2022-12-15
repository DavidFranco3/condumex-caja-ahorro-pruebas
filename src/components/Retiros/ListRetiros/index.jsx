import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { Badge, Container } from "react-bootstrap";
import TableRow from '@mui/material/TableRow';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DataTable from "react-data-table-component";
import EliminaRetiros from "../EliminaRetiros";
import ModificaRetiros from "../ModificaRetiros";
import { estilos } from "../../../utils/tableStyled";
import NombreSocioEmpleado from "../../utils/NombresSocios/NombreSocioEmpleado";
import NombreSocioSindicalizado from "../../utils/NombresSocios/NombreSocioSindicalizado";

function ListRetiros(props) {
  const { listRetiros, history, location, setRefreshCheckLogin } = props;

  //console.log(listSocios)

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
      sortable: true,
      center: true,
      reorder: true
    },
    {
      name: "Ficha del socio",
      selector: row => row.fichaSocio,
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
                modificacionRetiros(
                  <ModificaRetiros
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
                eliminacionRetiros(
                  <EliminaRetiros
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

  // Elimina retiros
  const eliminacionRetiros = (content) => {
    setTitulosModal("Eliminando retiros");
    setContentModal(content);
    setShowModal(true);
  }

  const modificacionRetiros = (content) => {
    setTitulosModal("Modificación retiros");
    setContentModal(content);
    setShowModal(true);
  }


  // Definiendo estilos para data table
  // Configurando animacion de carga
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(listRetiros);
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
          data={listRetiros}
          progressPending={pending}
          paginationComponentOptions={paginationComponentOptions}
          paginationResetDefaultPage={resetPaginationToogle}
          customStyles={estilos}
          sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
          pagination
        />
      </Container>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListRetiros;
