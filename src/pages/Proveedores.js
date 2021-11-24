import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Button, Form, Row, Table, Modal, ModalBody, ModalFooter, Col } from 'react-bootstrap';
import axios from 'axios';

function Proveedores(props) {

    const getUrl="https://localhost:44362/api/proveedor";
    const cookies = new Cookies();

    ///Estados
    ///Estado de guardado en memoria de JSON
    const [data, setData] = useState([]);
    const [modificar, setShow] = useState(false);
    const [borrar, setborrar] = useState(false);

    ///Metodos dle modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseBorrar = () => setborrar(false);
    const handleShowBorra = () => setborrar(true);

    ///Guardado de lista en formato JSON para insertar, editar y eliminar
    const [gestorSeleccionado, setGestorSeleccionado]=useState({
        id_Proveedor: '0',
        prov_Nombre: '',
        prov_Telefono: '',
        prov_Direccion: '',
        e_Mail: '',
        nRegistro: '',
        fechaCreacion: '2021-11-04T21:04:33.45',
        fechaModificacion: '2021-11-04T21:04:33.45'
    })

    ///Toma de datos en tiempo real
    const handleChange=e=>{
        const {name, value}=e.target;
        setGestorSeleccionado({
            ...gestorSeleccionado,
            [name]: value
        });
        console.log(gestorSeleccionado);
    }

    ///Metodo de consulta de datos en general
    const consultarDatos=async()=>{
        axios.get(getUrl)
        .then(response => {
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        consultarDatos();
    }, [])


    ///Seleccionar datos
    const seleccionarDato=(proveedores)=>{
        setGestorSeleccionado(proveedores);
        handleShow()
    }

    const seleccionarDatoElim=(proveedores)=>{
        setGestorSeleccionado(proveedores);
        handleShowBorra()
    }

    ///Cancelar JSON
    const limpiar=async()=>{
        setGestorSeleccionado({
            id_Proveedor: '0',
            prov_Nombre: '',
            prov_Telefono: '',
            prov_Direccion: '',
            e_Mail: '',
            nRegistro: '',
            fechaCreacion: '2021-11-04T21:04:33.45',
            fechaModificacion: '2021-11-04T21:04:33.45'
        })
    }

    ///Salir del Modal
    const salirModal=async()=>{
        limpiar();
        handleClose();
    }

    const salirModalElim=async()=>{
        limpiar();
        handleCloseBorrar();
    }

    ///Insertar datos
    const insertar=async()=>{
        axios({
            method: "POST",
            url: getUrl,
            data: gestorSeleccionado,
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response=>{
            if(response.data === "El dato ingresado ya existe"){
                alert("Uno de los ingresado ya existe por favor escriba una nuevo");
            }else if(response.data === "No puede dejar campos vacío"){
                alert("No puede dejar los campos vacios");
            }
            else{
                setData(data.concat(response.data));
                limpiar();
                consultarDatos();
            }
        }).catch(error=>{
            console.log(error);
        })
    }

    ///Editar
    const editar=async()=>{
        axios({
            method: "PUT",
            url: getUrl,
            data: gestorSeleccionado,
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response=>{
            if(response.data === "Uno de los datos ingresados ya existe en la base de datos"){
                alert("Uno de los datos ingresados ya existe por favor escriba una nueva");
                consultarDatos();
            }else{
                setData(data.concat(response.data));
                handleClose();
                limpiar();
                consultarDatos();
            }
        }).catch(error=>{
            console.log(error);
        })
    }

    ///Eliminar
    const eliminar=async()=>{
        gestorSeleccionado.id_Proveedor = parseInt(gestorSeleccionado.id_Proveedor);
        axios.delete(getUrl+"/"+gestorSeleccionado.id_Proveedor).then(response=>{
            if(response.data === "El proveedor ha sido eliminado correctamente"){
                alert("El proveedor se ha eliminado correctamente");
                setData(data.filter(gestorSeleccionado => gestorSeleccionado.id_Proveedor !== response.data))
                handleCloseBorrar();
                limpiar();
                consultarDatos();
            }else{
                alert("Ha ocurrido un error");
                handleCloseBorrar();
                limpiar();
                consultarDatos();
            }
            
        }).catch(error=>{
            console.log(error);
        })
    }


    if(!cookies.get('id_TipoUsuario') && !cookies.get('token')){
        window.location.href = "./";
    }else {
        return(
            <Container>
                <Row className="justify-content-md-center MargenForm">
                    <form>
                        <h2 className="wed"> Proveedores </h2><br/>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Nombre: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba el nombre del proveedor"
                                    name="prov_Nombre"
                                    id="prov_Nombre"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                            <Form.Label column sm="1"> Telefono: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0000-0000"
                                    name="prov_Telefono"
                                    id="prov_Telefono"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Direccion: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba su direccion"
                                    name="prov_Direccion"
                                    id="prov_Direccion"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                            <Form.Label column sm="1"> Correo: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: nombredelcorreo@gmail.com"
                                    name="e_Mail"
                                    id="e_Mail"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Nº de Registro: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba el numero de registro"
                                    name="nRegistro"
                                    id="nRegistro"
                                    onChange={handleChange}
                                    required
                                /> <br /><br/>
                            </Col>
                        </Form.Group>
                        <Button variant="btn btn-primary" type="submit" onClick={()=>insertar()}>
                            Insertar
                        </Button>{' '}
                        <Button variant="btn btn-danger" type="submit" onClick={()=>limpiar()}>
                            Cancelar
                        </Button>
                    </form>
                </Row>
                <Table responsive>
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nombre </th>
                            <th> Telefono </th>
                            <th> Direccion </th>
                            <th> Correo </th>
                            <th> Nº de Registro </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(proveedores =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {proveedores.id_Proveedor} </th>
                                            <th> {proveedores.prov_Nombre} </th>
                                            <th> {proveedores.prov_Telefono} </th>
                                            <th> {proveedores.prov_Direccion} </th>
                                            <th> {proveedores.e_Mail} </th>
                                            <th> {proveedores.nRegistro} </th>
                                            <th> {proveedores.fechaCreacion} </th>
                                            <th> {proveedores.fechaModificacion} </th>
                                            <th> <Button variant="outline-success" onClick={()=>seleccionarDato(proveedores)}> Editar </Button></th>
                                            <th> <button className="btn btn-danger" onClick={()=>seleccionarDatoElim(proveedores)}> Eliminar </button></th>
                                        </tr>
                                    </>
                                )
                            })}
                    </tbody>
                </Table>
                <Modal show={modificar} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title> Modificando Categoria </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Proveedor"
                                    id="id_Proveedor"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Proveedor}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del proveedor"
                                    name="prov_Nombre"
                                    id="prov_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.prov_Nombre}
                                    required
                                /> <br />
                                <Form.Label> Telefono </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0000-0000"
                                    name="prov_Telefono"
                                    id="prov_Telefono"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.prov_Telefono}
                                    required
                                /> <br />
                                <Form.Label> Direccion </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Direccion"
                                    name="prov_Direccion"
                                    id="prov_Direccion"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.prov_Direccion }
                                    required
                                /> <br />
                                <Form.Label> Correo </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: nombredelcorreo@gmail.com"
                                    name="e_Mail"
                                    id="e_Mail"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.e_Mail }
                                    required
                                /> <br />
                                <Form.Label> Nº de Registro </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="00000-0"
                                    name="nRegistro"
                                    id="nRegistro"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.nRegistro}
                                    required
                                /> <br />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>salirModal()}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={()=>editar()}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={borrar} onHide={handleCloseBorrar}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        Estas seguro que quieres eliminar la categoria de:
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Proveedor"
                                    id="id_Proveedor"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Proveedor}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del proveedor"
                                    name="prov_Nombre"
                                    id="prov_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.prov_Nombre}
                                    readOnly
                                    required
                                /> <br />
                                <Form.Label> Nº de Registro </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del proveedor"
                                    name="nRegistro"
                                    id="nRegistro"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.nRegistro}
                                    readOnly
                                    required
                                /> <br />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>eliminar()}>
                            Si
                        </Button>
                        <Button variant="primary" onClick={()=>salirModalElim()}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
    
}

export default Proveedores;