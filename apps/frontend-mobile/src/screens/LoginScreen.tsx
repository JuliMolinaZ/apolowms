// src/screens/LoginScreen.tsx
import React, { useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Image,
} from "react-native";
import {
  Card,
  Input,
  Button,
  Text,
  Icon,
  Layout,
} from "@ui-kitten/components";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");
const PersonIcon = (props: any) => <Icon {...props} name="person-outline" />;
const LockIcon   = (props: any) => <Icon {...props} name="lock-outline" />;

type LoginNavProp = NavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const { setIsAuthenticated } = useContext(AuthContext);

  // Para demo, dejamos inputs vacíos si quieres, o pre-llenados
  const [username, setUsername] = React.useState("demo-user");
  const [password, setPassword] = React.useState("demo-pass");

  const handleLogin = () => {
    // Demo mode: ignora credenciales y avanza
    setIsAuthenticated(true);
    // opcional: navegar al dashboard
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/burbujas.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <Layout style={styles.overlay} />
        <View style={styles.center}>
          <Image
            source={require("../../assets/Apoloware.svg")}
            style={styles.logo}
          />
          <Card style={styles.card}>
            <Text category="h4" style={styles.title}>
              Login
            </Text>


            <Input
              placeholder="Username"
              accessoryLeft={PersonIcon}
              value={username}
              onChangeText={setUsername}
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

            <Button style={styles.button} onPress={handleLogin}>
              Login
            </Button>

            <Button
              appearance="ghost"
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
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
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: "contain",
  },
  card: {
    width: width * 0.9,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    elevation: 8,
  },
  title: { textAlign: "center", marginBottom: 8 },
  note: { textAlign: "center", marginBottom: 24, color: "#666" },
  input: { marginVertical: 8 },
  button: { marginTop: 16 },
  link: { marginTop: 12 },
});
