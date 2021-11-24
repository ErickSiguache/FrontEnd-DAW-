import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import { Container, Navbar, NavDropdown, Nav, Button, Form } from 'react-bootstrap';
import '../css/Login.css';

function MenuNav(props) {

  const cookies = new Cookies();

  const cerrarSesion=()=>{
    cookies.remove('token', {path: "/"});
    cookies.remove('id_TipoUsuario', {path: "/"});
    window.location.href='./';
  }

  if(cookies.get('id_TipoUsuario') === "1"){
    return(
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/MenuAdmin"> ProyectoFinalDAW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/MenuAdmin"> Home </Nav.Link>

              <Nav.Link href="/Usuarios"> Administracion </Nav.Link>
              <NavDropdown title="Informacion General" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Clientes">Cliente</NavDropdown.Item>
                <NavDropdown.Item href="/Proveedores">Proveedores</NavDropdown.Item>
                <NavDropdown.Item href="/Categorias">Categorias</NavDropdown.Item>
                <NavDropdown.Item href="Marcas">Marcas</NavDropdown.Item>
                <NavDropdown.Item href="/Productos">Productos</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/Inventario">Inventario</Nav.Link>
              <Nav.Link to="#link">Compra</Nav.Link>
              <Nav.Link to="#link">Venta</Nav.Link>
              <Nav.Link to="#link">Reportes</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Button variant="outline-success" onClick={cerrarSesion}>  Cerrar Sesion </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }else if(cookies.get('id_TipoUsuario') === "2"){
    return(
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/Menu"> ProyectoFinalDAW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/Menu">Home</Nav.Link>
              <NavDropdown title="Informacion General" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Clientes">Cliente</NavDropdown.Item>
                <NavDropdown.Item href="/Proveedores">Proveedores</NavDropdown.Item>
                <NavDropdown.Item href="/Categorias">Categorias</NavDropdown.Item>
                <NavDropdown.Item href="/Marcas">Marcas</NavDropdown.Item>
                <NavDropdown.Item href="/Productos">Productos</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/Inventario">Inventario</Nav.Link>
              <Nav.Link href="#link">Compra</Nav.Link>
              <Nav.Link href="#link">Venta</Nav.Link>
              <Nav.Link href="#link">Reportes</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Button variant="outline-success" onClick={cerrarSesion}>  Cerrar Sesion </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }else if(!cookies.get('id_TipoUsuario')){
    return(
      <div className="Container">
        <h1></h1>
      </div>
      
    );
  }
}

export default MenuNav;