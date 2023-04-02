import * as React from 'react';
import {useEffect, useState} from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import styles from './../styles/Style';
import bcrypt from "bcryptjs-react";



function Login({ navigation }) {
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});

    const errors = {
        email: "Usuario no registrado",
        password: "Password incorrecto"
    };
    // Trae Usuarios de la DB
    const getUsers = async () => {
        try {
          const response = await fetch('http://192.168.100.2:3001/api/users');
          const users = await response.json();
            
          setUsers(users.data);
          console.log(users)
          
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

// Generate JSX code for error message
const renderErrorMessage = (name) =>
name === errorMessages.name && (
    <Text style={styles.error} >{errorMessages.message}</Text>
 );

 // Validacion de Usuario
const validateUser= () => {

// Find user login info
const userData = users.find((user) => user.email === email);

if (userData) {
  console.log('encontró el usuario');
    if (bcrypt.compareSync(toString(password), userData.password)) {
     
       console.log('Validó bien el usuario')
        navigation.navigate('Home', {
          userLoggedId: userData.id,
          privileges_id: userData.privileges_id
        })
        } else {
            // Invalid password
            setErrorMessages({ name: "password", message: errors.password });
        }
    } else {
        // Username not found
        setErrorMessages({ name: "email", message: errors.email });
    }
}

    useEffect(() => {
        getUsers();
      }, []);



    return (
    <View style={styles.container}>
      
        {isLoading ? (
        <ActivityIndicator />
      ) : ( <>
            <Text>Email</Text>
            <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="carlos.sanchez@gmail.com"
            keyboardType='email-address'
            />
             <View>
             {renderErrorMessage("email")}
            </View>

            <Text>Contraseña</Text>
            <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="*************"
            secureTextEntry={true}
            />
             <View>
             {renderErrorMessage("password")}
            </View>
            <Button
            title="Iniciar Sesion"
            onPress={() => validateUser()}
            icon={{ ...styles.iconButtonHome, name: 'login' }}
            iconContainerStyle={styles.iconButtonHomeContainer}
            titleStyle={styles.titleButtonHome}
            buttonStyle={styles.buttonHome}
            containerStyle={styles.buttonHomeContainer}
            />
            </>
      )}
    </View>
    );
}

export default Login