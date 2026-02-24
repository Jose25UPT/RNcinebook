import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('@cinefolio_favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('@cinefolio_favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  };

  const addFavorite = (movie) => {
    if (!favorites.find(f => f.id === movie.id)) {
      saveFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (movieId) => {
    saveFavorites(favorites.filter(f => f.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some(f => f.id === movieId);
  };

  const childArray = React.Children.toArray(children);
  const normalizedChildren = childArray.filter(child => {
    if (child == null) return false;
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }
    return true;
  });

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}>
      {normalizedChildren}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
};