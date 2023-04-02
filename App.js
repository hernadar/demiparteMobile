import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import Confirm from './screens/Confirm'
import QRscanner from './screens/QRscanner'
import Login from './screens/Login'
import Change from './screens/Change'
import { Image } from 'react-native-svg';
import Logo from './assets/img/demiparte.png'
const Stack = createNativeStackNavigator();

function App() {

  function LogoTitle() {
    return (
      <Image
        style={{ width: 50, height: 50 }}
        source={require('./assets/img/demiparte.png')}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >  
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home} options={{ title:'demiparte' }}/>
        <Stack.Screen name="Confirmar" component={Confirm} />
        <Stack.Screen name="Recibir QR" component={QRscanner} />
        <Stack.Screen name="Canjear" component={Change} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;