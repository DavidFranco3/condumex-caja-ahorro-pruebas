import { useState } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { TablePagination } from '@mui/material'
import './BusquedaSocios.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import {
  obtenerDatosSocioEmpleado,
  obtenerEmpleadosPorNombre,
} from '../../../api/sociosEmpleados'
import {
  obtenerDatosSocioSindicalizado,
  obtenerSociosSindicalizadosByNombre,
} from '../../../api/sociosSindicalizados'
import {
  obtenerDatosSocioEspecial,
  obtenerSociosEspecialesByNombre,
} from '../../../api/sociosEspeciales'
import { getRazonSocial } from '../../../api/auth'

function BusquedaSocios(props) {
  const {
    setShowModal,
    setFichaSocioElegido,
    setNombreSocioElegido,
    setIdSocioElegido,
    setCorreoSocioElegido,
  } = props

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(1)

  // Para controlar la animación
  const [loading, setLoading] = useState(false)

  // Para almacenar los datos de la busqueda
  const [formData, setFormData] = useState(initialFormValue())

  // Almacenar el listado de socios encontrados
  const [listSociosEncontrados, setListSociosEncontrados] = useState(null)

  // Para cancelar la búsqueda
  const cancelarBusqueda = () => {
    setShowModal(false)
  }

  // Para la manipulación de la paginación si es necesario
  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  // Para eliminar los datos del socio encontrado
  const eliminaDatosBusqueda = () => {
    setListSociosEncontrados(null)
    setFichaSocioElegido('')
    setNombreSocioElegido('')
  }

  // Gestionar el socio seleccionado
  const socioSeleccionado = ({ id, ficha, nombre, correo }) => {
    // Almacena id, ficha y nombre del socio elegido
    setIdSocioElegido(id)
    setFichaSocioElegido(ficha)
    setNombreSocioElegido(nombre)

    setCorreoSocioElegido && setCorreoSocioElegido(correo)

    setListSociosEncontrados(null)
    cancelarBusqueda()
  }

  // Validar listado de socios encontrados
  const validarListadoSocios = (listSocios) => {
    if (listSocios.length === 0) {
      toast.error('No se encontraron socios con los datos ingresados')
    }
    setListSociosEncontrados(formatModelSocios(listSocios))
  }

  // Obtener empleado por ficha
  const obtenerEmpleadoPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioEmpleado(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener empleado por nombre
  const obtenerEmpleadoPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerEmpleadosPorNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener sindicalizado por ficha
  const obtenerSindicalizadoPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioSindicalizado(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener sindicalizado por nombre
  const obtenerSindicalizadoPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerSociosSindicalizadosByNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener especial por ficha
  const obtenerEspecialPorFicha = async (ficha) => {
    try {
      setLoading(true)
      const { data } = await obtenerDatosSocioEspecial(ficha)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  // Obtener especial por nombre
  const obtenerEspecialPorNombre = async (nombre) => {
    try {
      setLoading(true)
      const { data } = await obtenerSociosEspecialesByNombre(nombre)

      validarListadoSocios(data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  const loadListadoEmpleados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
      setLoading(false)
    } else if (tipo === 'ficha') {
      obtenerEmpleadoPorFicha(ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerEmpleadoPorNombre(nombre)
    }
  }

  const loadListadoSindicalizados = () => {
    const { nombre, tipo, ficha } = formData

    // Busqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
    } else if (tipo === 'ficha') {
      obtenerSindicalizadoPorFicha(formData.ficha)
    }

    // Busqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerSindicalizadoPorNombre(nombre)
    }
  }

  const loadListadoEspeciales = () => {
    const { nombre, tipo, ficha } = formData

    // Búsqueda por ficha
    if (tipo === 'ficha' && ficha === '') {
      toast.warning('Debe especificar la ficha del socio')
    } else if (tipo === 'ficha') {
      obtenerEspecialPorFicha(ficha)
    }

    // Búsqueda por nombre
    if (tipo === 'nombre' && nombre === '') {
      toast.warning('Debe especificar el nombre del socio')
    } else if (tipo === 'nombre') {
      obtenerEspecialPorNombre(nombre)
    }
  }

  // Busqueda y Gestión del socio encontrado
  const onSubmit = (evt) => {
    evt.preventDefault()
    setLoading(true)

    // Si son empleados
    if (getRazonSocial() === 'Asociación de Empleados Sector Cables A.C.') {
      loadListadoEmpleados()
    }

    // Si son sindicalizados
    if (
      getRazonSocial() ===
      'Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C.'
    ) {
      loadListadoSindicalizados()
    }

    // Si son especiales, contabilidad y peregrinación
    if (getRazonSocial() === 'CONDUMEX S.A. DE C.V.') {
      loadListadoEspeciales()
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function labelDisplayRows({ _from, to, count }) {
    return `Visualizando ${to} de ${
      count !== -1 ? count + ' Registros' : `more than ${to}`
    }`
  }

  return (
    <>
      {listSociosEncontrados ? (
        <>
          <div className="listadoSociosEncontrados">
            <Row>
              <h3>Socios encontrados</h3>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky collapsible table dense">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">#</TableCell>
                      <TableCell align="center">Ficha</TableCell>
                      <TableCell align="center">Nombre</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                      <TableCell align="center">Estado</TableCell>
                      <TableCell align="center">Seleccionar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listSociosEncontrados.map((dato, index) => (
                      <TableRow
                        sx={{ '& > *': { borderBottom: 'unset' } }}
                        key={dato.ficha}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">{dato.ficha}</TableCell>
                        <TableCell align="center">{dato.nombre}</TableCell>
                        <TableCell align="center">{dato.tipo}</TableCell>
                        <TableCell align="center">{dato.estado}</TableCell>
                        <TableCell align="center">
                          <FontAwesomeIcon
                            className="eleccionSocio"
                            icon={faCircleCheck}
                            onClick={() => {
                              socioSeleccionado(dato)
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={listSociosEncontrados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={labelDisplayRows}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Row>
            <Row>
              <Button
                variant="danger"
                className="BuscarOtraVez"
                onClick={() => {
                  eliminaDatosBusqueda()
                }}
              >
                Realizar otra búsqueda
              </Button>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div className="contenidoFormularioPrincipal">
            <Form onChange={onChange} onSubmit={onSubmit}>
              {/* Selección de información */}
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="formHorizontaltipo"
                  className="tipo"
                >
                  <Form.Label>¿Como desea buscar al socio?</Form.Label>
                  <Col>
                    <Form.Select name="tipo" defaultValue={formData.tipo}>
                      <option value="" selected>
                        Elige....
                      </option>
                      <option value="ficha">Por ficha</option>
                      <option value="nombre">Por nombre</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Row>

              {/* Ficha o Nombre */}
              <Row className="mb-3">
                <div className="datosBusqueda">
                  {formData.tipo === 'ficha' && (
                    <>
                      <Form.Group as={Col} controlId="formGridFicha">
                        <Form.Label>Ficha</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="Escribe la ficha"
                          autoComplete="off"
                          name="ficha"
                          defaultValue={formData.ficha}
                        />
                      </Form.Group>
                    </>
                  )}
                  {formData.tipo === 'nombre' && (
                    <>
                      <Form.Group as={Col} controlId="formGridFicha">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Escribe el nombre"
                          autoComplete="off"
                          name="nombre"
                          defaultValue={formData.nombre}
                        />
                      </Form.Group>
                    </>
                  )}
                </div>
              </Row>

              <Form.Group as={Row} className="botonesBusqueda">
                <Col>
                  <Button
                    type="submit"
                    variant="success"
                    className="busqueda"
                    disabled={loading}
                  >
                    {!loading ? 'Buscar' : <Spinner animation="border" />}
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    className="cancelarBusqueda"
                    disabled={loading}
                    onClick={() => {
                      cancelarBusqueda()
                    }}
                  >
                    Cancelar
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </>
      )}
    </>
  )
}

function formatModelSocios(data) {
  return data.map(
    ({
      _id: id,
      ficha,
      nombre,
      tipo,
      correo,
      estado,
      createdAt: fechaCreacion,
      updatedAt: fechaActualizacion,
    }) => ({
      id,
      ficha: parseInt(ficha),
      nombre,
      tipo,
      correo: correo || 'No especificado',
      estado: estado === 'true' ? 'Activo' : 'Inactivo',
      fechaCreacion,
      fechaActualizacion,
    })
  )
}

function initialFormValue() {
  return {
    nombre: '',
    tipo: '',
    ficha: '',
  }
}

export default BusquedaSocios
