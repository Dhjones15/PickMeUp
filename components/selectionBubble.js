import React from 'react';
import {MaterialIcons} from '@expo/vector-icons';

const Bubble = (props) => {



    var bubble;
    if (props.type===true){
        bubble =
        <MaterialIcons name= 'circle'/>
    }
    else {
        bubble =
        <MaterialIcons name= 'panorama-fish-eye'/>
    }
    return bubble;

}
export default Bubble;