import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  ActivityIndicator, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPopularMovies, getImagePath } from '../services/api';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Skeleton from '../components/Skeleton';


export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar películas (inicial o paginación)
  const loadMovies = async (pageNumber, isRefresh = false) => {
    try {
      const data = await fetchPopularMovies(pageNumber);
      
      if (isRefresh) {
        setMovies(data.results);
      } else {
        // Concatenar nuevas películas con las existentes
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (error) {
      console.error('Error cargando películas:', error);
      if (pageNumber === 1) {
        alert('Error al cargar la cartelera');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    loadMovies(1, true);
  }, []);

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadMovies(1, true);
  }, []);

  // Cargar más al llegar al final (Infinite Scroll)
  const loadMore = () => {
    if (loadingMore || page >= totalPages) return; // No cargar si ya estamos cargando o no hay más páginas
    setLoadingMore(true);
    loadMovies(page + 1);
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image 
        source={{ uri: getImagePath(item.poster_path) }} 
        style={styles.poster} 
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  
  // Componente para el footer (cuando carga más)
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#E50914" />
        <Text style={styles.footerText}>Cargando más...</Text>
      </View>
    );
  };

  // En el render, cuando está cargando:
if (loading && !refreshing) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <View style={styles.container}>
        <Skeleton width={150} height={32} style={styles.headerSkeleton} />
        <FlatList
          data={Array(8).fill({ id: Math.random() })} // 8 skeletons
          renderItem={() => <MovieCardSkeleton />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <View style={styles.container}>
        <Text style={styles.header}>Tendencias</Text>
        
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          
          // ✅ Infinite Scroll
          onEndReached={loadMore}
          onEndReachedThreshold={0.3} // Cargar cuando falte 30% para el final
          
          // ✅ Pull-to-Refresh
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
          }
          
          // ✅ Footer de carga
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#141414' },
  container: { flex: 1, backgroundColor: '#141414', padding: 20 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: { flex: 1, margin: 5, backgroundColor: '#1f1f1f', borderRadius: 8, overflow: 'hidden' },
  poster: { width: '100%', height: 250 },
  cardInfo: { padding: 10 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  rating: { color: '#46d369', fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  loadingText: { color: '#fff', marginTop: 10 },
  footer: { padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#aaa', marginLeft: 10 },
});