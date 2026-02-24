import axios from 'axios';
import { TMDB_BASE_URL, TMDB_API_KEY, IMAGE_BASE_URL } from '@env';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'es-ES', // Importante para tu portafolio en español
  },
});

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page } // <-- Pasamos el número de página
    });
    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    throw error;
  }
};

export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`);
    
    // Filtro más flexible: YouTube + (Trailer OR Teaser OR Clip)
    const validVideos = response.data.results.filter(
      video => 
        video.site === 'YouTube' && 
        ['Trailer', 'Teaser', 'Clip'].includes(video.type)
    );
    
    // Priorizar Trailers sobre Teasers/Clips
    const trailer = validVideos.find(v => v.type === 'Trailer');
    return trailer ? [trailer] : validVideos;
    
  } catch (error) {
    console.error('Error al obtener videos:', error);
    return [];
  }
};

// Bonus: Función para otras categorías
export const fetchMoviesByCategory = async (category, page = 1) => {
  // categories: 'popular', 'top_rated', 'upcoming', 'now_playing'
  try {
    const response = await api.get(`/movie/${category}`, {
      params: { page }
    });
    return {
      results: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error(`Error en categoría ${category}:`, error);
    throw error;
  }
};

//actores 

export const fetchMovieCredits = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    // Retornamos solo los primeros 10 actores
    return response.data.cast.slice(0, 10);
  } catch (error) {
    console.error('Error al obtener créditos:', error);
    return [];
  }
};

export const getImagePath = (path) => {
  return `${IMAGE_BASE_URL}${path}`;
};

export default api;


