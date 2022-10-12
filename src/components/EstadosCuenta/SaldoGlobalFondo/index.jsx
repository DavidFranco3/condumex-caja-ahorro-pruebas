import { useState, useEffect } from 'react';
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon, CurrencyDollarIcon, ReceiptTaxIcon, TrendingUpIcon } from '@heroicons/react/outline'
import {listarSaldosGlobales} from "../../../api/saldosGlobales";
import Lottie from "react-lottie-player"
import AnimacionLoading from "../../../assets/json/loading.json";
import {toast} from "react-toastify";

function SaldoGlobalFondo(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Almacena los valores de los saldos globales
    const [listSaldosGlobales, setListSaldosGlobales] = useState(null);

    useEffect(() => {
        try {
            listarSaldosGlobales().then(response => {
                const { data } = response;
                // console.log(data)
                if(!listSaldosGlobales && data){
                    setListSaldosGlobales(formatModelSaldosGlobales(data));
                } else {
                    const datosSaldosGlobales = formatModelSaldosGlobales(data);
                    setListSaldosGlobales(datosSaldosGlobales)
                }
            }).catch(e => {
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
                // console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Configuracion de la animacion
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: AnimacionLoading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const features = [
        {
            name: "Total Aportaciones",
            description: (
                <>
                    {
                        listSaldosGlobales ?
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt(listSaldosGlobales[0].totalAportaciones) )} MXN
                                </>
                            )
                            :
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt("0") )} MXN
                                </>
                            )
                    }
                </>
            ),
            icon: CurrencyDollarIcon,
        },
        {
            name: "Interes Ganado",
            description: (
                <>
                    {
                        listSaldosGlobales ?
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt(listSaldosGlobales[0].interesGenerado))} MXN
                                </>
                            )
                            :
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt("0"))} MXN
                                </>
                            )
                    }
                </>
            ),
            icon: TrendingUpIcon,
        },
        {
            name: "Deuda Total",
            description: (
                <>
                    {
                        listSaldosGlobales ?
                            (
                                <>
                                    $ - {new Intl.NumberFormat('es-MX').format(parseInt(listSaldosGlobales[0].deudaTotal))} MXN
                                </>
                            )
                            :
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt("0"))} MXN
                                </>
                            )
                    }
                </>
            ),
            icon: LightningBoltIcon,
        },
        {
            name: "Saldo Final",
            description: (
                <>
                    {
                        listSaldosGlobales ?
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt(listSaldosGlobales[0].saldoFinal))} MXN
                                </>
                            )
                            :
                            (
                                <>
                                    $ {new Intl.NumberFormat('es-MX').format(parseInt("0"))} MXN
                                </>
                            )
                    }
                </>
            ),
            icon: TrendingUpIcon,
        },
    ]

    return (
        <>
            {/* Condumex */}
            {/* Total aportaciones */}
            {/* Interes ganado */}
            {/* Deuda total */}

            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Saldos globales</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            CAJA DE AHORRO
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            EXCELENCIA &middot; INNOVACIÓN &middot; GARANTÍA &middot; CALIDAD
                        </p>
                    </div>

                    {
                        listSaldosGlobales ?
                            (
                                <>
                                    <div className="mt-10">
                                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                            {features.map((feature) => (
                                                <div key={feature.name} className="relative">
                                                    <dt>
                                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                                        </div>
                                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                                    </dt>
                                                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
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
                    }
                </div>
            </div>
        </>
    );
}

function formatModelSaldosGlobales(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            totalAportaciones: data.totalAportaciones,
            interesGenerado: data.interesGenerado,
            deudaTotal: data.deudaTotal,
            saldoFinal: data.saldoFinal,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default SaldoGlobalFondo;
