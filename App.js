import React from "react";
import { AsyncStorage, Alert, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { I18nManager } from "react-native";
import { Font } from "expo";
I18nManager.allowRTL(false);
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./Reducers";
import ReduxThunk from "redux-thunk";
console.disableYellowBox = true;

import Root from "./Root";
import { STRIPE_PUBLIC_KEY } from "./constants";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_login: false,
    };

    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        urlScheme="com.engaze.engazeapp"
      >
        <Provider store={store}>
          <Root />
        </Provider>
      </StripeProvider>
    );
  }
}

export default App;
