// src/screens/AboutScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App Intro */}
      <Text style={styles.title}>What is Contro? 🤔</Text>
      <Text style={styles.description}>
        Are your friends not returning your money? Now they will! 💸
        With Contro, you can keep reminding them, track all your group spending,
        and make sure nobody forgets their dues again.
      </Text>

      <Text style={styles.highlight}>
        Contro = Contribution 💰
      </Text>
      <Text style={styles.description}>
        It’s short slang for contribution of money in a group — like trips, parties,
        or any event where everyone pitches in. Contro helps you track who paid what,
        who still owes, and keeps everything fair and transparent.
      </Text>

      {/* Quick Contro Section */}
      <Text style={styles.title}>Quick Contro ⚡ (Guest Mode)</Text>
      <Text style={styles.description}>
        Sometimes you just need to split money instantly, without creating an account
        or logging in. That’s exactly why Quick Contro exists!
      </Text>

      <View style={styles.features}>
        <Text style={styles.feature}>• Split bills in seconds ⏱️</Text>
        <Text style={styles.feature}>• Add up to 50 people 👥</Text>
        <Text style={styles.feature}>• Choose between Equal Split or Custom Split 🎯</Text>
        <Text style={styles.feature}>• Add notes for each person (like cash, UPI, pending) 📝</Text>
        <Text style={styles.feature}>• Real-time progress bar shows if your total matches 💡</Text>
        <Text style={styles.feature}>• Instantly generate & share a stylish PDF invoice 📄</Text>
      </View>

      <Text style={styles.description}>
        Perfect for road trips, parties, or random hangouts where you just want a quick fix.
        No signup, no hassle — just open → add → split → done!
      </Text>

      <Text style={styles.description}>
        ⚠️ Heads up: Quick Contro is temporary. Once you exit, your data is gone.
        Want to save all your records? Sign up and unlock the full Contro experience!
      </Text>

      {/* About Developer */}
      <Text style={[styles.title, { marginTop: 30 }]}>About the Developer 👨🏻‍💻</Text>
      <Text style={styles.description}>
        Hi, I’m Abhishek Sharma. I built Contro because I’ve seen too many friendships
        turn into “who paid what?” arguments 😅. This app is all about making
        money-sharing in groups simple, fair, and even fun.
      </Text>

      <View style={styles.links}>
        <Text style={styles.link} onPress={() => Linking.openURL('mailto:abhishekanandsharma99@gmail.com')}>
          Gmail
        </Text>
        <Text style={styles.separator}> | </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/Abhishekk29')}>
          GitHub
        </Text>
        <Text style={styles.separator}> | </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://linkedin.com/in/abhisheksharmaendl')}>
          LinkedIn
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181717ff',
    paddingVertical: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  highlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#089babff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  features: {
    alignItems: 'flex-start',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  feature: {
    fontSize: 15,
    color: '#fff',
    marginVertical: 5,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  link: {
    color: '#089babff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  separator: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 5,
  },
});
