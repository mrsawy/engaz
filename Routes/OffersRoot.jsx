import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyOffers from "../Screen/MyOrder/MyOffers";
import MyOffersDetailsProvider from "../Screen/MyOrder/MyOffersDetailsProvider";
import EditOffer from "../Screen/MyOrder/EditOffer";
const OffersRootStack = createNativeStackNavigator();

const OffersRoot = () => {
  return (
    <OffersRootStack.Navigator
      initialRouteName="MyOffers"
      screenOptions={{ headerShown: false }}
    >
      <OffersRootStack.Screen name="MyOffers" component={MyOffers} />
      <OffersRootStack.Screen
        name="MyOffersDetailsProvider"
        component={MyOffersDetailsProvider}
      />
      <OffersRootStack.Screen name="EditOffer" component={EditOffer} />
    </OffersRootStack.Navigator>
  );
};

export default OffersRoot;
