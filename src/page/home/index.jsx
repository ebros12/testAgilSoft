import React, { useEffect, useState, useRef } from 'react';
import { useMovStore } from '../../hooks/useMovStore';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSelectedMovie } from '../../store/slices/movie';

const Home = () => {
  const dispatch = useDispatch();
  const { startMovies, startPopularMovies } = useMovStore();
  const { checkAuthToken } = useAuthStore();

  const [allMov, setAllMov] = useState([]); // Todas las películas
  const [popularMov, setPopularMov] = useState([]); // Películas populares
  const [currentMovies, setCurrentMovies] = useState([]); // Películas visibles
  const [currentIndex, setCurrentIndex] = useState(3); // Índice de la película central
  const [pageNumber, setPageNumber] = useState(1); // Página actual para "Películas en Estreno"
  const [popularPage, setPopularPage] = useState(1); // Página actual para "Películas más populares"
  const [isLoading, setIsLoading] = useState(false); // Control del estado de carga
  const observerRef = useRef(); // Referencia para el Intersection Observer

  const { status, user, errorMessage } = useSelector((state) => state.login);

  // Cargar las películas cuando la página cambia
  useEffect(() => {
    checkAuthToken();
    const fetchMovies = async () => {
      setIsLoading(true);
      const movs = await startMovies(pageNumber);

      if (movs && movs.length > 0) {
        setAllMov((prevMovs) => (pageNumber === 1 ? [...movs] : [...prevMovs, ...movs]));
      }
      setIsLoading(false);
    };

    const fetchPopularMovies = async () => {
      setIsLoading(true);
      const movs = await startPopularMovies(popularPage);

      if (movs && movs.length > 0) {
        setPopularMov((prevMovs) => (popularPage === 1 ? [...movs] : [...prevMovs, ...movs]));
      }
      setIsLoading(false);
    };

    fetchMovies();
    fetchPopularMovies();
  }, [pageNumber, popularPage]);

  // Configurar el Intersection Observer para "Películas más populares"
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setPopularPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading]);

  // Actualizar las películas visibles cada vez que el índice cambie
  useEffect(() => {
    if (allMov.length > 0) {
      const start = Math.max(currentIndex - 3, 0); // Asegurar que no salgan índices negativos
      const end = start + 7; // Tomamos 3 a la izquierda, la central y 3 a la derecha
      setCurrentMovies(allMov.slice(start, end));
    }
  }, [currentIndex, allMov]);

  // Función para cambiar las películas
  const cambiarPelícula = (direction) => {
    if (direction === 'next') {
      if (currentIndex < allMov.length - 4) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentIndex >= allMov.length - 4 && !isLoading) {
        setPageNumber(pageNumber + 1);
        setCurrentIndex(currentIndex + 1);
      }
    } else if (direction === 'prev') {
      if (currentIndex > 3) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div className="">
      {/* Saludo al usuario */}
      <div className="row user-greeting">
        <h5>hola {user.name} 🙋🏻‍♂️</h5>
      </div>

      {/* Películas en estreno */}
      <div className="row">
        <h1>Películas en Estreno</h1>
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <div
            className="carousel-container"
            style={{
              display: 'flex',
              transition: 'transform 0.3s ease',
            }}
          >
            {currentMovies.map((movie, index) => (
              <div
  key={movie.id}
  className="carousel-item"
  style={{

    margin: '0 10px',
    transform: index === 3 ? 'scale(1.1)' : 'scale(0.9)',
    transition: 'transform 0.3s ease',
    flexShrink: 0,
    textAlign: 'center',
  }}
>
<Link
  to={`/movie/${movie.id}`}
  onClick={() => dispatch(setSelectedMovie(movie))} // Guardar la película en Redux
>
  <img
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    alt={movie.title}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '8px',
    }}
  />
</Link>
</div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            className="btn waves-effect waves-light"
            onClick={() => cambiarPelícula('prev')}
            disabled={isLoading}
          >
            Anterior
          </button>
          <button
            className="btn waves-effect waves-light"
            onClick={() => cambiarPelícula('next')}
            disabled={isLoading}
          >
            Siguiente
          </button>
        </div>

      </div>

      {/* Películas más populares */}
      <div className="row">
        <h1>Películas más populares</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {popularMov.map((movie) => (
  <div key={movie.id} className="popular-movie">
  <Link
    to={`/movie/${movie.id}`}
    onClick={() => dispatch(setSelectedMovie(movie))} // Guardar la película en Redux
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      style={{
        width: '100%',
        borderRadius: '8px',
      }}
    />
    <h5 style={{ textAlign: 'center' }}>{movie.title}</h5>
  </Link>
</div>
          ))}
        </div>
        <div ref={observerRef} style={{ height: '1px', background: 'transparent' }} />
      </div>
    </div>
  );
};


export default Home