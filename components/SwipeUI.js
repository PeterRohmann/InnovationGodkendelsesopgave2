import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
//højde og bredde så det passer til forskellige skærmstørrelser
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

//billeder der swipes igennem.
const Users = [
  { id: "1", uri: require('../assets/1.jpg') },
  { id: "2", uri: require('../assets/2.jpg') },
  { id: "3", uri: require('../assets/3.jpg') },
  { id: "4", uri: require('../assets/4.jpg') },
  { id: "5", uri: require('../assets/5.jpg') },
]

export default class SwipeUI extends React.Component {

    
    constructor() {
      super()
  // her sikrer man at det kun er det øverste billede der roteres, dragges og animeres
  // benyttes nede i animation.view
      this.position = new Animated.ValueXY()
      this.state = {
        currentIndex: 0
      }
  
      this.rotate = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
        outputRange: ['-30deg', '0deg', '10deg'],
        extrapolate: 'clamp'
      })
  
      this.rotateAndTranslate = {
        transform: [{
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
        ]
      }
  //opacity er gennemsigtighed, og det bliver gradvist mere gennemsigtigt jo mere man dragger til højre eller venstre
      this.likeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })
      this.dislikeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
      })
  
      this.nextCardOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
      })
      this.nextCardScale = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp'
      })
  
    }
    //Panresponder benyttes til at dragge, animere og rotere billederne, så det føles som tinder
    UNSAFE_componentWillMount() {
      this.PanResponder = PanResponder.create({
  
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
  
          this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
        },
        // her går den videre til næste billede hvis man draggede langt nok
        onPanResponderRelease: (evt, gestureState) => {
  
          if (gestureState.dx > 120) {
            Animated.spring(this.position, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
              useNativeDriver: true 
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
              })
            })
          }
          else if (gestureState.dx < -120) {
            Animated.spring(this.position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
              useNativeDriver: true 
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
              })
            })
          }
          //hvis ikke man draggede langt nok går den tilbage til startpositionen.
          else {
            Animated.spring(this.position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              friction: 4
            }).start()
          }
        }
      })
    }
//denne funktion laver en stack som man kan swipe igennem, via pakken animate
// bruger absolute position så billederne stacker, stedet for at være over og under hinanden
    renderUsers = () => {
  
      return Users.map((item, i) => {
  
  
        if (i < this.state.currentIndex) {
          return null
        }
        else if (i == this.state.currentIndex) {
  
          return (
            <Animated.View
            // her tilføjes animationen til kun det første index
              {...this.PanResponder.panHandlers}
              key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>
                
              <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
  
              </Animated.View>
  
              <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
  
              </Animated.View>
  
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={item.uri} />
  
            </Animated.View>
          )
        }
        else {
          return (
            <Animated.View
  
              key={item.id} style={[{
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
                height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
                
              }]}>
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
  
              </Animated.View>
  {/*her tilføjes like og nope med tilhørende fonts mm.*/}
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
  
              </Animated.View>
  
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={item.uri} />
  
            </Animated.View>
          )
        }
        // hvis man ikke bruger reverse ville det først index være det sidste billede. Derfor bruges reverse()
      }).reverse()
    }
  
//viser renderUsers funktionen
    render() {
      return (
        <View style={{ flex: 1 }}>
            
          <View style={{ height: 60 }}>
  
          </View>
          <View style={{ flex: 1 }}>
            {this.renderUsers()}
          </View>
          <View style={{ height: 60 }}>
  
          </View>
  
  
        </View>
  
      );
    }
  }

  