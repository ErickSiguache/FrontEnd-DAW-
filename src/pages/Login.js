import React, { useState } from 'react';
import md5 from 'md5';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/Login.css';

function Login(props) {


  const loginUrl="https://localhost:44362/api/usuario/login";
  const cookies = new Cookies();

  const [form, setForm]=useState({
    username:'',
    pass: ''
  });

  //Toma los datos en tiempo real
  const handleChange=e=>{
    const {name, value} = e.target;
    setForm({
      ...form,
      [name]: value
    });
    console.log(form);
  }

  const inicioSesion=async()=>{
    await axios.get(loginUrl+`/${form.username}/${md5(form.pass)}`)
    .then(response=>{
      if(response.data === "Usuario no existe"){
        alert("Debe ingresar los datos correctamente");
      }else if(response.data !== "Usuario no existe"){
        var respuesta = response.data[0];
        cookies.set('token', respuesta.token, {path: '/'});
        cookies.set('id_TipoUsuario', respuesta.id_TipoUsuario, {path: '/'});
        if(cookies.get('id_TipoUsuario') === "1"){
          alert("Bienvenido" + "  "+ respuesta.token + "   " + respuesta.id_TipoUsuario)
          window.location.href = "./MenuAdmin";
        }else if(cookies.get('id_TipoUsuario') === "2"){
          alert("Bienvenido" + "  "+ respuesta.token + "   " + respuesta.id_TipoUsuario)
          window.location.href = "./Menu";
        }else {
          alert("No tienes acceso")
        }
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }


  if(cookies.get('id_TipoUsuario') === "1"){
    window.location.href = "./MenuAdmin";
  }else if(cookies.get('id_TipoUsuario') === "2"){
    window.location.href = "./Menu";
  }else if(!cookies.get('id_TipoUsuario') && !cookies.get('token')){
    return(
      <div className="containerPrincipal">
        <h2 className="wed"> Inicio de Sesion </h2><br/>
        <div className="containerLogin">
          <div className="form-group">
            <label>Usuario: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="username"
              onChange={handleChange}
            />
            <br />
            <label>Contraseña: </label>
            <br />
            <input
              type="password"
              className="form-control"
              name="pass"
              onChange={handleChange}
            />
            <br />
            <button className="btn btn-primary" onClick={()=>inicioSesion()}>Iniciar Sesión</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;