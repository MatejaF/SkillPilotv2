import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  return (
     <View style={styles.container}>
      <Text style={{fontSize: 36, color: '#000', marginBottom: 40}}>Mateja Ferk</Text>
       <Image
               source={require('../../assets/images/avatar_female.png')}
               style={styles.logo}
               resizeMode="contain"
             />
         <TextInput
           style={styles.input}
           placeholder="Gmail"
           autoCapitalize="none"
         />
         <TextInput
           style={styles.input}
           placeholder="Geslo"
           secureTextEntry={true}
           autoCapitalize="none"
         />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#f1e4f3ff',
     alignItems: 'center',
     justifyContent: 'center',
     padding: 30,
   },
   input: {
     backgroundColor: '#fff',
     borderRadius: 8, 
     padding: 12,
     fontSize: 16,
     width: '100%',
   },
   button: {
     backgroundColor: 'transparent',
     paddingVertical: 12,
     paddingHorizontal: 10,
     borderRadius: 8,
   },
   buttonText: {
     fontSize: 18,
     color: '#fff',
     textAlign: 'center',
   },
   gradientBorder: {
     width: '90%',
     borderRadius: 10,
     padding: 2,
     marginBottom: 20,
   },
   logo: {
     width: 150,
     height: 150,
     marginBottom: 40,
   },
 });