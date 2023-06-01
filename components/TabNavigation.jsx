import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default TabNavigation = () => {
    return (
        <NavigationContainer>

            <Tab.Navigator>
                <Tab.Screen name='Home' component={HomeScreen} />
                <Tab.Screen name='Profile' component={ProfileScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}

