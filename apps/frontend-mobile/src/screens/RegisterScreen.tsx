// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { Card, Input, Button, Text, Icon, Layout } from '@ui-kitten/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { AuthContext } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Icon placeholders (if quieres íconos junto a los inputs)
const PersonIcon = (props: any) => <Icon {...props} name="person-outline" />;
const EmailIcon = (props: any) => <Icon {...props} name="email-outline" />;
const LockIcon = (props: any) => <Icon {...props} name="lock-outline" />;

type RegisterNavProp = NavigationProp<RootStackParamList, 'Register'>;

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const {
    /* opcional: puedes auto-login tras registrarte */
  } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }

      Alert.alert('Success', 'You can now log in');
      navigation.navigate('Login');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/burbujas.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <Layout style={styles.overlay} />

        <View style={styles.center}>
          {/* Logo arriba */}
          <Image
            source={require('../../assets/Apoloware.svg')}
            style={styles.logo}
          />

          <Card style={styles.card}>
            <Text category="h4" style={styles.title}>
              Sign Up
            </Text>

            <Input
              placeholder="Username"
              accessoryLeft={PersonIcon}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            <Input
              placeholder="Email"
              accessoryLeft={EmailIcon}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <Input
              placeholder="Password"
              accessoryLeft={LockIcon}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            {error && (
              <Text status="danger" style={styles.error}>
                {error}
              </Text>
            )}

            <Button
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Button
              appearance="ghost"
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Back to Login
            </Button>
          </Card>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  card: {
    width: width * 0.9,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 12,
  },
  error: {
    textAlign: 'center',
    marginTop: 8,
  },
});
