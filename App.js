import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Button } from 'react-native';
import Item from './components/Items';
import Bubble from './components/selectionBubble';
import * as firebase from 'firebase';
import { LogBox, ScrollView } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

LogBox.ignoreLogs(['Setting a timer']);
/* shopping list: https://www.youtube.com/watch?v=00HFzh3w1B8
 */

const firebaseConfig = {
  apiKey: "AIzaSyCEz8GxzN4LSnNZrACF47A6SUlkrdeF1oc",
  authDomain: "pickmeup-fbecf.firebaseapp.com",
  databaseURL: "https://pickmeup-fbecf-default-rtdb.firebaseio.com",
  projectId: "pickmeup-fbecf",
  storageBucket: "pickmeup-fbecf.appspot.com",
  messagingSenderId: "7737174243",
  appId: "1:7737174243:web:c1905c63096431b0c4fdd6",
  measurementId: "G-F1DD1XF1YX"
};

if(!firebase.apps.length){ 
  firebase.initializeApp(firebaseConfig);
}

async function getData(setListItems) {
  firebase
  .database()
  .ref("HEB/")
  .on("value", snapshot => {
    var itemList = [];
    const val = snapshot.val();
    for(const key in val) {
      itemList.push({ key: key,name: val[key].name,status: val[key].status,selected:false});
    }
    setListItems(itemList);
  })
}
function addData(itemName){
  firebase
    .database()
    .ref("HEB/")
    .push().set({
      name:itemName,
      status: 1,
    })
}
function removeData(key) {
  firebase
    .database()
    .ref('HEB/'+key).remove();
}
function removeDataSelection(deleteList) {
  firebase
    .database()
    .ref('HEB/').update(
      deleteList
    );
}
function removeAllData(){
  firebase
    .database()
    .ref('HEB/')
  .remove();
}
function setDataStatus(key,itemStatus) {
  firebase
    .database()
    .ref('HEB/'+key)
    .update({
      status: itemStatus ===1?  0: 1
    }
    );

}
function setDataName(key,name){
  firebase
    .database()
    .ref('HEB/'+key)
    .update({
      name: name
    }
    );
}
export default function App() {

  const [name, setName] = useState()
  const [listItems, setListItems] = useState([]);
  const [currentEditItem, setEditItem] = useState();
  const [selectingState, setSelectingState] = useState(false);

  const [refreshPage,setRefreshPage] = useState("");

  useEffect(()=>{
    getData(setListItems);
  },[]);

  const handleAddItem = () => {
    Keyboard.dismiss();
    if(name===null){return}
    addData(name);
    setName(null)
  }
  const handleDeleteItem = (index) => {
    removeData(listItems[index].key);
  }
  const changeItemStatus = (index) => {
    setDataStatus(listItems[index].key,listItems[index].status);
  }
  const selectEditItem = (index) => {
      if (selectingState=== 1){
        setSelectingState();
      }
      setEditItem(index);
  }
  const changeItemName = (index) => {
    if(name===null){return}
    setDataName(listItems[index].key,name);
    selectEditItem(null);
    setName(null);
  }
  const toggleSelectingState = () => {
    if(selectingState){
      listItems.map((item,index)=>{
        item.selected = false;
      })
      setSelectingState(false);
    }
    else {
      selectEditItem(null);
      setSelectingState(true);
    }
  }
  const changeSelectingState = (index) =>{
    listItems[index].selected = !listItems[index].selected
  }
  const buttonDeleteSelected = () => {
    var obj;
    listItems.map((item)=>{
      if (item.selected){
        obj= {[item.key]: null};
        removeDataSelection(obj);
      }
    })
    console.log(obj.length + listItems.length)
   

  }
  const buttonDeleteAll = () => {
    setSelectingState();
    removeAllData();

  }

  return (
    <View style={styles.container}>

      {/*listWrapper*/}
      <View style = {styles.wrapper}>
        {/*Header*/}
        <View style = {styles.headerWrapper}>
          <Text style = {styles.headerTitle}> Shopping List </Text>
          <TouchableOpacity onPress = {()=>toggleSelectingState()}>
              <View style = {styles.toggle}>
                <MaterialIcons name = 'auto-fix-high' size = {24} />
              </View>
          </TouchableOpacity>
        </View>
        <View style = {styles.headerBottomBorder}/>
        {selectingState &&
        <View style = {styles.hidingSelectButtons}>
          <Button style = {styles.selectButtons} title = 'Delete Selected'onPress= {()=>buttonDeleteSelected()}/>
          <Button style = {styles.selectButtons}title = 'Delete All' onPress = {()=>buttonDeleteAll()}/>
        </View>
        }

        <ScrollView 
          contentContainerStyle = {{
            flexGrow:1          
          }}         
          keyboardShouldPersistTaps='handled'
          >
            <View style = {styles.listWrapper}>
                {
                  listItems.map((item,index) => {
                    const editItem = index==currentEditItem
                  
                    let cell;
                    if (selectingState){
                    
                      cell=
                      <View key = {index} style= {styles.selectWrapper}>
                        <TouchableOpacity onPress= {() =>setRefreshPage(index+item.selected) + changeSelectingState(index)}>
                          <Bubble type = {item.selected}/>
                          <Item text ={item.name} status = {item.status} edit = {editItem}/>
                        </TouchableOpacity>
                      </View>
                    }
                    else{
                    if (index!=currentEditItem){
                      cell=        
                                
                        <TouchableOpacity key={index} onPress={()=> changeItemStatus(index)} onLongPress = {()=>selectEditItem(index)}>
                            <Item text ={item.name} status = {item.status} edit = {editItem}/>
                         </TouchableOpacity>      
                      
                      
                     
                    }
                     else{
                       cell=
                          <View key= {index} style ={styles.itemWrapper}>
                            <TouchableOpacity onPress = {()=> selectEditItem(null)}>
                                <MaterialIcons name = 'chevron-left' size = {30} color = 'blue'/>
                            </TouchableOpacity>                
                            <TextInput style={styles.input} placeholder = {item.name} onChangeText={text => setName(text)} onSubmitEditing={() => changeItemName(index)}/>
                          </View>
                       
                     }
                    }
                     return cell;

                })
                }
            </View>
        </ScrollView>


      </View>

      {/**Add an Item */}
      {(!currentEditItem&&!selectingState)&&
      <KeyboardAvoidingView 

        behavior={Platform.OS ==="ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder= {"Add an Item"} value = {name} onChangeText={text => setName(text)} onSubmitEditing={() => handleAddItem()}/>

      </KeyboardAvoidingView>
      }

      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  wrapper: {
    paddingTop: 60,
    paddingHorizontal: 15,
    paddingBottom:100,
  },
  headerWrapper:{
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  headerTitle: {
    justifyContent:'center',
    fontSize: 24,
    fontWeight: 'bold',
    left: 90,
  },
  toggle:{ 
    alignItems:'flex-end'
   },
   headerBottomBorder:{
    borderColor: 'darkgray',
    borderWidth: .5,
    margin: 2,
  },
   hidingSelectButtons:{
     alignContent: 'stretch',
     flexDirection: 'row',
     justifyContent:'center',
   },

   listWrapper: {
    marginTop: 10,
  },

   selectWrapper:{
     flexDirection:'column',
     alignContent:'center',
   },

  itemWrapper: {
    flexDirection:'row',
    alignItems: 'center'
  },
  writeTaskWrapper: {
    flex:1,
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  
input: {
  paddingVertical: 10,
  flex:1,
  paddingHorizontal: 15,
  backgroundColor: 'white',
  borderRadius: 15,
  borderColor: 'darkgray',
  borderWidth: .5,

},
addWrapper: {

},                
selectedStateIcon:{
  width: 12,
  height: 12,
  borderWidth: 2,
  borderRadius: 5,
  color: 'red',
},
deselectedStateIcon:{
  width: 12,
  height: 12,
  borderWidth: 2,
  borderRadius: 5,
  borderColor: 'green',
},
addText: {},

});
