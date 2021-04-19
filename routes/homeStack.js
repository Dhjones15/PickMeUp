import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import StoreList from '../screens/storeList';
import ShoppingList from '../screens/shoppingList';

const screens = {
    StoreList: {
        screen:StoreList,
        navigationOptions: {
            title: 'PickMeUp',
        }
    },
    ShoppingList: {
        screen:ShoppingList,
    },

}
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);