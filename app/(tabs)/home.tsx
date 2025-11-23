import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import CreateCard from '../../components/create-card';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <CreateCard 
          title="Občinska štipendija Šentilj"
          description="Opis dogodka 1"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Občinska štipendija Šentilj",
                 url: 'https://www.sentilj.si/objava/1162856'
              } 
          })}
        />

        <CreateCard 
          title="Dogodek 2"
          description="Opis dogodka 2"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 2"} 
          })}
        />

        <CreateCard 
          title="Dogodek 3"
          description="Opis dogodka 3"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 3"} 
          })}
        />

        <CreateCard 
          title="Dogodek 4"
          description="Opis dogodka 4"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 4"} 
          })}
        />

        <CreateCard 
          title="Dogodek 5"
          description="Opis dogodka 5"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 5"} 
          })}
        />

        <CreateCard 
          title="Dogodek 6"
          description="Opis dogodka 6"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 6"} 
          })}
        />

        <CreateCard 
          title="Dogodek 7"
          description="Opis dogodka 7"
          onPress={() => router.push({
              pathname: '/information',
              params: { title: "Dogodek 7"} 
          })}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 30,
    backgroundColor: '#25292e',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
