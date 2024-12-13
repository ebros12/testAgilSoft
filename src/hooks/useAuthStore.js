import { authAPI } from "../api";
import { useSelector,useDispatch } from "react-redux";

import { clearErrorMessage, onLogin, onLogout, onChecking } from '../store/slices/login'

export const useAuthStore = () => {

    const { status,user,errorMessage } = useSelector(state => state.login)
    const dispatch = useDispatch();

    const startLogin = async ({ username, password }) => {
        console.log("el username y password ", username, password);
        dispatch(onChecking());
        try {
            const { data } = await authAPI.post('/login', { username, password });
    
            // Almacenar token en el localStorage
            console.log("asdasdasd",data.data.payload)
            localStorage.setItem('token', data.data.payload.token);
            localStorage.setItem('refresh_token', data.data.payload.refresh_token);
            localStorage.setItem('token-init-date', new Date().getTime());
    
            // Actualizar el estado de autenticación
            dispatch(onLogin({ name: data.data.user.firstName+" "+data.data.user.lastName, uid: data.uid }));
    
            // Retornar los datos para confirmar éxito
            return data; // Aquí retorna el objeto `data` recibido del servidor
        } catch (error) {
            console.log("error", error);
    
            // Manejo de error en caso de credenciales incorrectas
            dispatch(onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
    
            // Lanza el error para manejarlo en el lugar donde se llama
            throw error;
        }
    };
    


    const checkAuthToken = async () => {

      
        const token = localStorage.getItem('refresh_token');
        const tokenInitDate = localStorage.getItem('token-init-date');
      
        // Si no hay token o no hay fecha de inicialización, el usuario debe hacer logout
        if (!token || !tokenInitDate) {
          return dispatch(onLogout());
        }
      
        const diffInMinutes = (new Date().getTime() - tokenInitDate) / 1000 / 60;
      
        // Si el token ha pasado de los 5 minutos, expira y necesita ser renovado
        if (diffInMinutes > 5) {
          try {
            // Verifica si el token sigue siendo válido
            const { data } = await authAPI.post('/refresh',{refresh_token:token}); // Llamada para renovar el token
      
            // Si la renovación fue exitosa, actualiza el token y la fecha
            localStorage.setItem('token', data.data.payload.token);
            localStorage.setItem('token-init-date', new Date().getTime());  // Actualiza la fecha de inicio del token
      
            // También puedes actualizar el estado de usuario aquí
            dispatch(onLogin({ name: data.data.user.firstName+" "+data.data.user.lastName, uid: data.uid }));
      
          } catch (error) {
            console.error('Token inválido o expirado', error);
      
            // Si hay un error (token inválido o no se puede renovar), elimina el token y cierra sesión
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
            dispatch(onLogout());
          }
        } else {
          // Si el token no ha expirado, lo dejamos como está
          try {
            // Si el token es aún válido, solo actualizamos el estado del usuario
            const { data } = await authAPI.post('/refresh',{refresh_token:token}); // Llamada opcional para verificar usuario
      
            dispatch(onLogin({ name: data.data.user.firstName+" "+data.data.user.lastName, uid: data.uid }));
          } catch (error) {
            console.error('Error al verificar token', error);
            dispatch(onLogout());
          }
        }
      };

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-dat');
        dispatch(onLogout())
    }





    return {
        //Propiedades
        status,
        user,
        errorMessage,
        


        //*Metodos
        startLogin,
        checkAuthToken,
        startLogout
    }
}