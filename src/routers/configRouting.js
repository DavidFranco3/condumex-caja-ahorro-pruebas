// Importación de páginas principales
import Dashboard from '../page/Dashboard'
import Socios from '../page/Socios'
import AjusteParametros from '../page/AjusteParametros'
import Aportaciones from '../page/Aportaciones'
import Prestamos from '../page/Prestamos'
import Retiros from '../page/Retiros'
import BajaSocios from '../page/BajaSocios'
import CalculadoraInteres from '../page/CalculadoraInteres'
import Movimientos from '../page/Movimientos'
import EstadosCuenta from '../page/EstadosCuenta'
import RespaldosAutomaticos from '../page/RespaldosAutomaticos'
import Rendimientos from '../page/Rendimientos'
import Saldos from '../page/Saldos'
import Patrimonio from '../page/Patrimonio'
import Abonos from '../page/Abonos'
import DeudaSocio from '../page/DeudaSocio'

const configRouting = [
  {
    path: '/patrimonio',
    exact: true,
    page: Patrimonio,
  },
  {
    path: '/intereses',
    exact: true,
    page: Rendimientos,
  },
  {
    path: '/respaldo-informacion',
    exact: true,
    page: RespaldosAutomaticos,
  },
  {
    path: '/estados-de-cuenta',
    exact: true,
    page: EstadosCuenta,
  },
  {
    path: '/movimientos',
    exact: true,
    page: Movimientos,
  },
  {
    path: '/calculadora-de-intereses',
    exact: true,
    page: CalculadoraInteres,
  },
  {
    path: '/saldos',
    exact: true,
    page: Saldos,
  },
  {
    path: '/abonos',
    exact: true,
    page: Abonos,
  },
  {
    path: '/deudaSocio',
    exact: true,
    page: DeudaSocio,
  },
  {
    path: '/baja-de-socios',
    exact: true,
    page: BajaSocios,
  },
  {
    path: '/retiros',
    exact: true,
    page: Retiros,
  },
  {
    path: '/prestamos',
    exact: true,
    page: Prestamos,
  },
  {
    path: '/aportaciones',
    exact: true,
    page: Aportaciones,
  },
  {
    path: '/ajuste-de-parametros',
    exact: true,
    page: AjusteParametros,
  },
  {
    path: '/socios',
    exact: true,
    page: Socios,
  },
  {
    path: '/',
    exact: true,
    page: Dashboard,
    default: true,
  },
]

export default configRouting
