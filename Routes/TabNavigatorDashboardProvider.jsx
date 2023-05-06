import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";

import { HomeRootProvider } from "./HomeRoutes";
import { MyOrdersRootProvider } from "./MyOrdersRootProvider";
import OffersRoot from "./OffersRoot";
import ProfileRoot from "./ProfileRoot";

const TabNavigatorDashboardRightProviderStack = createBottomTabNavigator();
const TabNavigatorDashboardLeftProviderStack = createBottomTabNavigator();

const TabNavigatorDashboardRightProvider = () => {
  return (
    <TabNavigatorDashboardRightProviderStack.Navigator
      initialRouteName="HomeProvider"
      screenOptions={{
        tabBarActiveTintColor: "#D3A257",
        tabBarInactiveTintColor: "#a3a3a3",
        tabBarStyle: {
          height: 55,
          backgroundColor: "#2A2A2A",
        },
        tabBarLabelStyle: {
          fontFamily: "Medium",
          fontSize: 12,
          marginBottom: 2,
          marginTop: -4,
        },
        headerShown: false,
      }}
    >
      <TabNavigatorDashboardRightProviderStack.Screen
        name="Profilee"
        component={ProfileRoot}
        options={{
          tabBarLabel: "حسابي",
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="font-awesome" size={22} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightProviderStack.Screen
        name="OffersProvider"
        component={OffersRoot}
        options={{
          tabBarLabel: "عروضي",
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="font-awesome" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightProviderStack.Screen
        name="MyOrder"
        component={MyOrdersRootProvider}
        options={{
          tabBarLabel: "اخر الطلبات",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightProviderStack.Screen
        name="HomeProvider"
        component={HomeRootProvider}
        options={{
          tabBarLabel: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="font-awesome" size={25} color={color} />
          ),
        }}
      />
    </TabNavigatorDashboardRightProviderStack.Navigator>
  );
};
const TabNavigatorDashboardLeftProvider = () => {
  return (
    <TabNavigatorDashboardLeftProviderStack.Navigator
      initialRouteName="HomeProvider"
      screenOptions={{
        tabBarActiveTintColor: "#D3A257",
        tabBarInactiveTintColor: "#a3a3a3",
        tabBarStyle: {
          height: 55,
          backgroundColor: "#2A2A2A",
        },
        tabBarLabelStyle: {
          fontFamily: "Medium",
          fontSize: 12,
          marginBottom: 2,
          marginTop: -4,
        },
        headerShown: false,
      }}
    >
      <TabNavigatorDashboardLeftProviderStack.Screen
        name="Profilee"
        component={ProfileRoot}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="font-awesome" size={22} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftProviderStack.Screen
        name="OffersProvider"
        component={OffersRoot}
        options={{
          tabBarLabel: "My Offers",
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="font-awesome" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftProviderStack.Screen
        name="MyOrder"
        component={MyOrdersRootProvider}
        options={{
          tabBarLabel: "Last Orders",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftProviderStack.Screen
        name="HomeProvider"
        component={HomeRootProvider}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="font-awesome" size={25} color={color} />
          ),
        }}
      />
    </TabNavigatorDashboardLeftProviderStack.Navigator>
  );
};

export {
  TabNavigatorDashboardLeftProvider,
  TabNavigatorDashboardRightProvider,
};
