import * as React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { Button } from '@rneui/themed';
import styles from './../styles/Style'


function Home({ navigation, route }) {

    const { userLoggedId, privileges_id } = route.params

    console.log('El usuario logueado en Home es:' + userLoggedId)

    return (
        <View style={styles.container}>

            <Image
                style={styles.logo}
                source={require('../assets/img/demiparte.png')}
            />
            <>
                <Button
                    title="Recibir QR"
                    onPress={() => navigation.navigate('Recibir QR',)}
                    icon={{ ...styles.iconButtonHome, name: 'qr-code-scanner' }}
                    iconContainerStyle={styles.iconButtonHomeContainer}
                    titleStyle={styles.titleButtonHome}
                    buttonStyle={styles.buttonHome}
                    containerStyle={styles.buttonHomeContainer}
                />

                {(privileges_id === 2 || privileges_id === 3) &&
                    <>
                        <Button
                            title="Confirmar"
                            onPress={() => navigation.navigate('Confirmar', {
                                userLoggedId: userLoggedId,
                                privileges_id: privileges_id
                            })}
                            icon={{ ...styles.iconButtonHome, name: 'check' }}
                            iconContainerStyle={styles.iconButtonHomeContainer}
                            titleStyle={styles.titleButtonHome}
                            buttonStyle={styles.buttonHome}
                            containerStyle={styles.buttonHomeContainer}
                        />
                        <Button
                            title="Canjear"
                            onPress={() => navigation.navigate('Canjear', {
                                userLoggedId: userLoggedId,
                                privileges_id: privileges_id
                            })}
                            icon={{ ...styles.iconButtonHome, name: 'redeem' }}
                            iconContainerStyle={styles.iconButtonHomeContainer}
                            titleStyle={styles.titleButtonHome}
                            buttonStyle={styles.buttonHome}
                            containerStyle={styles.buttonHomeContainer}
                        />
                    </>}

            </>

        </View>
    );
}

export default Home