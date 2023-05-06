import React from "react";
import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import * as Font from "expo-font";
import { Icon, SocialIcon, Divider } from "react-native-elements";
import { connect } from "react-redux";
import { CheckUserLogin, CheckLanguage } from "../Actions";
import { Restart } from "fiction-expo-restart";

import i18n from "../Language";

class SettingApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    this.LoadFontAsync();
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    setTimeout(async () => {
      Restart();
    }, 2500);
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/splash.png")}
          style={{ width: "100%", height: "100%", zIndex: 1 }}
        >
          <View
            style={{
              zIndex: 99,
              justifyContent: "flex-end",
              height: "100%",
              marginTop: -100,
            }}
          >
            <ActivityIndicator size="small" color="#454545" />
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 16,
                color: "#454545",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              انتظر قليلاً , جاري اعداد التطبيق
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.CheckUserLogin.loading,
    is_login: state.CheckUserLogin.is_login,
  };
};

export default connect(mapStateToProps, { CheckUserLogin, CheckLanguage })(
  SettingApp
);
