import React from "react";
import { AsyncStorage, View, I18nManager, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import * as Font from "expo-font";
import i18n from "./Language";

import Spinner from "./Screen/Spinner";
import Login from "./Screen/Auth/Login";
import Intro from "./Screen/Intro";
import ForgetPassword from "./Screen/Auth/ForgetPassword";
import ConfirmPhone from "./Screen/Auth/ConfirmPhone";
import ChangePasswordAuth from "./Screen/Auth/ChangePasswordAuth";
import SettingApp from "./Screen/SettingApp";
import LanguageScreen from "./Screen/LanguageScreen";

import { CheckLanguage } from "./Actions";
import { connect } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { MenuProvider } from "react-native-popup-menu";
import SignUpRoot from "./Routes/SignUpRoot";
import {
  TabNavigatorDashboardLeftUser,
  TabNavigatorDashboardRightUser,
} from "./Routes/TabNavigatorDashboard";
import {
  TabNavigatorDashboardLeftProvider,
  TabNavigatorDashboardRightProvider,
} from "./Routes/TabNavigatorDashboardProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

class Root extends React.Component {
  constructor(props) {
    super(props);

    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    this.LoadFontAsync();

    this.state = {
      fontLoaded: false,
      localLang: "",
      appState: AppState.currentState,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("./Fonts/NeoSansArabicBold.ttf"),
      Medium: require("./Fonts/NeoSansArabic.ttf"),
      REGULAR: require("./Fonts/REGULAR.otf"),
    });

    this.setState({ fontLoaded: true });
  }

  UNSAFE_componentWillMount() {
    this.setState({ loading: true });
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    this.props.CheckLanguage();
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }

    return this.props.Language == "ar" ? (
      <View style={{ flex: 1 }}>
        <MenuProvider>
          <NavigationContainer>
            <AppNavigatorRight />
          </NavigationContainer>
          <FlashMessage
            ref="myLocalFlashMessage"
            textStyle={{
              fontFamily: "Medium",
              textAlign: this.props.Language == "ar" ? "right" : "left",
            }}
            titleStyle={{
              fontFamily: "BOLD",
              textAlign: this.props.Language == "ar" ? "right" : "left",
            }}
            style={{ borderBottomColor: "#454545" }}
          />
        </MenuProvider>
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <MenuProvider>
          <NavigationContainer>
            <AppNavigatorLeft />
          </NavigationContainer>
          <FlashMessage
            ref="myLocalFlashMessage"
            textStyle={{
              fontFamily: "Medium",
              textAlign: this.props.Language == "ar" ? "right" : "left",
            }}
            titleStyle={{
              fontFamily: "BOLD",
              textAlign: this.props.Language == "ar" ? "right" : "left",
            }}
            style={{ borderBottomColor: "#454545" }}
          />
        </MenuProvider>
      </View>
    );
  }
}

const AppNavigatorLeftStack = createNativeStackNavigator();

const AppNavigatorLeft = () => {
  return (
    <AppNavigatorLeftStack.Navigator
      initialRouteName="Spinner"
      screenOptions={{ headerShown: false }}
    >
      <AppNavigatorLeftStack.Screen name="Spinner" component={Spinner} />
      <AppNavigatorLeftStack.Screen name="Login" component={Login} />
      <AppNavigatorLeftStack.Screen name="SignUpRoot" component={SignUpRoot} />
      <AppNavigatorLeftStack.Screen
        name="HomeStackNavigatorUser"
        component={TabNavigatorDashboardLeftUser}
      />
      <AppNavigatorLeftStack.Screen
        name="HomeStackNavigatorProvider"
        component={TabNavigatorDashboardLeftProvider}
      />
      <AppNavigatorLeftStack.Screen name="SettingApp" component={SettingApp} />
      <AppNavigatorLeftStack.Screen name="Intro" component={Intro} />
      <AppNavigatorLeftStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
      />
      <AppNavigatorLeftStack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
      />
      <AppNavigatorLeftStack.Screen
        name="ConfirmPhone"
        component={ConfirmPhone}
      />
      <AppNavigatorLeftStack.Screen
        name="ChangePasswordAuth"
        component={ChangePasswordAuth}
      />
    </AppNavigatorLeftStack.Navigator>
  );
};

const AppNavigatorRightStack = createNativeStackNavigator();

const AppNavigatorRight = () => {
  return (
    <AppNavigatorRightStack.Navigator
      initialRouteName="Spinner"
      screenOptions={{ headerShown: false }}
    >
      <AppNavigatorRightStack.Screen name="Spinner" component={Spinner} />
      <AppNavigatorRightStack.Screen name="Login" component={Login} />
      <AppNavigatorRightStack.Screen name="SignUpRoot" component={SignUpRoot} />
      <AppNavigatorRightStack.Screen
        name="HomeStackNavigatorUser"
        component={TabNavigatorDashboardRightUser}
      />
      <AppNavigatorRightStack.Screen
        name="HomeStackNavigatorProvider"
        component={TabNavigatorDashboardRightProvider}
      />
      <AppNavigatorRightStack.Screen name="SettingApp" component={SettingApp} />
      <AppNavigatorRightStack.Screen name="Intro" component={Intro} />
      <AppNavigatorRightStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
      />
      <AppNavigatorRightStack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
      />
      <AppNavigatorRightStack.Screen
        name="ConfirmPhone"
        component={ConfirmPhone}
      />
      <AppNavigatorRightStack.Screen
        name="ChangePasswordAuth"
        component={ChangePasswordAuth}
      />
    </AppNavigatorRightStack.Navigator>
  );
};
const mapStateToProps = (state) => {
  return {
    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, { CheckLanguage })(Root);
