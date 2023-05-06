import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import {} from "../../Actions";
import i18n from "../../Language";
import OtpInputs from "react-native-otp-inputs";

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class ConfirmPhone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      code: "",
      loading: false,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  CheckLogin() {
    if (this.state.code.length > 0) {
      this.setState({ loading: true });
      fetch(API_URI + "/api/check_code_ative_user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: this.props.route.params.phone,
          customer_code_active: this.state.code,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ loading: false });
          if (responseJson.status == "true") {
            this.props.navigation.navigate("ChangePasswordAuth", {
              phone: this.props.route.params.phone,
            });
          } else {
            showMessage({
              message: i18n.t("error_password_title"),
              description: i18n.t("error_phonee"),
              type: "error",
              backgroundColor: "#D3A257",
            });
          }
        })
        .catch((error) => {});
    } else {
      showMessage({
        message: i18n.t("error_password_title"),
        description: i18n.t("check_field"),
        type: "error",
        backgroundColor: "#D3A257",
      });
    }
  }

  renderLoginBtn() {
    if (this.state.loading) {
      return (
        <View
          style={[
            styles.btn,
            {
              backgroundColor: "#000",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.CheckLogin()}
          style={[styles.btn, { backgroundColor: "#000" }]}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#fff",
              fontFamily: "Medium",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {i18n.t("Next")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }

    return (
      <View style={{ backgroundColor: "#f9f9f9", flex: 1 }}>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={"transparent"}
        />

        <View style={{ paddingTop: 50, flex: 1 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={{
              padding: 15,
              alignSelf:
                this.props.Language == "ar" ? "flex-end" : "flex-start",
              marginRight: this.props.Language == "ar" ? 10 : 0,
              marginLeft: this.props.Language == "en" ? 10 : 0,
            }}
          >
            <MaterialCommunityIcons
              name={this.props.Language == "ar" ? "arrow-right" : "arrow-left"}
              size={24}
              color="#245359"
            />
          </TouchableOpacity>

          <Text
            style={{
              marginLeft: 30,
              paddingRight: 30,
              fontSize: 24,
              fontFamily: "BOLD",
              color: "#000",
              textAlign: this.props.Language == "en" ? "left" : "right",
            }}
          >
            {i18n.t("enter_code")}
          </Text>
          <Text
            style={{
              marginLeft: 30,
              paddingRight: 30,
              fontSize: 15,
              fontFamily: "Medium",
              color: "#454545",
              marginTop: 3,
              textAlign: this.props.Language == "en" ? "left" : "right",
              paddingBottom: 40,
            }}
          >
            {i18n.t("endet_code_des")}
          </Text>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : null}
            enabled
          >
            <ScrollView>
              <View style={{ marginTop: 5 }}>
                <OtpInputs
                  handleChange={(code) => this.setState({ code })}
                  numberOfInputs={4}
                  containerStyles={{
                    marginRight: 25,
                    marginLeft: 25,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  inputContainerStyles={{
                    backgroundColor: "#fbfcfc",
                    borderColor: "#f7f7f7",
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                  returnKeyType="done"
                />
              </View>

              <View style={{ marginTop: 20 }}>{this.renderLoginBtn()}</View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   textAlign:'center',
    //   justifyContent:'center',
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
  },
  input: {
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 8,

    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "#eee",
  },
  btn: {
    borderRadius: 30,
    height: 55,
    justifyContent: "center",
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 15,
    backgroundColor: "#2A2A2A",
    marginTop: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, {})(ConfirmPhone);
