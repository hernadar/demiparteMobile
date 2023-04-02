import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import Confirm from './screens/Confirm'
import QRscanner from './screens/QRscanner'
import Login from './screens/Login'
import Change from './screens/Change'
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">  
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home} options={{ title: 'demiparte' }}/>
        <Stack.Screen name="Confirmar" component={Confirm} />
        <Stack.Screen name="Recibir QR" component={QRscanner} />
        <Stack.Screen name="Canjear" component={Change} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;