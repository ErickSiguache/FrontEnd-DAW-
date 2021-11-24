import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Button, Form, Row, Table, Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import axios from 'axios';

function Categorias(props) {
    ///URLs de la api
    const getUrl="https://localhost:44362/api/categoria";
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
        id_Categoria: '0',
        cat_Nombre: '',
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
    const seleccionarDato=(categoria)=>{
        setGestorSeleccionado(categoria);
        handleShow()
    }

    const seleccionarDatoElim=(categoria)=>{
        setGestorSeleccionado(categoria);
        handleShowBorra()
    }

    ///Cancelar JSON
    const limpiar=async()=>{
        setGestorSeleccionado({
            id_Categoria: '0',
            cat_Nombre: '',
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
        axios({
            method: "PUT",
            url: getUrl,
            data: gestorSeleccionado,
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response=>{
            if(response.data === "Ya existe una categoria con el nombre insertado"){
                alert("La categoria ingresada ya existe por favor escriba una nueva");
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
        gestorSeleccionado.id_Categoria = parseInt(gestorSeleccionado.id_Categoria);
        axios.delete(getUrl+"/"+gestorSeleccionado.id_Categoria).then(response=>{
            setData(data.filter(gestorSeleccionado => gestorSeleccionado.id_Categoria !== response.data))
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
                    <h2 className="wed"> Categoria </h2><br/>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Nombre de la Categoria </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la Categoria"
                            name="cat_Nombre"
                            id="cat_Nombre"
                            onChange={handleChange}
                            required
                            /> <br />
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
                            <th> Nombre de la Categoria </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(categorias =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {categorias.id_Categoria} </th>
                                            <th> {categorias.cat_Nombre} </th>
                                            <th> {categorias.fechaCreacion} </th>
                                            <th> {categorias.fechaModificacion} </th>
                                            <th> <Button variant="outline-success" onClick={()=>seleccionarDato(categorias)}> Editar </Button></th>
                                            <th> <button className="btn btn-danger" onClick={()=>seleccionarDatoElim(categorias)}> Eliminar </button></th>
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
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la Categoria"
                                    name="id_Categoria"
                                    id="id_Categoria"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Categoria}
                                    readOnly
                                /> <br />
                                <Form.Label> Categoria </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la Categoria"
                                    name="cat_Nombre"
                                    id="cat_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.cat_Nombre}
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
                        <Form> <br/>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Categoria"
                                    id="id_Categoria"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Categoria}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre de la categoria </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la Categoria"
                                    name="cat_Nombre"
                                    id="cat_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.cat_Nombre}
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

export default Categorias;