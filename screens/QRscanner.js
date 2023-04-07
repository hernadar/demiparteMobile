import React, {useEffect,useState} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import styles from './../styles/Style'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';


   


function QRscanner() {

    const [qrValue, setQrValue] = useState('')
    const [isLoading, setLoading] = useState(true);
    const [light, setLight] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [recommendations, setRecommendations] =useState([])
    const [search, setSearch] =useState(false)
    const [recommendationFinded, setRecommendationFinded] =useState(false)

    //Función que busca en la DB todas las recomendacioenes
    const getRecommendations = async () => {
        try {
          console.log('Busco todas las recomendaciones en la BD')
          const response = await fetch('https://demiparte.com.ar/api/users/recommendation');
          const recommendations = await response.json();
          console.log(recommendations)
          //cargo en la variable recommendations las recomendacioones y habilito el scaneo de QR  
          setRecommendations(recommendations.data);
          setLoading(false)
        } catch (error) {
          console.error(error);
        } finally{
            setLoading(false);
        }     
}

// Inicio llamando a la función que busca en DB todas las recomendaciones
useEffect(() => {
    getRecommendations();
  }, []);


const recommendationFind = (data) =>{
    
    console.log(data)
    const recommendationData = recommendations.find((recomendation) => recomendation.code === data);
    if (recommendationData) {
        console.log('la recomendacion existe y debo cambiar su estado a presentada')
        setRecommendationFinded(true)
        setSearch(true)
        changeRecommendation(recommendationData)
    } else {
        console.log('recomendacion no encontrada')
        setShowDialog(true)
    }
}

const changeRecommendation = async (recommendationData) => {
    try {
       
      const response = await fetch('https://demiparte.com.ar/api/users/recommendation/updatePresentar/' + recommendationData.id,
      {
        method: 'POST',
       
    });
      const recommendation = await response.json();
      setShowDialog(true)  
      
    } catch (error) {
      console.error(error);
    } finally{
        setLoading(false);
    }   
}

    return (
    <View style={styles.container}>
      
         {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>          
            <QRCodeScanner
            ref={(node) => { this.scanner = node }}
            onRead={(e) => {
                
                setQrValue(e.data)
                let data = e.data
                recommendationFind(data)
                
            }}
            flashMode={light ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.auto}
            topContent={<></>}
            bottomContent={
                <Button
                    title={`Flash ${light ? 'OFF' : 'ON'}`}
                    icon={{ ...styles.iconButtonHome, size: 20, name: 'qr-code-scanner' }}
                    iconContainerStyle={styles.iconButtonHomeContainer}
                    titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
                    buttonStyle={{...styles.buttonHome, height: 50}}
                    containerStyle={{...styles.buttonHomeContainer, marginTop:20, marginBottom:10}}
                    // onPress={() => {this.scanner.reactivate()}}
                    onPress={() => {setLight(!light)}}
                />}
            />
            
        </>
        )}
        <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Scanned QR:"/>
            {search && (<Text style={{color:'#000', fontSize: 25}}>
                            Recomendación Aceptada
                        </Text>)}
            {!search && (<Text style={{color:'#000', fontSize: 25}}>
                          Recomendación No encontrada
                        </Text>)}            
            <Dialog.Actions>
                <Dialog.Button title="Escanear otra" onPress={() => {
                    this.scanner.reactivate()
                    setShowDialog(false)
                }}/>
            </Dialog.Actions>
        </Dialog>
    </View>
    );
}

export default QRscanner