import { useState, useEffect, useMemo } from 'react';
import moment from "moment";
import 'moment/locale/es';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { Badge, Container, Button, Col, Form, Dropdown } from "react-bootstrap";
import { faPenToSquare, faTrashCan, faBars } from '@fortawesome/free-solid-svg-icons';
import DataTable from "react-data-table-component";
import EliminaRendimiento from "../EliminaRendimiento";
import ModificaRendimientos from "../ModificaRendimientos";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';

function ListRendimientos(props) {
  const { listRendimientos, history, location, setRefreshCheckLogin } = props;

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
      name: "Fecha de registro",
      sortable: false,
      center: true,
      reorder: false,
      selector: row => moment(row.fechaCreacion).format('LL')
    },
    {
      name: "Acciones",
      cell: row => {
        return (
          <>
            <Dropdown>
              <Dropdown.Toggle className="botonDropdown" id="dropdown-basic">
                <FontAwesomeIcon icon={faBars} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  bg="success"
                  className="editarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                  onClick={() => {
                    modificacionRendimientos(
                      <ModificaRendimientos
                        datos={row}
                        location={location}
                        history={history}
                        setShowModal={setShowModal}
                        setRefreshCheckLogin={setRefreshCheckLogin}
                      />
                    )
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    style={{ color: "#1A66CC" }}
                    className="text-lg"
                  />
                  &nbsp; Modificar
                </Dropdown.Item>
                <Dropdown.Item
                  bg="danger"
                  className="eliminarInformacion hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out p-2"
                  onClick={() => {
                    eliminacionRendimientos(
                      <EliminaRendimiento
                        datos={row}
                        location={location}
                        history={history}
                        setShowModal={setShowModal}
                        setRefreshCheckLogin={setRefreshCheckLogin}
                      />
                    )
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    style={{ color: "#dc3545" }}
                    className="text-lg"
                  />
                  &nbsp; Eliminar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )
      },
      sortable: false,
      center: true,
      reorder: false
    },
  ];

  // Elimina rendimientos
  const eliminacionRendimientos = (content) => {
    setTitulosModal("Eliminando interés");
    setContentModal(content);
    setShowModal(true);
  }

  const modificacionRendimientos = (content) => {
    setTitulosModal('Modificación interés')
    setContentModal(content)
    setShowModal(true)
  }


  // Definiendo estilos para data table
  // Configurando animacion de carga
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(listRendimientos);
      setPending(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de'
  };

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

  // Defino barra de busqueda
  const ClearButton = styled(Button)` 
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

  const TextField = styled.input` 
        height: 32px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;
      &:hover {
        cursor: pointer;
      }
    `;

  const filteredItems = listRendimientos.filter(
    item => filterText == "" ? item.fichaSocio.toLowerCase().includes(filterText.toLowerCase()) : item.fichaSocio == filterText
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToogle(!resetPaginationToogle);
        setFilterText('');
      }
    };

    return (
      <>
        <Col></Col>
        <Col>
          <div className="flex items-center mb-1">
            <Form.Control
              id="search"
              type="text"
              placeholder="Busqueda por ficha del socio"
              aria-label="Search Input"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
            <ClearButton
              type="button"
              variant="info"
              title="Limpiar la busqueda"
              onClick={handleClear}>
              X
            </ClearButton>
          </div>
        </Col>
        <Col></Col>
      </>
    );
  }, [filterText, resetPaginationToogle]);

  return (
    <>
      <Container fluid>
        <DataTable
          columns={columns}
          noDataComponent="No hay registros para mostrar"
          data={filteredItems}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
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

export default ListRendimientos;
