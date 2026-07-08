import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { getPosterUrl } from '../services/tmdb';
import { PosterPlaceholder } from './PosterPlaceholder';

interface MediaPosterProps {
  posterPath: string | null;
  fallbackLabel: string;
  fallbackColors: [string, string];
  width: number;
  height: number;
  borderRadius: number;
  fontSize?: number;
}

export function MediaPoster({
  posterPath,
  fallbackLabel,
  fallbackColors,
  width,
  height,
  borderRadius,
  fontSize,
}: MediaPosterProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!posterPath || error) {
    return (
      <PosterPlaceholder
        label={fallbackLabel}
        colors={fallbackColors}
        width={width}
        height={height}
        borderRadius={borderRadius}
        fontSize={fontSize}
      />
    );
  }

  return (
    <View style={{ width, height, borderRadius, overflow: 'hidden' }}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            width,
            height,
            backgroundColor: '#2A2A2A',
            borderRadius,
          }}
        />
      )}
      <Image
        source={{ uri: getPosterUrl(posterPath, 'w342') }}
        style={{ width, height, borderRadius }}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
}
