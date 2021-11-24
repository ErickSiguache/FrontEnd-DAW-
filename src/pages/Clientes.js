import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Button, Form, Row, Table, Modal, ModalBody, ModalFooter, Col } from 'react-bootstrap';
import axios from 'axios';

function Clientes(props) {

    const getUrl="https://localhost:44362/api/cliente";
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
        id_Cliente: '0',
        clie_Nombre: '',
        clie_Apellido: '',
        telefono: '',
        clie_DUI: '',
        referencia: '',
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
    const seleccionarDato=(cliente)=>{
        setGestorSeleccionado(cliente);
        handleShow()
    }

    const seleccionarDatoElim=(cliente)=>{
        setGestorSeleccionado(cliente);
        handleShowBorra()
    }

    ///Cancelar JSON
    const limpiar=async()=>{
        setGestorSeleccionado({
            id_Cliente: '0',
            clie_Nombre: '',
            clie_Apellido: '',
            telefono: '',
            clie_DUI: '',
            referencia: '',
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
            }else if(response.data === "No puede insertar datos vacío"){
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
        gestorSeleccionado.id_Cliente = parseInt(gestorSeleccionado.id_Cliente);
        axios.delete(getUrl+"/"+gestorSeleccionado.id_Cliente).then(response=>{
            if(response.data === "El cliente ha sido eliminado correctamente"){
                alert("El Cliente se ha eliminado correctamente");
                setData(data.filter(gestorSeleccionado => gestorSeleccionado.id_Cliente !== response.data))
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
                        <h2 className="wed"> Clientes </h2><br/>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Nombre: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba su nombre"
                                    name="clie_Nombre"
                                    id="clie_Nombre"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                            <Form.Label column sm="1"> Apellido: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba su apellido"
                                    name="clie_Apellido"
                                    id="clie_Apellido"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Telefono: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0000-0000"
                                    name="telefono"
                                    id="telefono"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                            <Form.Label column sm="1"> DUI: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="00000000-0"
                                    name="clie_DUI"
                                    id="clie_DUI"
                                    required
                                    onChange={handleChange}
                                /> <br />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column sm="1"> Referencias: </Form.Label>
                            <Col sm="5">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escriba las referencias"
                                    name="referencia"
                                    id="referencia"
                                    onChange={handleChange}
                                /> <br />
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
                            <th> Apellido </th>
                            <th> Telefono </th>
                            <th> DUI </th>
                            <th> Referencias </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(cliente =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {cliente.id_Cliente} </th>
                                            <th> {cliente.clie_Nombre} </th>
                                            <th> {cliente.clie_Apellido} </th>
                                            <th> {cliente.telefono} </th>
                                            <th> {cliente.clie_DUI} </th>
                                            <th> {cliente.referencia} </th>
                                            <th> {cliente.fechaCreacion} </th>
                                            <th> {cliente.fechaModificacion} </th>
                                            <th> <Button variant="outline-success" onClick={()=>seleccionarDato(cliente)}> Editar </Button></th>
                                            <th> <button className="btn btn-danger" onClick={()=>seleccionarDatoElim(cliente)}> Eliminar </button></th>
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
                                    placeholder="Nombre de la Categoria"
                                    name="id_Cliente"
                                    id="id_Cliente"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Cliente}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    name="clie_Nombre"
                                    id="clie_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.clie_Nombre}
                                    required
                                /> <br />
                                <Form.Label> Apellido </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Apellido"
                                    name="clie_Apellido"
                                    id="clie_Apellido"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.clie_Apellido}
                                    required
                                /> <br />
                                <Form.Label> Telefono </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefono"
                                    name="telefono"
                                    id="telefono"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.telefono }
                                    required
                                /> <br />
                                <Form.Label> DUI </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="DUI"
                                    name="clie_DUI"
                                    id="clie_DUI"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.clie_DUI }
                                    required
                                /> <br />
                                <Form.Label> Referencias</Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Referencias"
                                    name="referencia"
                                    id="referencia"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.referencia}
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
                        Estas seguro que quieres eliminar el cliente de:
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> Nombre del cliente </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Cliente"
                                    id="id_Cliente"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Cliente}
                                    readOnly
                                /> <br />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del Cliente"
                                    name="clie_Nombre"
                                    id="clie_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.clie_Nombre + " " + gestorSeleccionado.clie_Apellido}
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

export default Clientes;