import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Button, Form, Row, Table, Modal, ModalBody, ModalFooter, Col } from 'react-bootstrap';
import axios from 'axios';

function Usuarios(props) {
    ///URLs de la api
    const getUrl="https://localhost:44362/api/usuario";
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
        id_Usuario: '0',
        user_Nombre: '',
        user_Apellido: '',
        user_Direccion: '',
        user_Telefono: '',
        user_DUI: '',
        tipU_Nombre: '',
        id_TipoUsuario: '',
        userName: '',
        contrasena: '',
        user_Estado: '',
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
    const seleccionarDato=(usuario)=>{
        setGestorSeleccionado(usuario);
        handleShow()
    }

    const seleccionarDatoElim=(usuario)=>{
        setGestorSeleccionado(usuario);
        handleShowBorra()
    }

    ///Cancelar JSON
    const limpiar=async()=>{
        setGestorSeleccionado({
            id_Usuario: '0',
            user_Nombre: '',
            user_Apellido: '',
            user_Direccion: '',
            user_Telefono: '',
            user_DUI: '',
            id_TipoUsuario: '',
            tipU_Nombre: '',
            userName: '',
            contrasena: '',
            user_Estado: '',
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
        if(gestorSeleccionado.tipU_Nombre == "Administrador"){
            gestorSeleccionado.id_TipoUsuario = "1"
        }else if(gestorSeleccionado.tipU_Nombre == "Vendedor"){
            gestorSeleccionado.id_TipoUsuario = "2"
        }
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
                alert("La categoria ingresada ya existe por favor escriba una nueva");
                limpiar();
                consultarDatos();
            }else if(response.data === "No puede insertar datos vacío"){
                alert("No puede dejar los campos vacios");
                limpiar();
                consultarDatos();
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
        if(gestorSeleccionado.tipU_Nombre == "Administrador"){
            gestorSeleccionado.id_TipoUsuario = "1"
        }else if(gestorSeleccionado.tipU_Nombre == "Vendedor"){
            gestorSeleccionado.id_TipoUsuario = "2"
        }
        axios({
            method: "PUT",
            url: getUrl,
            data: gestorSeleccionado,
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response=>{
            if(response.data === "Ya existe una marca con el nombre insertado"){
                alert("La marca ingresada ya existe por favor escriba una nueva");
                limpiar();
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
        gestorSeleccionado.id_Usuario = parseInt(gestorSeleccionado.id_Usuario);
        axios.delete(getUrl+"/"+gestorSeleccionado.id_Usuario).then(response=>{
            setData(data.filter(gestorSeleccionado => gestorSeleccionado.id_Usuario !== response.data))
            handleCloseBorrar();
            limpiar();
            consultarDatos();
        }).catch(error=>{
            console.log(error);
        })
    }

    if(!cookies.get('id_TipoUsuario')){
        window.location.href = "./";
    }else {
        return(
            <Container>
                <Row className="justify-content-md-center MargenForm">
                <Form>
                    <h2 className="wed"> Usuarios </h2><br/>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm="1" > Nombre </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del usuario"
                            name="user_Nombre"
                            id="user_Nombre"
                            onChange={handleChange}
                            required
                            /> </Col><br />
                        <Form.Label column sm="1"> Apellido </Form.Label>
                        <Col sm="5">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Apellido del usuario"
                            name="user_Apellido"
                            id="user_Apellido"
                            onChange={handleChange}
                            required
                            /> <br />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm="1" > Direccion </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Direccion"
                            name="user_Direccion"
                            id="user_Direccion"
                            onChange={handleChange}
                            required
                            /> </Col><br />
                        <Form.Label column sm="1"> Telefono </Form.Label>
                        <Col sm="5">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="0000-0000"
                            name="user_Telefono"
                            id="user_Telefono"
                            onChange={handleChange}
                            required
                            /> <br />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm="1" > DUI </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="00000000-0"
                            name="user_DUI"
                            id="user_DUI"
                            onChange={handleChange}
                            required
                            /> </Col><br />
                        <Form.Label column sm="1"> Tipo de Usuario </Form.Label>
                        <Col sm="5">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="1: Admin. -- 2: Vendedor"
                            name="tipU_Nombre"
                            id="tipU_Nombre"
                            onChange={handleChange}
                            required
                            /> <br />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm="1" > Nombre de Usuario </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de usuario al iniciar"
                            name="userName"
                            id="userName"
                            onChange={handleChange}
                            required
                            /> </Col>
                            <Form.Label column sm="1" > Contraseña </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Contraseña"
                            name="contrasena"
                            id="contrasena"
                            onChange={handleChange}
                            required
                            /> </Col><br />
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Form.Label column sm="1" > Estado </Form.Label>
                        <Col sm="5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="A: Activo --  B: Inactivo"
                            name="user_Estado"
                            id="user_Estado"
                            onChange={handleChange}
                            required
                            /> </Col>
                    </Form.Group>
                    <Button variant="btn btn-primary" type="submit" onClick={()=>insertar()}>
                        Insertar
                    </Button>{' '}
                    <Button variant="btn btn-danger" type="submit" onClick={()=>limpiar()}>
                        Cancelar
                    </Button>
                </Form>
                </Row>
                <Table responsive>
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nombre </th>
                            <th> Apellido </th>
                            <th> Direccion </th>
                            <th> Telefono </th>
                            <th> DUI </th>
                            <th> TipoUsuario </th>
                            <th> NombreUsuario </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(usuario =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {usuario.id_Usuario} </th>
                                            <th> {usuario.user_Nombre} </th>
                                            <th> {usuario.user_Apellido} </th>
                                            <th> {usuario.user_Direccion} </th>
                                            <th> {usuario.user_Telefono} </th>
                                            <th> {usuario.user_DUI} </th>
                                            <th> {usuario.tipU_Nombre} </th>
                                            <th> {usuario.userName} </th>
                                            <th> {usuario.fechaCreacion} </th>
                                            <th> {usuario.fechaModificacion} </th>
                                            <th> <Button variant="outline-success" onClick={()=>seleccionarDato(usuario)}> Editar </Button></th>
                                            <th> <button className="btn btn-danger" onClick={()=>seleccionarDatoElim(usuario)}> Eliminar </button></th>
                                        </tr>
                                    </>
                                )
                            })}
                    </tbody>
                </Table>
                <Modal show={modificar} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title> Modificando Marca </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label> ID </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ID"
                            name="id_Usuario"
                            id="id_Usuario"
                            onChange={handleChange}
                            value={gestorSeleccionado.id_Usuario}
                            readOnly
                            required
                            /> <br />
                            <Form.Label> Nombre </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del usuario"
                            name="user_Nombre"
                            id="user_Nombre"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_Nombre}
                            required
                            /> <br />
                        <Form.Label> Apellido </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Apellido del usuario"
                            name="user_Apellido"
                            id="user_Apellido"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_Apellido}
                            required
                            /> <br />
                            <Form.Label> Direccion </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Direccion"
                            name="user_Direccion"
                            id="user_Direccion"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_Direccion}
                            required
                            /> <br />
                        <Form.Label> Telefono </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="0000-0000"
                            name="user_Telefono"
                            id="user_Telefono"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_Telefono}
                            required
                            /> <br />
                        <Form.Label> DUI </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="00000000-0"
                            name="user_DUI"
                            id="user_DUI"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_DUI}
                            required
                            /> <br />
                        <Form.Label> Tipo Usuario </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="1: Admin. -- 2: Vendedor"
                            name="tipU_Nombre"
                            id="tipU_Nombre"
                            onChange={handleChange}
                            value={gestorSeleccionado.tipU_Nombre}
                            required
                        /> <br />
                        <Form.Label> Username </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de usuario al iniciar"
                            name="userName"
                            id="userName"
                            onChange={handleChange}
                            value={gestorSeleccionado.userName}
                            required
                        /> <br />
                        <Form.Label> Contraseña </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Contraseña"
                            name="contrasena"
                            id="contrasena"
                            onChange={handleChange}
                            required
                            /> <br />
                        <Form.Label> Estado </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="A: Activo --  B: Inactivo"
                            name="user_Estado"
                            id="user_Estado"
                            onChange={handleChange}
                            value={gestorSeleccionado.user_Estado}
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
                        Estas seguro que quieres eliminar el usuario:
                        <Form> <br/>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Usuario"
                                    id="id_Usuario"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Usuario}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre de la marca </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del usuario"
                                    name="user_Nombre"
                                    id="user_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.user_Nombre}
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

export default Usuarios;