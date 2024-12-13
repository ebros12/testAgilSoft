import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMovStore } from "../../hooks/useMovStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useSelector } from "react-redux";

export const Movie = () => {
  const { user } = useSelector((state) => state.login);
  const { selectedMovie } = useSelector((state) => state.movie);

  const { id } = useParams();
  const { startMoviesByID } = useMovStore();
  const { checkAuthToken } = useAuthStore();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar
  useEffect(() => {
    if (!selectedMovie) {
      // Redirigir al home si no hay película seleccionada
      navigate("/home"); 
    }
    const fetchMovieData = async () => {
      await checkAuthToken();
      if (id) {
        const fetchedMovie = await startMoviesByID(id);
        if (fetchedMovie) {
          setMovie(fetchedMovie);
          const elems = document.querySelectorAll(".carousel");
          M.Carousel.init(elems, {
            fullWidth: true,
            indicators: true,
            numVisible:	4 	
          });
        }
        setLoading(false);
      }
    };
    fetchMovieData();

  }, []);



  if (loading) return <p>Loading...</p>;

  return (
    <div >
      <div className="row user-greeting">
        <h5>Hola, {user.name} 🙋🏻‍♂️</h5>
      </div>

      <div className="row">
      <h1>{selectedMovie.original_title}</h1>
        <div className="col s12 center-align">
          
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path!==''?selectedMovie.poster_path 	:'/noFound.svg'}`}
            alt={selectedMovie.title}
            className="responsive-img"
            style={{
              borderRadius: "8px",
            }}
          />
        </div>
        <div className="col s12 m12 center-align">
        <div className="movie-content">
  <div className="movie-image">
    <img
      src={`https://image.tmdb.org/t/p/w500${
        selectedMovie.poster_path !== "" ? selectedMovie.backdrop_path : "/noFound.svg"
      }`}
      alt={selectedMovie.title}
    />
  </div>
  <div className="movie-text">
    <p>{selectedMovie.overview==""?'No hay informacion disponible para esta pelicula':selectedMovie.overview}</p>
  </div>
</div>


        </div>

      </div>

      <h1 className="center-left">Reparto</h1>
      <div className="carousel ">
        {movie?.map((actor, index) => (
          <a key={index} className="carousel-item" href={`#actor-${index}`}>
            <img
              src={`${actor.profile_path==null?'/noFound.svg':'https://image.tmdb.org/t/p/w500'+actor.profile_path}`}
              alt={actor.original_name}
              style={{
                maxHeight: "150vh",
                maxWidth: "150px",
              }}
            />
            <p className="center-align">{actor.original_name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
