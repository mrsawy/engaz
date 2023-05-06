import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../Screen/Auth/Login";
import SelectAccount from "../Screen/Auth/SelectAccount";
import SelectCategories from "../Screen/Auth/SelectCategories";
import SignUp from "../Screen/Auth/SignUp";
import SignUpUser from "../Screen/Auth/SignUpUser";
import UserPolicyLogin from "../Screen/Auth/UserPolicyLogin";

const SignUpRootStack = createNativeStackNavigator();

const SignUpRoot = () => {
  return (
    <SignUpRootStack.Navigator
      initialRouteName="SelectAccount"
      screenOptions={{ headerShown: false }}
    >
      <SignUpRootStack.Screen name="SelectAccount" component={SelectAccount} />
      <SignUpRootStack.Screen
        name="SelectCategories"
        component={SelectCategories}
      />
      <SignUpRootStack.Screen name="SignUp" component={SignUp} />
      <SignUpRootStack.Screen name="SignUpUser" component={SignUpUser} />
      <SignUpRootStack.Screen
        name="UserPolicyLogin"
        component={UserPolicyLogin}
      />
      <SignUpRootStack.Screen name="Login" component={Login} />
    </SignUpRootStack.Navigator>
  );
};

export default SignUpRoot;
