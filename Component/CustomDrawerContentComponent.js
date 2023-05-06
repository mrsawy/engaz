import React from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import i18n from "../Language";

import { connect } from "react-redux";
import { CheckUserLogin } from "../Actions";

class CustomDrawerContentComponent extends React.Component {
  state = {
    username: "مستخدم افتراضي",
    email: "email ",
    image: "null",
    localLang: "",
    is_login: false,
  };

  logout() {
    AsyncStorage.removeItem("token_user");
    AsyncStorage.removeItem("id_user");
    AsyncStorage.removeItem("name_user");
    AsyncStorage.removeItem("image_user");
    AsyncStorage.removeItem("longitude");
    AsyncStorage.removeItem("latitude");
    AsyncStorage.removeItem("address");
    this.props.CheckUserLogin();
    this.props.navigation.navigate("Login");
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id = await AsyncStorage.getItem("id_user");
    var name = await AsyncStorage.getItem("name_user");
    var image = await AsyncStorage.getItem("image_user");
    var email = await AsyncStorage.getItem("email_user");

    if (id) {
      this.setState({ is_login: true, name: name, image: image, email: email });
    } else {
      this.setState({ is_login: false });
    }
  }

  renderUser() {
    if (this.props.is_login) {
      return (
        <View style={{ padding: 10 }}>
          <Image
            PlaceholderContent={<ActivityIndicator color="#454545" />}
            source={
              this.props.image
                ? {
                    uri:
                      "http://col.vectorcode.net/storage/" + this.props.image,
                  }
                : require("../assets/default-user.png")
            }
            style={{
              borderWidth: 1,
              borderColor: "#eee",
              width: 55,
              height: 55,
              borderRadius: 27.5,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              fontFamily: "BOLD",
              fontSize: 22,
              textAlign: "center",
              color: "#dadada",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            {this.props.name}
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Login")}
          style={{ justifyContent: "center", padding: 30 }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#fff",
              fontFamily: "REGULAR",
              textAlign: "center",
            }}
          >
            {i18n.t("login")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 200,
            backgroundColor: "#000",
            paddingTop: 15,
            justifyContent: "center",
          }}
        >
          {this.renderUser()}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          {/* <DrawerItems {...this.props} /> */}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
            style={{
              padding: 20,
              paddingRight: 10,
              paddingLeft: 10,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontFamily: "REGULAR",
                textAlign: "center",
                marginTop: -4,
              }}
            >
              {i18n.t("Home")}
            </Text>
          </TouchableOpacity>

          {this.props.is_login ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ChangeNumber")}
              style={{
                padding: 20,
                paddingRight: 10,
                paddingLeft: 10,
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontFamily: "REGULAR",
                  textAlign: "center",
                  marginTop: -4,
                }}
              >
                {i18n.t("ChangeNumber")}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.is_login ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AddBank")}
              style={{
                padding: 20,
                paddingRight: 10,
                paddingLeft: 10,
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontFamily: "REGULAR",
                  textAlign: "center",
                  marginTop: -4,
                }}
              >
                {i18n.t("AddBank")}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.is_login ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("changePassword")}
              style={{
                padding: 20,
                paddingRight: 10,
                paddingLeft: 10,
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontFamily: "REGULAR",
                  textAlign: "center",
                  marginTop: -4,
                }}
              >
                {i18n.t("changePassword")}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ChangeLanguage")}
            style={{
              padding: 20,
              paddingRight: 10,
              paddingLeft: 10,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontFamily: "REGULAR",
                textAlign: "center",
                marginTop: -4,
              }}
            >
              {i18n.t("ChangeLanguage")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("UserPolicy")}
            style={{
              padding: 20,
              paddingRight: 10,
              paddingLeft: 10,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontFamily: "REGULAR",
                textAlign: "center",
                marginTop: -4,
              }}
            >
              {i18n.t("UserPolicy")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {this.props.is_login ? (
          <TouchableOpacity
            onPress={() => this.logout()}
            style={{ position: "absolute", bottom: 40, left: 0, right: 0 }}
          >
            <SafeAreaView>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "REGULAR",
                  margin: 0,
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                {i18n.t("logout")}
              </Text>
            </SafeAreaView>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    is_login: state.CheckUserLogin.is_login,
    name: state.CheckUserLogin.name,
    image: state.CheckUserLogin.image,
    mobile: state.CheckUserLogin.mobile,
  };
};

export default connect(mapStateToProps, { CheckUserLogin })(
  CustomDrawerContentComponent
);
