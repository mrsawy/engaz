import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";

import { HomeRoot } from "./HomeRoutes";
import { MyOrdersRoot } from "./MyOrdersRootProvider";
import ProfileRoot from "./ProfileRoot";
import ServicesRoot from "./ServicesRoot";

const TabNavigatorDashboardRightUserStack = createBottomTabNavigator();
const TabNavigatorDashboardLeftUserStack = createBottomTabNavigator();
/* 
 tabBarContainer: {
        justifyContent: "center",
      },
*/

const TabNavigatorDashboardRightUser = () => {
  return (
    <TabNavigatorDashboardRightUserStack.Navigator
      initialRouteName="Home"
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
      <TabNavigatorDashboardRightUserStack.Screen
        name="Profilee"
        component={ProfileRoot}
        options={{
          tabBarLabel: "حسابي",
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="font-awesome" size={22} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightUserStack.Screen
        name="MyOrder"
        component={MyOrdersRoot}
        options={{
          tabBarLabel: "طلباتي",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightUserStack.Screen
        name="AddServices"
        component={ServicesRoot}
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                backgroundColor: focused ? "#b27921" : "#D3A257",
                borderColor: "#2A2A2A",
                borderWidth: 5,
                bottom: 0,
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
              }}
            >
              <View
                style={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 60 / 2,
                  paddingTop: 9,
                }}
              >
                <Icon name="plus" type="feather" size={30} color={"#fff"} />
              </View>
            </View>
          ),
        }}
      />
      <TabNavigatorDashboardRightUserStack.Screen
        name="Service"
        component={ServicesRoot}
        options={{
          tabBarLabel: "الخدمات",
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="font-awesome" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardRightUserStack.Screen
        name="Home"
        component={HomeRoot}
        options={{
          tabBarLabel: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="font-awesome" size={25} color={color} />
          ),
        }}
      />
    </TabNavigatorDashboardRightUserStack.Navigator>
  );
};
const TabNavigatorDashboardLeftUser = () => {
  return (
    <TabNavigatorDashboardLeftUserStack.Navigator
      initialRouteName="Home"
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
      <TabNavigatorDashboardLeftUserStack.Screen
        name="Profilee"
        component={ProfileRoot}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="font-awesome" size={22} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftUserStack.Screen
        name="MyOrder"
        component={MyOrdersRoot}
        options={{
          tabBarLabel: "My Orders",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftUserStack.Screen
        name="AddServices"
        component={ServicesRoot}
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                backgroundColor: focused ? "#b27921" : "#D3A257",
                borderColor: "#2A2A2A",
                borderWidth: 5,
                bottom: 0,
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
              }}
            >
              <View
                style={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 60 / 2,
                  paddingTop: 9,
                }}
              >
                <Icon name="plus" type="feather" size={30} color={"#fff"} />
              </View>
            </View>
          ),
        }}
      />
      <TabNavigatorDashboardLeftUserStack.Screen
        name="Service"
        component={ServicesRoot}
        options={{
          tabBarLabel: "Services",
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="font-awesome" size={20} color={color} />
          ),
        }}
      />
      <TabNavigatorDashboardLeftUserStack.Screen
        name="Home"
        component={HomeRoot}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="font-awesome" size={25} color={color} />
          ),
        }}
      />
    </TabNavigatorDashboardLeftUserStack.Navigator>
  );
};

export { TabNavigatorDashboardRightUser, TabNavigatorDashboardLeftUser };
