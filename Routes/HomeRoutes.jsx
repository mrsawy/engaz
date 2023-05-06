import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeProvider from "../Screen/HomeProvider";
import MyProfile from "../Screen/MyProfile";
import DetailsAds from "../Screen/DetailsAds";
import Notification from "../Screen/Notification";
import Messages from "../Screen/Messages";
import MessageDetails from "../Screen/MessageDetails";

import Home from "../Screen/Home";

const HomeRootProviderStack = createNativeStackNavigator();
const HomeRootStack = createNativeStackNavigator();
const HomeRootProvider = () => {
  return (
    <HomeRootProviderStack.Navigator
      initialRouteName="HomeProviderr"
      screenOptions={{ headerShown: false }}
    >
      <HomeRootProviderStack.Screen
        name="HomeProviderr"
        component={HomeProvider}
      />
      <HomeRootProviderStack.Screen name="DetailsAds" component={DetailsAds} />
      <HomeRootProviderStack.Screen name="MyProfile" component={MyProfile} />
      <HomeRootProviderStack.Screen
        name="Notification"
        component={Notification}
      />
      <HomeRootProviderStack.Screen name="Messages" component={Messages} />
      <HomeRootProviderStack.Screen
        name="MessageDetails"
        component={MessageDetails}
      />
    </HomeRootProviderStack.Navigator>
  );
};
const HomeRoot = () => {
  return (
    <HomeRootStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, header: null }}
    >
      <HomeRootStack.Screen name="Home" component={Home} />
      <HomeRootStack.Screen name="DetailsAds" component={DetailsAds} />
      <HomeRootStack.Screen name="MyProfile" component={MyProfile} />
      <HomeRootStack.Screen name="Notification" component={Notification} />
      <HomeRootStack.Screen name="Messages" component={Messages} />
      <HomeRootStack.Screen name="MessageDetails" component={MessageDetails} />
    </HomeRootStack.Navigator>
  );
};

export { HomeRootProvider, HomeRoot };
/* name="ServicesSub" component={ServicesSub}  */
