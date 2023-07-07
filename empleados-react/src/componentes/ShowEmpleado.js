import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

const ShowEmpleado = () => {
  let url = "http://localhost:8000/empleado/listar/";

  const [empleados, setEmpleados] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [salarioBase, setSalarioBase] = useState("");
  const [horasTrabajadas, setHorasTrabajadas] = useState("");
  const [creacion, setCreacion] = useState("");
  const [operacion, setOperacion] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    const respuesta = await axios.get(url);
    setEmpleados(respuesta.data);
  };

  const openModal = (
    operacion,
    id,
    nombre,
    idEmpleado,
    salarioBase,
    horasTrabajadas
  ) => {
    setId("");
    setNombre("");
    setIdEmpleado("");
    setSalarioBase("");
    setHorasTrabajadas("");
    setOperacion(operacion);
    if (operacion === 1) {
      setTitle("Registrar Empleado");
    } else if (operacion === 2) {
      setTitle("Editar Empleado");
      setId(id);
      setNombre(nombre);
      setIdEmpleado(idEmpleado);
      setSalarioBase(salarioBase);
      setHorasTrabajadas(horasTrabajadas);
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const validar = () => {
    var parametros;
    var metodo;
    let url;
    if (nombre.trim() === "") {
      show_alerta("Campo Vacio", "warning");
    } else if (idEmpleado.trim() === "") {
      show_alerta("Campo Vacio", "warning");
    } else if (salarioBase.trim() === "") {
      show_alerta("Campo Vacio", "warning");
    } else if (horasTrabajadas.trim() === "") {
      show_alerta("Campo Vacio", "warning");
    } else {
      if (operacion === 1) {
        parametros = {
          nombre: nombre.trim(),
          idEmpleado: idEmpleado.trim(),
          salarioBase: salarioBase.trim(),
          horasTrabajadas: horasTrabajadas.trim(),
        };
        metodo = "POST";
        url = "http://localhost:8000/empleado/crear/";
      } else {
        parametros = {
          id: id,
          nombre: nombre.trim(),
          idEmpleado: idEmpleado.trim(),
          salarioBase: salarioBase.trim(),
          horasTrabajadas: horasTrabajadas.trim(),
        };
        metodo = "PUT";
        url = "http://localhost:8000/empleado/actualizar/{parametros.id}/";
      }
      enviar(metodo, parametros, url);
    }
  };

  const enviar = async (metodo, parametros, url) => {
    await axios({ method: metodo, url: url, data: parametros })
      .then(function (respuesta) {
        var tipo = respuesta.data[0];
        var msj = respuesta.data[1];
        show_alerta(msj, tipo);
        if (tipo === "success") {
          document.getElementById("btnCerrar").click();
          getEmpleados();
        }
      })
      .catch(function (error) {
        show_alerta("Error", "error");
      });
  };

  const eliminar = (id, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Seguro",
      icon: "question",
      text: "No se podra recuperar",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setId(id);
        enviar("DELETE", { id: id });
      } else {
        show_alerta("No se pudo eliminar");
      }
    });
  };
  return (
    <div className="App">
      <div className="contaier-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalEmpleados"
              >
                <i className="fa-solid fa-circle-plus">AGREGAR EMPLEADO</i>
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>IdEmpleado</th>
                    <th>Salario Base</th>
                    <th>Horas Trabajadas</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className="table-group-divider">
                  {empleados.map((empleado, i) => (
                    <tr key={empleado.id}>
                      <td>{i + 1}</td>
                      <td>{empleado.nombre}</td>
                      <td>{empleado.idEmpleado}</td>
                      <td>Q {empleado.salarioBase}</td>
                      <td>{empleado.horasTrabajadas}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              empleado.id,
                              empleado.nombre,
                              empleado.idEmpleado,
                              empleado.salarioBase,
                              empleado.horasTrabajadas
                            )
                          }
                          className="btn btn.warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEmpleados"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => eliminar(empleado.id, empleado.nombre)}
                          className="btn btn.danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="modalEmpleados" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-gropu-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-gropu-text">
                  <i className="fa fa-drivers-license"></i>
                </span>
                <input
                  type="text"
                  id="idEmpleado"
                  className="form-control"
                  placeholder="Id Empleado"
                  value={idEmpleado}
                  onChange={(e) => setIdEmpleado(e.target.value)}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-gropu-text">
                  <i className="fa fa-dollar"></i>
                </span>
                <input
                  type="text"
                  id="salarioBase"
                  className="form-control"
                  placeholder="Salario"
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(e.target.value)}
                ></input>
              </div>

              <div className="input-group mb-3">
                <span className="input-gropu-text">
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="text"
                  id="horasTrabajadas"
                  className="form-control"
                  placeholder="Horas Trabajadas"
                  value={horasTrabajadas}
                  onChange={(e) => setHorasTrabajadas(e.target.value)}
                ></input>
              </div>

              <div className="d-grig col-6 mx auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i>GUARDAR
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowEmpleado;
