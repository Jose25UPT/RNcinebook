import React, { useState, useCallback } from 'react';
import { 
  View, Text, TextInput, FlatList, Image, 
  StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getImagePath } from '../services/api';
import api from '../services/api';
import debounce from 'lodash.debounce';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Búsqueda con debounce (espera 500ms después de dejar de escribir)
  const searchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/search/movie', {
        params: { query: searchQuery }
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función debounceada
  const debouncedSearch = useCallback(
    debounce((text) => searchMovies(text), 500),
    []
  );

  const handleTextChange = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image 
        source={{ 
          uri: item.poster_path 
            ? getImagePath(item.poster_path) 
            : 'https://via.placeholder.com/150x225?text=No+Image' 
        }} 
        style={styles.poster} 
      />
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.year}>
          {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <View style={styles.container}>
      <Text style={styles.header}>Buscar Películas</Text>
      
      {/* Barra de búsqueda */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="Ej: Avengers, Titanic..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={handleTextChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Resultados */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : query.length > 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No se encontraron películas</Text>
        </View>
      ) : (
        <View style={styles.center}>
          <Ionicons name="film-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>Escribe para buscar películas</Text>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#141414' },
  container: { flex: 1, backgroundColor: '#141414', padding: 20 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  list: { paddingBottom: 20 },
  card: { flex: 1, margin: 5, backgroundColor: '#1f1f1f', borderRadius: 8, overflow: 'hidden' },
  poster: { width: '100%', height: 250 },
  cardInfo: { padding: 10 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  year: { color: '#aaa', fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  emptyText: { color: '#666', fontSize: 16, marginTop: 10, textAlign: 'center' },
});