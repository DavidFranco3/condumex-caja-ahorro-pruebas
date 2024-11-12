import { useState, useEffect, Fragment } from 'react';
import {
    getRazonSocial,
    getTokenApi,
    isExpiredToken,
    logoutApi,
    obtenidusuarioLogueado,
    setRazonSocial
} from "../../api/auth";
import {
    useNavigate
} from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import LogoCajadeAhorro from "../../assets/png/caja-de-ahorro.png"
import ImagenPerfil from "../../assets/png/user-avatar.png"
import { Button, Row, Container, Form } from "react-bootstrap";
import "./LayoutPrincipal.scss"
import Layout from '../adminLTE/Layout';

function LayoutPrincipal (props) {
    const { setRefreshCheckLogin, children } = props;

    const redirecciona = useNavigate();

    //Para cerrar la sesion
    const cerrarSesion = () => {
        toast.success("Sesión cerrada");
        redirecciona("")
        logoutApi();
        setRefreshCheckLogin(true);
    }

    // Para almacenar en localstorage la razon social
    const almacenaRazonSocial = (razonSocial) => {
        if (razonSocial === "Asociación de Empleados Sector Cables A.C." || razonSocial === "Asociación de Trabajadores Sindicalizados en Telecomunicaciones A.C." || razonSocial === "CONDUMEX S.A. DE C.V.") {
            setRazonSocial(razonSocial)
        }
        window.location.reload()
    }

    // Almacena la razón social, si ya fue elegida
    const [razonSocialElegida, setRazonSocialElegida] = useState("");

    useEffect(() => {
        if (getRazonSocial()) {
            setRazonSocialElegida(getRazonSocial)
        }
    }, []);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para ir hacia el inicio
    const enrutaInicio = () => {
        redirecciona("/")
    }

    return (
        <>
        <Layout>
            {/* codigo de la barra */}
            <Container fluid>
                <Row>
                    {children}
                </Row>
            </Container>
            </Layout>
        </>
    );
}

export default LayoutPrincipal;
