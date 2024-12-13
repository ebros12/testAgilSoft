import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/useAuthStore";
import M from "materialize-css";

export const Login = () => {
  const { startLogin, errorMessage } = useAuthStore();
  const navigate = useNavigate(); // Mover useNavigate al componente funcional

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = {};

    if (!formData.username) {
      tempErrors.username = "El nombre de usuario es obligatorio.";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true); // Bloquea nuevos envíos mientras se procesa
      try {
        const login = await startLogin({
          username: formData.username,
          password: formData.password,
        });

        // Mostrar mensaje de éxito solo si no hay errores
        if (login !== undefined) {
          M.toast({
            html: "Inicio de sesión exitoso",
            classes: "green darken-1",
          });

          // Redirigir al usuario al home
          navigate("/home");
        }
      } catch (err) {
        console.error("Error en el inicio de sesión:", err);
      } finally {
        setIsSubmitting(false); // Permite nuevos envíos
      }
    }
  };

  // Mostrar errorMessage si existe (para errores gestionados por el servidor)
  useEffect(() => {
    if (errorMessage) {
      M.toast({ html: errorMessage, classes: "red darken-1" });
    }
  }, [errorMessage]);

  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          <div className="card z-depth-2" style={{ marginTop: "20%" }}>
            <div className="card-content">
              <h5 className="center-align">Iniciar Sesión</h5>
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="input-field">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={errors.username ? "invalid" : ""}
                  />
                  <label htmlFor="username">Nombre de usuario</label>
                  {errors.username && (
                    <span className="helper-text red-text">
                      {errors.username}
                    </span>
                  )}
                </div>

                {/* Password Field */}
                <div className="input-field">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "invalid" : ""}
                  />
                  <label htmlFor="password">Contraseña</label>
                  {errors.password && (
                    <span className="helper-text red-text">
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="center-align">
                  <button
                    type="submit"
                    className="btn waves-effect waves-light blue"
                    style={{ width: "100%" }}
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
