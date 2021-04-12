import React from 'react';
import {View,Text,StyleSheet} from 'react-native';


const Item = (props) => {
    itemStyle= {
        style: props.status==0 ? styles.complete: styles.active,
    }
    itemRight = {
        style: props.status==0 ? styles.completeRight :styles.activeRight,
    }   
    return (
        <View {...itemStyle}>
            <View style = {styles.itemLeft}>
                <View style = {styles.square}></View>
                <Text> {props.text}</Text>
            </View>
            <View {...itemRight}>   
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    active: {
        backgroundColor: 'white',      
        padding: 15,
        borderRadius: 15,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    complete: {
        backgroundColor: 'darkgray', 
        opacity:.55,     
        padding: 15,
        borderRadius: 15,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,

    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: 'darkblue',
        opacity: .4,
        borderRadius: 5,
        marginRight: 15,
    },
    text: {
        maxWidth: '80%',
    },
    completeRight:{
        width: 12,
        height: 12,
        backgroundColor: 'green',
        borderWidth: 2,
        borderRadius: 5,
    },
    activeRight:{
        width: 12,
        height: 12,
        backgroundColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
    },
  
    input: {
        paddingVertical: 10,
        flex:1,
        paddingHorizontal: 15,
        backgroundColor: 'lime',
        borderRadius: 15,
        borderColor: 'darkgray',
        borderWidth: .5,
      
      },

});
export default Item;

