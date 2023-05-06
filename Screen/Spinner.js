import React from "react";
import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
  ImageBackground,
} from "react-native";
import * as Font from "expo-font";
import { Icon, SocialIcon, Divider } from "react-native-elements";
import { connect } from "react-redux";
import {
  CheckUserLogin,
  CheckLanguage,
  GetCategories,
  GetCategoriesRandom,
  GetSubCategoriesRandom,
  GetGovernorate,
  GetSubCategories,
  GetCity,
  GetAds,
  GetAddress,
  GetAbout,
  GetStatistic,
  GetCategoriesUser,
} from "../Actions";
import { Updates } from "expo";

class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
    };
  }

  async UNSAFE_componentWillMount() {
    // AsyncStorage.clear();
    this.props.CheckUserLogin();
    this.props.GetCategories();
    this.props.GetCategoriesRandom();
    this.props.GetSubCategoriesRandom();
    this.props.GetAds();
    this.props.GetAbout();
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetAddress(id_user);
    this.props.GetStatistic(id_user);
    this.props.GetCategoriesUser(id_user);
    this.props.GetCity();
    this.GoHome();

    // fetch(API_URI + '/api/get_rating', {
    //       method: 'POST',
    //       headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         id_user: id_user,
    //       })

    //       })
    //       .then((response) => response.json())
    //       .then((responseJson) => {
    //
    //         if(responseJson.success == 'true'){
    //           AsyncStorage.setItem('rating', responseJson.data)
    //           AsyncStorage.setItem('notification', responseJson.notification)
    //         }

    //       })
    //       .catch((error) => {
    //
    //       });
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  Rtl() {
    AsyncStorage.setItem("FirstLunch", "true").then(() => {
      this.props.navigation.navigate("SettingApp");
    });
  }

  async GoHome() {
    this.LoadFontAsync();

    var FirstLunch = await AsyncStorage.getItem("FirstLunch");
    var FirstLunchIntro = await AsyncStorage.getItem("FirstLunchIntro");
    var token_user = await AsyncStorage.getItem("token");
    var type = await AsyncStorage.getItem("type");

    if (!FirstLunch) {
      this.Rtl();
    } else {
      if (!FirstLunchIntro) {
        AsyncStorage.setItem("FirstLunchIntro", "true").then(() => {
          return this.props.navigation.navigate("Intro");
        });
      } else {
        setTimeout(async () => {
          if (token_user) {
            AsyncStorage.setItem("FirstLunch", "true").then(() => {
              return this.props.navigation.navigate(
                type == "user"
                  ? "HomeStackNavigatorUser"
                  : "HomeStackNavigatorProvider"
              );
            });
          } else {
            AsyncStorage.setItem("FirstLunch", "true").then(() => {
              return this.props.navigation.navigate("Login");
            });
          }
        }, 2000);
      }
    }
  }

  async GoLogin() {
    var FirstLunch = await AsyncStorage.getItem("FirstLunch");

    if (!FirstLunch) {
      setTimeout(async () => {
        this.Rtl();
      }, 2000);
    } else {
      AsyncStorage.setItem("FirstLunch", "true").then(() => {
        setTimeout(async () => {
          return this.props.navigation.navigate("Intro");
        }, 2000);
      });
    }
  }

  // componentWillReceiveProps(NextProps){
  //   if(NextProps.data && NextProps.data !== null && NextProps.data !== this.props.data){
  //     this.GoHome();

  //   }

  //   if(NextProps.data_false && NextProps.data_false !== null && NextProps.data_false !== this.props.data_false){
  //     AsyncStorage.removeItem('token_user');
  //     AsyncStorage.removeItem('id_user');
  //     AsyncStorage.removeItem('name_user');
  //     AsyncStorage.removeItem('image_user');
  //     AsyncStorage.removeItem('mobile_user');
  //     this.props.CheckUserLogin();
  //     // Alert.alert('العضوية الخاصة بك تم حظرها من قبل الادارة')
  //     this.GoLogin();
  //   }

  // }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={require("../assets/splash2.png")}
          style={{ width: "100%", height: "100%", zIndex: 1 }}
        >
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              height: "100%",
              marginTop: 200,
            }}
          >
            <ActivityIndicator size="small" color="#fff" />
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
  return {};
};

export default connect(mapStateToProps, {
  CheckUserLogin,
  CheckLanguage,
  GetCategories,
  GetCategoriesRandom,
  GetSubCategoriesRandom,
  GetAds,
  GetSubCategories,
  GetGovernorate,
  GetCity,
  GetAddress,
  GetAbout,
  GetStatistic,
  GetCategoriesUser,
})(Spinner);
