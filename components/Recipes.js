import React, {useState} from 'react'
import {Button, Text, View, Image} from 'react-native'

// specificerer tekster så koden er mere overskuelig
const text = "Her kan man swipe igennem forskellige opskrifter, som indeholder en eller flere af de ingredienser som du har oprettet. De opskrifter med flest af de ingredienser du har bliver vist først!"
const text2 = ""



const Recipes = () => {
    // bruger active, så jeg kan gemme og vise tekst og opskrifter
    const [active, setActive] = useState(false)
  
    const onPress = () => { setActive(!active) };
//ændrer knappens navn ved active
//ændrer text ved active
// viser billedet kun når setActive er active
    return(
        <View>
        <Button title={active ? "Hide recipes" : "Show recipes"} onPress= {onPress} />
        <Text>{ active ? text : text2}</Text>
        <View>
         { active ? <Image source={require("../assets/opskrift.jpg")} style={{width:350, height:400}} /> : <Image/>}   
        </View>
        
       
    </View>  
    )
}

export default Recipes;