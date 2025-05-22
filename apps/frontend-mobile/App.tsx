// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar }         from 'expo-status-bar';

// justo después de los imports en App.tsx
console.log('EvaIconsPack:', EvaIconsPack);
console.log('UI Kitten Icon component:', (require('@ui-kitten/components')).Icon);


// UI Kitten
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Contexto y navegadores
import { AuthProvider }      from './src/contexts/AuthContext';
import RootNavigator         from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      {/* 1) Registro del pack de íconos Eva */}
      <IconRegistry icons={EvaIconsPack} />

      {/* 2) Proveedor de tema global (light) */}
      <ApplicationProvider {...eva} theme={eva.light}>
        {/* 3) Contenedor de navegación */}
        <NavigationContainer>
          {/* 4) Estado de autenticación */}
          <AuthProvider>
            {/* 5) Tu root navigator (AuthStack o AppDrawer) */}
            <RootNavigator />
          </AuthProvider>
        </NavigationContainer>
        {/* 6) Barra de estado */}
        <StatusBar style="auto" />
      </ApplicationProvider>
    </>
  );
}
