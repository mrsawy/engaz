import { createNativeStackNavigator } from "@react-navigation/native-stack";
import About from "../Screen/Profile/About";
import AddAddress from "../Screen/Profile/AddAddress";
import Address from "../Screen/Profile/Address";
import Advertise from "../Screen/Profile/Advertise";
import AdvertiseDetails from "../Screen/Profile/AdvertiseDetails";
import ChangePassword from "../Screen/Profile/ChangePassword";
import EditCategories from "../Screen/Profile/EditCategories";
import EditProfile from "../Screen/Profile/EditProfile";
import Help from "../Screen/Profile/Help";
import Profile from "../Screen/Profile/Profile";
import RootProfile from "../Screen/Profile/RootProfile";

import TermAndPrivecy from "../Screen/Profile/TermAndPrivecy";
import Wallet from "../Screen/Profile/Wallet";
import WalletProvider from "../Screen/Profile/WalletProvider";

const ProfileRootStack = createNativeStackNavigator();

const ProfileRoot = () => {
  return (
    <ProfileRootStack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <ProfileRootStack.Screen name="Profile" component={Profile} />
      <ProfileRootStack.Screen name="Address" component={Address} />
      <ProfileRootStack.Screen name="AddAddress" component={AddAddress} />
      <ProfileRootStack.Screen name="Wallet" component={Wallet} />
      <ProfileRootStack.Screen
        name="WalletProvider"
        component={WalletProvider}
      />
      <ProfileRootStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileRootStack.Screen name="RootProfile" component={RootProfile} />
      <ProfileRootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
      />
      <ProfileRootStack.Screen
        name="TermAndPrivecy"
        component={TermAndPrivecy}
      />
      <ProfileRootStack.Screen name="Advertise" component={Advertise} />
      <ProfileRootStack.Screen
        name="AdvertiseDetails"
        component={AdvertiseDetails}
      />
      <ProfileRootStack.Screen name="Help" component={Help} />
      <ProfileRootStack.Screen name="About" component={About} />
      {/*   <ProfileRootStack.Screen
        name="SelectLocationMap"
        component={SelectLocationMap}
      /> */}
      <ProfileRootStack.Screen name="MyOffers" component={EditCategories} />
    </ProfileRootStack.Navigator>
  );
};

export default ProfileRoot;
