import React from 'react';
import { NavigationContainer , DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesProvider } from './src/context/FavoritesContext'; // <-- Importar

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔗 CONFIGURACIÓN DE DEEP LINKING
const linking = {
  prefixes: ['cinefolio://', 'https://cinefolio.app'],
  config: {
    screens: {
      Explorar: {
        screens: {
          Home: '',
          Details: 'movie/:movieId', // ← Ruta para deep links: cinefolio://movie/123
        },
      },
      Búsqueda: {
        screens: {
          Search: 'search',
          Details: 'movie/:movieId', // ← También permite llegar a Details desde Search
        },
      },
      Favoritos: {
        screens: {
          Favorites: 'favorites',
          Details: 'movie/:movieId', // ← También permite llegar a Details desde Favorites
        },
      },
    },
  },
};

// 🎨 Tema oscuro para consistencia visual
const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#141414',
    card: '#1f1f1f',
    text: '#fff',
    border: '#333',
    primary: '#E50914',
  },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: '#141414' }, 
      headerTintColor: '#fff' 
    }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalles' }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: '#141414' }, 
      headerTintColor: '#fff' 
    }}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalles' }} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: '#141414' }, 
      headerTintColor: '#fff' 
    }}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalles' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider> {/* <-- Envolver todo con el Provider */}
      <NavigationContainer linking={linking} theme={DarkTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { backgroundColor: '#141414', borderTopColor: '#333' },
            tabBarActiveTintColor: '#E50914',
            tabBarInactiveTintColor: '#aaa',
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Explorar') iconName = 'home';
              else if (route.name === 'Búsqueda') iconName = 'search';
              else if (route.name === 'Favoritos') iconName = 'heart';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Explorar" component={HomeStack} />
          <Tab.Screen name="Búsqueda" component={SearchStack} />
          <Tab.Screen name="Favoritos" component={FavoritesStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}