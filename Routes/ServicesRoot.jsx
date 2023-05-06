import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Services from "../Screen/Services/Services";
import ServicesSub from "../Screen/Services/ServicesSub";
import AddServices from "../Screen/Services/AddServices";
import AddServicesAppoitment from "../Screen/Services/AddServicesAppoitment";
import AddServicesComplete from "../Screen/Services/AddServicesComplete";
import AddAddressOrder from "../Screen/Profile/AddAddressOrder";

const ServicesRootStack = createNativeStackNavigator();
const ServicesRoot = () => {
  return (
    <ServicesRootStack.Navigator
      initialRouteName="Services"
      screenOptions={{ headerShown: false }}
    >
      <ServicesRootStack.Screen name="Services" component={Services} />
      <ServicesRootStack.Screen name="ServicesSub" component={ServicesSub} />
      <ServicesRootStack.Screen name="AddServices2" component={AddServices} />
      <ServicesRootStack.Screen
        name="AddServicesAppoitment"
        component={AddServicesAppoitment}
      />
      <ServicesRootStack.Screen
        name="AddServicesComplete"
        component={AddServicesComplete}
      />
      <ServicesRootStack.Screen
        name="AddAddressOrder"
        component={AddAddressOrder}
      />
      {/* <ServicesRootStack.Screen
        name="SelectLocationMapOrder"
        component={SelectLocationMapOrder}
      /> */}
    </ServicesRootStack.Navigator>
  );
};

export default ServicesRoot;
