import React from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  TouchableOpacity, ActivityIndicator, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { getImagePath } from '../services/api';

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite, loading } = useFavorites();

  const renderMovie = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      <Image 
        source={{ uri: getImagePath(item.poster_path) }} 
        style={styles.poster} 
      />
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeFavorite(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <View style={styles.container}>
      <Text style={styles.header}>Mis Favoritos ❤️ </Text>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="heart-dislike-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>No tienes favoritos aún</Text>
          <Text style={styles.emptySubtext}>Toca el corazón en una película para guardarla</Text>
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
  list: { paddingBottom: 20 },
  card: { flex: 1, margin: 5, backgroundColor: '#1f1f1f', borderRadius: 8, overflow: 'hidden', position: 'relative' },
  poster: { width: '100%', height: 250 },
  cardInfo: { padding: 10 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  rating: { color: '#46d369', fontSize: 12 },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(229, 9, 20, 0.8)',
    borderRadius: 20,
    padding: 8
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 20 },
  emptySubtext: { color: '#666', fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 40 },
});