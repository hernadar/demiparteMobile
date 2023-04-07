import React, {useEffect,useState} from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import styles from './../styles/Style'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { FlatList } from 'react-native-gesture-handler';


function Confirm( { navigation, route } ) {
    const { userLoggedId, privileges_id } = route.params
    console.log('el usuario Logueado en Confimar es: '+ userLoggedId)
    const [qrValue, setQrValue] = useState('')
    const [userId, setUserId] = useState('')
    const [recommendationId, setRecommendationId] = useState('')
    const [isLoading, setLoading] = useState(true);
    const [light, setLight] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [recommendations, setRecommendations] =useState([])
    const [search, setSearch] =useState(false)
    const [recommendationsPending, setRecommendationsPending] =useState([])
    const [searchPending, setSearchPending] =useState(false)

   
   

//Función que busca en la DB todas las recomendaciones
    const getRecommendations = async () => {
        try {
          
          const response = await fetch('https://demiparte.com.ar/api/users/recommendation');
          const recommendations = await response.json();
            
          setRecommendations(recommendations.data);
        } catch (error) {
          console.error(error);
        } finally{
            setLoading(false);
        }     
}
//Busco en la BD todas las recomendaciones

useEffect(() => {
    getRecommendations();
  }, []);

// Función que busca la reccomendación escaneada dentro de todas las
// recomendaciones
// Si la encuentra almacena la recomendación en la variable recommendationData
//Para luego llamar a la función changeRecommendation para buscar las recomendaciones
// a cambiar
const recommendationFind = (data) =>{
    
    const recommendationData = recommendations.find((recomendation) => recomendation.code === data);
    if (recommendationData) {
        console.log('la recomendacion existe y debo cambiar su estado a confirmada')
        setRecommendationId(recommendationData.id)
        setUserId(recommendationData.users_id)
        setSearch(true)
        changeRecommendation(recommendationData)
    } else {
        console.log('recomendacion no encontrada')
        setShowDialog(true)
    }
}
// Esta función toma la recomendación a modificar y busca en la DB, las 
//recomendaciones con estado pendiente de confirmación 
const changeRecommendation = async (recommendationData) => {
    try {
      
      const response = await fetch('https://demiparte.com.ar/api/users/'+ recommendationData.users_id + '/recommendation/pending',
      {
        method: 'GET',
       
    });
      const recomendacionesPendientes = await response.json();
            
      if (recomendacionesPendientes.data.length != 0){
       
      setRecommendationsPending(recomendacionesPendientes.data)
      setSearchPending(true)
    } else {
       // Si no hay recomendaciones pendientes, muestro dialogo informando
        setShowDialog(true)
    } 
    
    } catch (error) {
      console.error(error);
    } finally{
        setLoading(false);
    }   
}

const update= async(e, id) => {
 console.log('Tengo el Id: ' + id)

 setLoading(true)

    try {
          
        const response = await fetch('https://demiparte.com.ar/api/users/' + userId + '/recommendation/' + recommendationId + '/confirm/' + id,
        {
            method: 'POST',
           
        });
        
        const recommendations = await response.json();
        setLoading(false)  
        setShowDialog(true)
      } catch (error) {
        console.error(error);
      } finally{
          setLoading(false);
      }     
}



const table = ()=>{

const item = ({item}) =>{


return(
    <View style={{flexDirection:'row'}}>
        <View style={{width:30, marginVertical:10}}>
            <Text>{item.id} </Text>
        </View>
        <View style={{width:100, marginVertical:10}}>
            <Text>{item.dateCreate} </Text>
        </View>
        <View style={{width:80, marginVertical:10}}>
            <Text>{item.companies_name} </Text>
        </View>
        <View style={{width:70, marginVertical:10}}>
            <Text>{item.status_name} </Text>
        </View>
        <View style={{width:100, marginVertical:10}}>
            <Button buttonStyle={styles.buttonConfirm} onPress={(e)=>update(e, item.status_id)}>Confirmar</Button>
        </View>

    </View>
)    
}   
return(   
    <View style={{felx:1, justifyContent:'center', alignItems:'center', marginTop:'10%'}}> 
        <View style={{flexDirection:'row'}}>
        <View style={{width:20}}>
            <Text>#</Text>
        </View>
        <View style={{width:100,}}>
            <Text>Fecha de Presentación</Text>
        </View>
        <View style={{width:80}}>
            <Text>Empresa</Text>
        </View>
        <View style={{width:50}}>
            <Text>Estado</Text>
        </View>
        <View style={{width:100,  alignItems:'center' }}>
            <Text>Acción</Text>
        </View>
    </View>
        <FlatList
            data={recommendationsPending}
            renderItem={item}
            keyExtractor={(item, index)=>index.toString()}
        />
       
    </View> 
)
}
console.log(recommendationsPending)

    return (
    <View>
        
        {(searchPending) &&
            <>
            {table()}

            </>}
         {isLoading ? (
        <ActivityIndicator />
      ) : (<>
        {recommendationsPending.length === 0 && 
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
                />
            }
        />
        }</>
        )}
        

 
    
        
        
        <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Scanned QR:"/>
           
             {(recommendationsPending.length !=0) ? (<Text style={{color:'#000', fontSize: 25}}>
                        Recomendación Confirmada
                        </Text>)
            :(<Text style={{color:'#000', fontSize: 25}}>
                        Todas la recomendaciones ya fueron confirmadas
                        </Text>)}     


            <Dialog.Actions>
                <Dialog.Button title="Volver" onPress={() => {
                    navigation.navigate('Home', {
                        userLoggedId: userLoggedId,
                        privileges_id: privileges_id
                      })
                    setShowDialog(false)
                }}/>
            </Dialog.Actions>
        </Dialog>
    </View>
    );
}

export default Confirm