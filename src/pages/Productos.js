import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Button, Form, Row, Table, Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import axios from 'axios';

function Productos(props) {
    ///URLs de la api
    const getUrl="https://localhost:44362/api/producto";
    const getUrlCat="https://localhost:44362/api/categoria";
    const getUrlMar="https://localhost:44362/api/marca";
    const cookies = new Cookies();

    ///Estados
    ///Estado de guardado en memoria de JSON
    const [data, setData] = useState([]);
    const [dataC, setDataC] = useState([]);
    const [dataM, setDataM] = useState([]);
    const [modificar, setShow] = useState(false);
    const [borrar, setborrar] = useState(false);

    ///Metodos dle modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseBorrar = () => setborrar(false);
    const handleShowBorra = () => setborrar(true);


    ///Guardado de lista en formato JSON para insertar, editar y eliminar
    const [gestorSeleccionado, setGestorSeleccionado]=useState({
        id_Producto: '0',
        pro_Nombre: '',
        descripcion: '',
        mar_Nombre: '',
        cat_Nombre: '',
        id_Categoria: '0',
        id_Marca: '0',
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

    const consultarDatosCat=async()=>{
        axios.get(getUrlCat)
        .then(response => {
            setData(response.dataC);
            console.log(response.dataC);
        }).catch(error=>{
            console.log(error);
        })
    }

    const consultarDatosMar=async()=>{
        axios.get(getUrlCat)
        .then(response => {
            setData(response.dataM);
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        consultarDatos();
    }, [])


    ///Seleccionar datos
    const seleccionarDato=(producto)=>{
        setGestorSeleccionado(producto);
        handleShow()
    }

    const seleccionarDatoElim=(producto)=>{
        setGestorSeleccionado(producto);
        handleShowBorra()
    }

    ///Cancelar JSON
    const limpiar=async()=>{
        setGestorSeleccionado({
            id_Producto: '0',
            pro_Nombre: '',
            descripcion: '',
            mar_Nombre: '',
            cat_Nombre: '',
            id_Categoria: '0',
            id_Marca: '0',
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
        if(gestorSeleccionado.cat_Nombre == dataC.cat_Nombre){
            axios({
                method: "POST",
                url: getUrl,
                data: gestorSeleccionado && gestorSeleccionado.id_Categoria == dataC.id_Categoria &&
                        gestorSeleccionado.id_Marca == dataM.id_Marca,
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(response=>{
                if(response.data === "El dato ingresado ya existe"){
                    alert("El producto ingresado ya existe por favor escriba una nueva");
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
        gestorSeleccionado.id_Producto = parseInt(gestorSeleccionado.id_Producto);
        axios.delete(getUrl+"/"+gestorSeleccionado.id_Producto).then(response=>{
            setData(data.filter(gestorSeleccionado => gestorSeleccionado.id_Producto !== response.data))
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
                    <h2 className="wed"> Productos </h2><br/>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Nombre del producto </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del producto"
                            name="pro_Nombre"
                            id="pro_Nombre"
                            onChange={handleChange}
                            required
                            /> <br />
                            <Form.Label> Descripcion del producto </Form.Label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Descripcion"
                                name="descripcion"
                                id="descripcion"
                                onChange={handleChange}
                                required
                            /> <br />
                            <Form.Label> Marca </Form.Label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de la marca"
                                name="id_Marca"
                                id="id_Marca"
                                onChange={handleChange}
                                required
                            /> <br />
                            <Form.Label> Categoria </Form.Label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de la categoria"
                                name="id_Categoria"
                                id="id_Categoria"
                                onChange={handleChange}
                                required
                            /> <br />
                            <div>

                            </div>
                            
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
                            <th> Nombre del Producto </th>
                            <th> Descripcion </th>
                            <th> Marca </th>
                            <th> Categoria </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(producto =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {producto.id_Producto} </th>
                                            <th> {producto.pro_Nombre} </th>
                                            <th> {producto.descripcion} </th>
                                            <th> {producto.mar_Nombre} </th>
                                            <th> {producto.cat_Nombre} </th>
                                            <th> {producto.fechaCreacion} </th>
                                            <th> {producto.fechaModificacion} </th>
                                            <th> <Button variant="outline-success" onClick={()=>seleccionarDato(producto)}> Editar </Button></th>
                                            <th> <button className="btn btn-danger" onClick={()=>seleccionarDatoElim(producto)}> Eliminar </button></th>
                                        </tr>
                                    </>
                                )
                            })}
                    </tbody>
                </Table>
                <Modal show={modificar} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title> Modificando Producto </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Producto"
                                    id="id_Producto"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Producto}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre del producto </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre del producto"
                                    name="pro_Nombre"
                                    id="pro_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.pro_Nombre}
                                    required
                                /> <br />
                                <Form.Label> Descripcion del producto </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Descripcion"
                                    name="descripcion"
                                    id="descripcion"
                                    value={gestorSeleccionado.descripcion}
                                    onChange={handleChange}
                                    required
                                /> <br />
                                <Form.Label> Marca </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la marca"
                                    name="mar_Nombre"
                                    id="mar_Nombre"
                                    value={gestorSeleccionado.id_Producto}
                                    onChange={handleChange}
                                    required
                                /> <br />
                                <Form.Label> Categoria </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la categoria"
                                    name="cat_Nombre"
                                    id="cat_Nombre"
                                    onChange={handleChange}
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
                        Estas seguro que quieres eliminar la marca de:
                        <Form> <br/>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> ID </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ID"
                                    name="id_Marca"
                                    id="id_Marca"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.id_Marca}
                                    readOnly
                                /> <br />
                                <Form.Label> Nombre de la marca </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la marca"
                                    name="mar_Nombre"
                                    id="mar_Nombre"
                                    onChange={handleChange}
                                    value={gestorSeleccionado.mar_Nombre}
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

export default Productos;