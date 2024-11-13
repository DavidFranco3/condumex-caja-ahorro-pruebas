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

function LayoutPrincipal(props) {
    const { setRefreshCheckLogin, children } = props;

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

    return (
        <>
            <Layout setRefreshCheckLogin={setRefreshCheckLogin}>
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
