// src/components/DetailsSkeleton.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from './Skeleton';

export default function DetailsSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView>
        {/* Banner Skeleton */}
        <Skeleton width="100%" height={300} />
        
        <View style={styles.content}>
          {/* Título */}
          <View style={styles.headerRow}>
            <Skeleton width={200} height={28} />
            <Skeleton width={50} height={28} />
          </View>
          
          {/* Meta */}
          <Skeleton width={150} height={16} style={styles.metaSkeleton} />
          
          {/* Géneros */}
          <View style={styles.genres}>
            <Skeleton width={80} height={24} />
            <Skeleton width={70} height={24} />
            <Skeleton width={90} height={24} />
          </View>
          
          {/* Trailer */}
          <Skeleton width="100%" height={200} />
          
          {/* Sinopsis */}
          <Skeleton width={100} height={20} style={styles.sectionTitle} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
          
          {/* Actores */}
          <Skeleton width={150} height={20} style={styles.sectionTitle} />
          <View style={styles.castRow}>
            <Skeleton width={100} height={150} />
            <Skeleton width={100} height={150} />
            <Skeleton width={100} height={150} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#141414' },
  content: { padding: 20, marginTop: -60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metaSkeleton: { marginBottom: 10 },
  genres: { flexDirection: 'row', marginBottom: 20 },
  sectionTitle: { marginBottom: 10 },
  castRow: { flexDirection: 'row', marginTop: 10 },
});