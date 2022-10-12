import { getRazonSocial, getTokenApi, obtenidusuarioLogueado } from "../../../api/auth";
import { registraPatrimonio, 
    obtenerFolioActualPatrimonio, 
} from "../../../api/patrimonio";
import { toast } from "react-toastify";

// Realiza el registro inicial de saldos de socios
export function registroPatrimonioInicial (
        fichaSocio,
        patrimonio,
        fecha
        ) {
    try {
        obtenerFolioActualPatrimonio().then(response => {
            const { data } = response;
            const { folio } = data;

            const dataTemp = {
                folio: folio,
                fichaSocio: fichaSocio,
                tipo: getRazonSocial(),
                patrimonio: patrimonio,
                createdAt: fecha,
            }

            registraPatrimonio(dataTemp).then(response => {
                const { data } = response;
            }).catch(e => {
                console.log(e)
            })

        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        // console.log(e)
    }
}
