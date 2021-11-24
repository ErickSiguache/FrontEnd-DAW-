import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from '../pages/Login';
import Menu from '../pages/Menu';
import MenuAdmin from "../pages/MenuAdmin";
import MenuNav from "../pages/MenuNav";
import Clientes from "../pages/Clientes";
import Categorias from "../pages/Categorias"
import Proveedores from "../pages/Proveedores"
import Marcas from "../pages/Marcas"
import Productos from "../pages/Productos"
import Inventario from "../pages/Inventario"
import Usuarios from "../pages/Usuarios"

function App() {
  return (
    <BrowserRouter>
      <MenuNav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/MenuAdmin" element={ <MenuAdmin />} />
        <Route path="/Clientes" element={ <Clientes />} />
        <Route path="/Categorias" element={ <Categorias />} />
        <Route path="/Proveedores" element={ <Proveedores />} />
        <Route path="/Marcas" element={ <Marcas />} />
        <Route path="/Productos" element={ <Productos />} />
        <Route path="/Inventario" element={ <Inventario />} />
        <Route path="/Usuarios" element={ <Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
