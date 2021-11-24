import React from 'react';
import Cookies from 'universal-cookie';
import { Container, Navbar, NavDropdown, Nav, Button, Form, Row } from 'react-bootstrap';
import '../css/General.css';

function MenuAdmin(props) {

    const cookies = new Cookies();

    if(cookies.get('id_TipoUsuario') === "1"){
        return(
            <Container>
                <Row className="justify-content-md-center MargenForm">
                <Form>
                    <h1 className="wed"> Proyecto Final de la materia Desarrollo de Apliciones Web (DAW) </h1>
                    <h2 className="wed"> Usuario: Administrador </h2>
                </Form>
                </Row>
            </Container>
            
        );
    }else if(cookies.get('id_TipoUsuario') === "2"){
        window.location.href = "./Menu";
    }else if(!cookies.get('id_TipoUsuario')){
        window.location.href = "./";
    }
}

export default MenuAdmin;