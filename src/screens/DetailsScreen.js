import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, FlatList,
  ActivityIndicator, TouchableOpacity, Linking,
  StatusBar, Share 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { fetchMovieDetails, fetchMovieVideos, getImagePath , fetchMovieCredits} from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import DetailsSkeleton from '../components/DetailsSkeleton'; 


export default function DetailsScreen({ route, navigation }) {
  const { movieId } = route.params;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadDetails();
  loadTrailer();
  loadCredits(); // ← Nueva función
}, []);

const loadCredits = async () => {
  try {
    const credits = await fetchMovieCredits(movieId);
    setCast(credits);
  } catch (error) {
    console.error('Error cargando actores:', error);
  }
};

  const loadDetails = async () => {
    try {
      const data = await fetchMovieDetails(movieId);
      setMovie(data);
      navigation.setOptions({ title: data.title });
    } catch (error) {
      console.error('Error detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrailer = async () => {
    try {
      const videos = await fetchMovieVideos(movieId);
      // console.log('🎬 Videos:', videos); // Debug opcional
      if (videos.length > 0) {
        setTrailer(videos[0].key);
      }
    } catch (error) {
      console.error('Error trailer:', error);
    }
  };

  const toggleFavorite = () => {
    if (!movie) return;
    if (isFavorite(movieId)) {
      removeFavorite(movieId);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
    }
  };

  // Actualizar header con botón de favorito
 useEffect(() => {
  if (movie) {
    navigation.setOptions({
      title: movie.title,
      headerRight: () => (
        <View style={styles.headerButtons}>
          {/* Botón Compartir */}
          <TouchableOpacity 
            onPress={handleShare} 
            style={styles.headerButton}
          >
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
          {/* Botón Favorito */}
          <TouchableOpacity 
            onPress={toggleFavorite} 
            style={styles.headerButton}
          >
            <Ionicons 
              name={isFavorite(movieId) ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite(movieId) ? '#E50914' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }
}, [movie, isFavorite(movieId)]);

const handleShare = async () => {
  try {
    const movieTitle = encodeURIComponent(movie.title);
    
    // Enlace HTTPS (clicable en WhatsApp, etc.) - apunta a TMDB como fallback
    const webLink = `https://www.themoviedb.org/movie/${movieId}`;
    
    // Enlace custom scheme (para cuando la app esté instalada)
    const deepLink = `cinefolio://movie/${movieId}`;
    
    const shareMessage = `🍿 *${movie.title}*\n\n⭐ ${movie.vote_average.toFixed(1)} / 10\n\n📝 ${movie.overview?.substring(0, 150)}...\n\n🔗 Ver película: ${webLink}\n\n📱 O abre en CineFolio: ${deepLink}`;
    
    await Share.share({
      message: shareMessage,
      title: movie.title,
      // Para iOS, usa el webLink para que sea clicable
      url: webLink,
    });
  } catch (error) {
    console.error('Error al compartir:', error);
  }
};

  if (loading) {
  return <DetailsSkeleton />;
}

  if (!movie) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      <ScrollView style={styles.scrollView}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: getImagePath(movie.backdrop_path || movie.poster_path) }} 
            style={styles.banner} 
          />
          <View style={styles.gradient} />
        </View>

        <View style={styles.content}>
          {/* Título y Rating */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.meta}>
            {new Date(movie.release_date).getFullYear()} • {movie.runtime} min • {movie.original_language.toUpperCase()}
          </Text>

          {/* Géneros */}
          <View style={styles.genres}>
            {movie.genres?.map(g => (
              <Text key={g.id} style={styles.genreTag}>{g.name}</Text>
            ))}
          </View>

          {/* 🎬 Sección de Trailer */}
          <View style={styles.trailerSection}>
            <Text style={styles.sectionTitle}>🎬 Trailer</Text>
            
            {trailer ? (
              <YoutubeIframe
                height={200}
                videoId={trailer}
                webViewProps={{ userAgent: 'iOS' }}
              />
            ) : (
              <View style={styles.noTrailer}>
                <Ionicons name="logo-youtube" size={32} color="#666" />
                <Text style={styles.noTrailerText}>Trailer no disponible en TMDB</Text>
                <TouchableOpacity 
                  style={styles.searchTrailerBtn}
                  onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}+trailer`)}
                >
                  <Text style={styles.searchTrailerText}>🔍 Buscar en YouTube</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

            {/* 🎭 Sección de Actores */}
            {cast.length > 0 && (
            <View style={styles.castSection}>
                <Text style={styles.sectionTitle}>🎭 Reparto Principal</Text>
                <FlatList
                data={cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.castCard}>
                    <Image 
                        source={{ 
                        uri: item.profile_path 
                            ? getImagePath(item.profile_path) 
                            : 'https://via.placeholder.com/100x150?text=No+Photo' 
                        }} 
                        style={styles.castPhoto} 
                    />
                    <Text style={styles.castName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
                    </View>
                )}
                />
            </View>
            )}

          {/* Sinopsis */}
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.overview}>{movie.overview || 'Sin descripción disponible.'}</Text>
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#141414' },
  scrollView: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  loadingText: { color: '#fff', marginTop: 10 },

  headerButtons: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 15,
},
headerButton: {
  padding: 8,
  marginLeft: 8,
},
  //actores
    castSection: { marginBottom: 25 },
    castList: { paddingHorizontal: 15 },
    castCard: { 
    width: 100, 
    marginRight: 15, 
    alignItems: 'center' 
    },
    castPhoto: { 
    width: 100, 
    height: 150,
    marginBottom: 4,
    borderRadius: 8
    },
    castCharacter: { 
    color: '#aaa', 
    fontSize: 11, 
    textAlign: 'center',
    fontStyle: 'italic'
    },
  // Banner
  bannerContainer: { height: 300, position: 'relative' },
  banner: { width: '100%', height: '100%' },
  gradient: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(20,20,20,0.9)' 
  },
  
  // Contenido
  content: { padding: 20, marginTop: -60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 10 },
  ratingBadge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', 
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 
  },
  ratingText: { color: '#fff', marginLeft: 4, fontWeight: 'bold' },
  
  meta: { color: '#aaa', marginVertical: 10, fontSize: 14 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  genreTag: { 
    color: '#fff', backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, 
    borderRadius: 20, fontSize: 12, marginRight: 8, marginBottom: 8 
  },
  
  
  // Trailer
  trailerSection: { marginBottom: 25, backgroundColor: '#1f1f1f', padding: 15, borderRadius: 8 },
  noTrailer: { 
    alignItems: 'center', padding: 15, backgroundColor: '#141414', 
    borderRadius: 6, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444' 
  },
  noTrailerText: { color: '#aaa', marginVertical: 10, textAlign: 'center', fontSize: 14 },
  searchTrailerBtn: { backgroundColor: '#ff0000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  searchTrailerText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  overview: { color: '#ddd', fontSize: 15, lineHeight: 22, marginBottom: 25 },
});