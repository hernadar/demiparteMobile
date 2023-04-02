import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Button, Dialog } from '@rneui/themed';
import styles from '../styles/Style'
import { RNCamera } from 'react-native-camera';

import { FlatList } from 'react-native-gesture-handler';
import { color } from '@rneui/base';


function Change({ navigation, route }) {

    const { userLoggedId, privileges_id } = route.params
    console.log('El usuario logueado en Canje es:' + userLoggedId)



    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState('')
    const [search, setSearch] = useState(false)
    const [qrValue, setQrValue] = useState('')
    const [light, setLight] = useState(false)
    const [userChange, setUserChange] = useState([])
    const [products, setProducts] = useState([])
    const [PointsSelected, setPointSelected] = useState(0)
    const [productSelected, setProductSelected] = useState([])
    const [excede, setExcede] = useState(false)
    const [found, setFound] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [companyId, setCompanyId] = useState('')
    

  

 

  

    //     //Busco en la BD todos los usuarios

    useEffect(() => {
        // busco de la DB los usuarios
        console.log('Busco los usuarios')
        const usuarios = fetch('http://192.168.100.2:3001/api/users')
            .then(response => response.json())
         // busco de la DB el ID de la empresa asociada al usuario Logueado
         console.log('Busco el Id de la empresa con el usuario legueado: ' + userLoggedId)
        const empresaDelUsuarioLogueado = fetch('http://192.168.100.2:3001/api/users/profile/' + userLoggedId + '/company')
            .then(response => response.json())    

        Promise.all([usuarios, empresaDelUsuarioLogueado]).then(results => {
            // aquí obtenemos un array con los resultados de cada promesa
            const [usuarios, empresaDelUsuarioLogueado] = results
                setUsers(usuarios.data);
                setCompanyId(empresaDelUsuarioLogueado.data);

                setLoading(false);
            })

    }, []);


    const userFind = (data) => {
       
        const userData = users.find((user) => user.password === data);
        if (userData) {
            console.log('El usuario existe y debo canjear sus puntos :')
            setUserChange(userData)
            setUserId(userData.id)
            searchProducts(userData.points)
            setSearch(true)
            // changeRecommendation(recommendationData)
        } else {
            console.log('usuario no encontrado')
            setShowDialog(true)
        }
    }

   
    const searchProducts = async (points) => {
        try {
            console.log('La empresa que canjea es: ' + companyId.companies_id)
            console.log('Los puntos que tiene el usuario son ' + points)
            const response = await fetch('http://192.168.100.2:3001/api/companies/' + companyId[0].companies_id + '/products/change/' + points);
            const products = await response.json();

            setProducts(products.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const productos = () => {
        
        return (
      <> 
                {products.length === 0 && <Text>Cargando...</Text>}
                {products.map((product, i) => {


                    return (
                        

                        <Button buttonStyle={styles.buttonProducts} onPress={() => carrito(product.points, product.name, product.id,product.price )}key={product.id}><View  style={styles.card}>

                            <View >
                                <Text>Puntos: </Text>
                            </View>
                            <View>
                                <Text style={styles.titleButtonHome}>{product.points}</Text>
                            </View> 
                            <View >
                                <Image style={{width: 50, height: 50,  borderRadius: 6 }} source={{uri: product.image}}/>
                                <View >
                                    <Text>{product.name}</Text>
                                </View>
                            </View>
                            
                        </View></Button>

                    )

                })}
               
            </>
         
        )
    }


    const canje = () => {
        return (
            <>
                <View style={styles.container3}>
                <View style={styles.container1}>
                    <Text>Hola, {userChange.name}</Text>
                    <Text>Disponés de </Text><Text style={styles.titleButtonHome} >{userChange.points}</Text><Text > puntos para canjear </Text>
                </View>
                <View style={styles.container2}>
                    <Text>Carrito de Canjes</Text>
                    <Text style={styles.titleButtonHome}>{PointsSelected}</Text>
                    {(productSelected.length !== 0) && 
                        <>
                        {productSelected.map((product, i) => {
                            if(product.productName ==='Dinero'){
                                var mostrar =true
                                var total =total + product.productPrice
                             
                            }

                            return ( <><Text>{product.productName}</Text>
                                    {mostrar &&<Text>$ {product.productPrice}</Text>}</>)
                            })
                        }
                    
                      
                        </>}
                        {(productSelected.length !== 0) && 
                        <>
                         
                                <Text>Total : <Text style={styles.titleButtonHome}>$
                                {productosFiltrados = productSelected.filter((producto,i) =>{
                                       
                                    if(producto.productName === 'Dinero'){
                                        return true
                                    }
                                    
                                }).reduce((acc, producto) => acc += producto.productPrice,0) }</Text></Text>
                        </>}
                    <Text style={styles.titleButtonHome}>Saldo : {userChange.points - PointsSelected}</Text>
                    <Button onPress={() => clearCarrito()} buttonStyle={styles.buttonConfirm}>Vaciar Carrito</Button>
                </View>
                </View>
                <View style={styles.container3}>
                
                        {productos()}
                 
                </View>
                <View style={styles.container3}>
                    <Button onPress={() => confirmarCanje()} buttonStyle={styles.buttonConfirm} >Confirmar Canje</Button>
                </View>
            </>
        )
    }

const carrito = (points, productName, productId, productPrice) => {
   
    var puntos=PointsSelected
    var producto = {
        productId:productId,
        productName:productName,
        productPrice:productPrice
    }
    puntos= puntos + points
    if (puntos > userChange.points) {
        setExcede(true)
        setShowDialog(true)

    } else {
        setProductSelected([...productSelected, producto])
        setPointSelected(puntos)}
    
}
const clearCarrito = () => {
    setProductSelected([])  
    setPointSelected(0)
}
const confirmarCanje = async () =>{
    setLoading(true)
    try {

        const response = await fetch('http://192.168.100.2:3001/api/users/' + userChange.id + '/points/' + (userChange.points - PointsSelected),
        {
            method: 'POST',
           
        });
        const user = await response.json();

        // Armar string con los datos de los productos seleccionados para enviar
       
        const productsJSON = JSON.stringify(productSelected)
        console.log('Este el es JSON de productos:' + productsJSON)
        console.log('esta es el Id de empresa:' + companyId[0].companies_id)
        
        
        const response2 = await fetch('http://192.168.100.2:3001/api/companies/' + companyId[0].companies_id + '/changes/' + userId,
        {
            method: 'POST',
            body: productsJSON,
            headers: {                              // ***
                "Content-Type": "application/json"    // ***
              }     
        });
         const change = await response2.json();
        
        


        setUpdated(true);
        setShowDialog(true);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }

}


    return (
        <View style={styles.container}>
        <ScrollView>
            {(search) &&
                <>
                    {canje()}

                </>}
            {isLoading ? (
                <ActivityIndicator />
            ) : (<>
                {userChange.length === 0 && 
                <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    onRead={(e) => {

                        setQrValue(e.data)
                        let data = e.data
                        userFind(data)

                    }}

                    flashMode={light ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.auto}
                    topContent={<></>}
                    bottomContent={
                        <Button
                            title={`Flash ${light ? 'OFF' : 'ON'}`}
                            icon={{ ...styles.iconButtonHome, size: 20, name: 'qr-code-scanner' }}
                            iconContainerStyle={styles.iconButtonHomeContainer}
                            titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
                            buttonStyle={{ ...styles.buttonHome, height: 50 }}
                            containerStyle={{ ...styles.buttonHomeContainer, marginTop: 20, marginBottom: 10 }}
                            // onPress={() => {this.scanner.reactivate()}}
                            onPress={() => { setLight(!light) }}
                        />
                    }
                />
            
               
                 }
                </>
            )}
<Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#000', fontSize:25}} title="Scanned QR:"/>
            {(userChange.length === 0) && (<Text style={{color:'#000', fontSize: 25}}>
                        Usuario no encontrado
            </Text>)}
            {(excede) && (<Text style={{color:'#000', fontSize: 25}}>
                        Excede la cantidad de puntos disponibles
            </Text>)}
            {(updated) &&(<Text style={{color:'#000', fontSize: 25}}>
                       Puntos descontados
            </Text>)}

            <Dialog.Actions>
            {(userChange.length === 0) && <Dialog.Button title="Volver" onPress={() => {
                    navigation.navigate('Home', {
                        userLoggedId: userLoggedId,
                        privileges_id: privileges_id
                      })
                    setShowDialog(false)
                }}/>}
            {(excede) && <Dialog.Button title="Aceptar" onPress={() => {
                    setExcede(false)
                    setShowDialog(false)
                }}/>}
             {(updated) && <Dialog.Button title="Volver" onPress={() => {
                    setLoading(false)
                    navigation.navigate('Home', {
                        userLoggedId: userLoggedId,
                        privileges_id: privileges_id
                      })
                    setShowDialog(false)
                  
                }}/>}   
            </Dialog.Actions>
        </Dialog>
        </ScrollView>
        </View>

    );
}

export default Change