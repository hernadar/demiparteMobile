import { StyleSheet } from 'react-native';
import { Directions } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        fontFamily: 'TiltNeon',
        alignItems: 'center', 
        justifyContent: 'center',
        
    },
    container1: { 
  
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 10,
        
    },
    container2: { 
        
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 10,
       
    },
    container3: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 10,
        
        maxWidth: '95%',   // <-- Max width is 80%
        minHeight: 20,     // <-- Min height is 20
        padding: 10,
    },
    container4: { 
        width: '40%',   // <-- Max width is 80%
        minHeight: 20,     // <-- Min height is 20
    },
    iconButtonHomeContainer: { marginRight: 10 },
    iconButtonHome: {
        type: 'material',
        size: 50,
        color: 'white',
    },
    titleButtonHome: { 
        fontWeight: '700', 
        fontSize: 25 
    },
    buttonHome: {
        backgroundColor: '#FFB333',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 50,
        height: 80,
    },
    buttonConfirm: {
        backgroundColor: '#FFB333',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 20,
        height: 40,
    },
    buttonHomeContainer: {
        width: 300,
        marginHorizontal: 50,
        marginVertical: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width:340,
        borderRadius:12,
      },
    error:{
        color: 'red'
    },
    
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    
    card: {
        elevation: 5,
        backgroundColor:'#ffffff',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius:6,
        width: 100,
        marginHorizontal: 5,
        padding: 10,
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: 'TiltNeon',
    },
    buttonProducts: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'}
});

export default styles;