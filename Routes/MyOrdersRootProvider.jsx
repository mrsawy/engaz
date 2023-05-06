import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyOrdersProvider from "../Screen/MyOrder/MyOrdersProvider";
import MyOrder from "../Screen/MyOrder/MyOrder";
import MyOrderDetails from "../Screen/MyOrder/MyOrderDetails";
import MyOrderDetailsProvider from "../Screen/MyOrder/MyOrderDetailsProvider";

import OffersOrder from "../Screen/MyOrder/OffersOrder";
import OffersPayment from "../Screen/MyOrder/OffersPayment";
import PaymentDataOrders from "../Screen/MyOrder/PaymentDataOrders";
import SuccessOrder from "../Screen/MyOrder/SuccessOrder";
import AddOffers from "../Screen/MyOrder/AddOffers";
import MyOffers from "../Screen/MyOrder/MyOffers";
import MyOffersDetailsProvider from "../Screen/MyOrder/MyOffersDetailsProvider";
import RatingService from "../Screen/MyOrder/RatingService";

const MyOrdersRootProviderStack = createNativeStackNavigator();
const MyOrdersRootStack = createNativeStackNavigator();

const MyOrdersRootProvider = () => {
  return (
    <MyOrdersRootProviderStack.Navigator
      initialRouteName="MyOrdersProvider"
      screenOptions={{ headerShown: false }}
    >
      <MyOrdersRootProviderStack.Screen
        name="MyOrdersProvider"
        component={MyOrdersProvider}
      />
      <MyOrdersRootProviderStack.Screen
        name="MyOrderDetailsProvider"
        component={MyOrderDetailsProvider}
      />
      <MyOrdersRootProviderStack.Screen
        name="OffersOrder"
        component={OffersOrder}
      />
      <MyOrdersRootProviderStack.Screen
        name="OffersPayment"
        component={OffersPayment}
      />
      <MyOrdersRootProviderStack.Screen
        name="PaymentDataOrders"
        component={PaymentDataOrders}
      />
      <MyOrdersRootProviderStack.Screen
        name="SuccessOrder"
        component={SuccessOrder}
      />
      <MyOrdersRootProviderStack.Screen
        name="AddOffers"
        component={AddOffers}
      />
      {/*  <MyOrdersRootProviderStack.Screen name="ShowMap" component={ShowMap} /> */}
    </MyOrdersRootProviderStack.Navigator>
  );
};

const MyOrdersRoot = () => {
  return (
    <MyOrdersRootStack.Navigator
      initialRouteName="MyOrder"
      screenOptions={{ headerShown: false }}
    >
      <MyOrdersRootStack.Screen name="MyOrder" component={MyOrder} />
      <MyOrdersRootStack.Screen
        name="MyOrderDetails"
        component={MyOrderDetails}
      />
      <MyOrdersRootStack.Screen name="OffersOrder" component={OffersOrder} />
      <MyOrdersRootStack.Screen
        name="OffersPayment"
        component={OffersPayment}
      />
      <MyOrdersRootStack.Screen
        name="PaymentDataOrders"
        component={PaymentDataOrders}
      />
      <MyOrdersRootStack.Screen name="SuccessOrder" component={SuccessOrder} />
      {/* <MyOrdersRootStack.Screen name="ShowMap" component={ShowMap} /> */}
      <MyOrdersRootStack.Screen
        name="RatingService"
        component={RatingService}
      />
    </MyOrdersRootStack.Navigator>
  );
};

export { MyOrdersRootProvider, MyOrdersRoot };
