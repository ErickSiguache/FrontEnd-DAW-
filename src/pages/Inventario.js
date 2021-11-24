import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, DropdownButton, Button, Form, Row, Table, Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import axios from 'axios';
import Dropdown from '@restart/ui/esm/Dropdown';

function Inventario(props) {
    ///URLs de la api
    const getUrl="https://localhost:44362/api/inventario";
    const getUrlNomb="https://localhost:44362/api/cliente/inventario/";
    const getUrlMas="https://localhost:44362/api/inventario/MasVendidosAMenos";
    const getUrlMenos="https://localhost:44362/api/inventario/MasVendidosAMenos";
    const cookies = new Cookies();

    ///Estados
    ///Estado de guardado en memoria de JSON
    const [data, setData] = useState([]);


    ///Guardado de lista en formato JSON para insertar, editar y eliminar
    const [gestorSeleccionado, setGestorSeleccionado]=useState({
        id_LoteProducto: '0',
        pro_Nombre: '',
        fechaCaducacion: '',
        precioVenta: '',
        precioCompra: '',
        stockComprado: '',
        stockVendido: '',
        lot_Estado: '',
        valor: '',
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

    const consultarDatosMas=async()=>{
        axios.get(getUrlMas)
        .then(response => {
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }

    const consultarDatosMen=async()=>{
        axios.get(getUrlMenos)
        .then(response => {
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        if(gestorSeleccionado.valor == "Mas vendidos a menos"){
            consultarDatosMas();
        }else if(gestorSeleccionado.valor == "Menos vendidos a mas"){
            consultarDatosMen();
        }else if(gestorSeleccionado.valor == ""){
            consultarDatos();
        }
        
    }, [])

    ///Insertar datos
    const insertar=async()=>{
        axios({
            method: "GET",
            url: getUrlNomb,
            data: gestorSeleccionado,
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response=>{
            if(response.valor == "Mas vendidos a menos"){
                consultarDatosMas();
            }else if(response.valor == "Menos vendidos a mas"){
                consultarDatosMen();
            }
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
                    <h2 className="wed"> Inventario  </h2><br/>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Nombre del Producto </Form.Label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del Producto"
                            name="mar_Nombre"
                            id="mar_Nombre"
                            onChange={handleChange}
                            required
                            /> <br />
                    </Form.Group>
                    <select id="valor" name="valor" onChange={handleChange}>
                        <option > Opciones </option>
                        <option > Por nombre </option>
                        <option > Mas vendidos a menos </option>
                        <option > Menos vendidos a mas </option>
                        <option > General </option>
                    </select>{'         '}{'  '}
                    <Button variant="btn btn-primary" type="submit" onClick={()=>insertar()}>
                            Buscar
                        </Button>
                </Form>
                </Row>
                <Table responsive>
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nombre del producto </th>
                            <th> Fecha de Caducidad </th>
                            <th> PrecioVenta </th>
                            <th> PrecioCompra </th>
                            <th> StockComprado </th>
                            <th> StockVendido </th>
                            <th> Fecha de Creacion </th>
                            <th> Fecha de Modificacion </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(productos =>{
                                return(
                                    <>
                                        <tr>
                                            <th> {productos.id_LoteProducto} </th>
                                            <th> {productos.pro_Nombre} </th>
                                            <th> {productos.fechaCaducacion} </th>
                                            <th> {productos.precioVenta} </th>
                                            <th> {productos.precioCompra} </th>
                                            <th> {productos.stockComprado} </th>
                                            <th> {productos.stockVendido} </th>
                                            <th> {productos.fechaCreacion} </th>
                                            <th> {productos.fechaModificacion} </th>
                                        </tr>
                                    </>
                                )
                            })}
                    </tbody>
                </Table>
            </Container>
        );
    }
    
}

export default Inventario;