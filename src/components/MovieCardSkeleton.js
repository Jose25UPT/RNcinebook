// src/components/MovieCardSkeleton.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

export default function MovieCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={250} />
      <View style={styles.info}>
        <Skeleton width="90%" height={16} />
        <View style={styles.ratingRow}>
          <Skeleton width={40} height={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    overflow: 'hidden',
  },
  info: {
    padding: 10,
  },
  ratingRow: {
    marginTop: 8,
  },
});