import { movAPI } from "../api";

export const useMovStore = () => {

  // startMovies ahora espera un objeto con la propiedad page
  const startMovies = async (page) => {  // Cambié la desestructuración a un solo parámetro

    try {
      const { data } = await movAPI.get('/now_playing', { params: { page } }); // Se pasa `page` como parámetro de la solicitud

      return data.data; // Aquí retorna el objeto `data` recibido del servidor
    } catch (error) {
      console.log("error", error);

      // Lanza el error para manejarlo en el lugar donde se llama
      throw error;
    }
  };


  const startPopularMovies = async (page) => {  // Cambié la desestructuración a un solo parámetro

    try {
      const { data } = await movAPI.get('/popular', { params: { page } }); // Se pasa `page` como parámetro de la solicitud

      return data.data; // Aquí retorna el objeto `data` recibido del servidor
    } catch (error) {
      console.log("error", error);

      // Lanza el error para manejarlo en el lugar donde se llama
      throw error;
    }
  };

  const startMoviesByID = async (id) => {  // Cambié la desestructuración a un solo parámetro

    try {
        const { data } = await movAPI.get(`/${id}/actors`);        // Se pasa `page` como parámetro de la solicitud

      return data.data; // Aquí retorna el objeto `data` recibido del servidor
    } catch (error) {
      console.log("error", error);

      // Lanza el error para manejarlo en el lugar donde se llama
      throw error;
    }
  };


  

  return {
    // Métodos
    startMovies,
    startPopularMovies,
    startMoviesByID
  };
};
