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

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      phone: "",
      code: "+966",
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

  CheckLogin() {
    if (this.state.phone.trim() !== "") {
      this.setState({ loading: true });
      var code = Math.floor(1000 + Math.random() * 9000);
      fetch(API_URI + "/api/send_code_forget_password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: "966" + this.state.phone,
          customer_code_active: code,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ loading: false });
          if (responseJson.status == "true") {
            this.props.navigation.navigate("ConfirmPhone", {
              phone: "966" + this.state.phone,
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

  //   componentWillReceiveProps(NextProps){
  //     if(NextProps.data){
  //         this.props.navigation.navigate('ConfirmPhone',{type:'pass',phone:this.state.code+''+this.state.mobile});
  //     }
  //   }

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

  componentDidMount() {
    this.LoadFontAsync();
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
            {i18n.t("forget_password")}
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
            {i18n.t("forget_password_dess")}
          </Text>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : null}
            enabled
          >
            <ScrollView>
              <View style={{ marginTop: 5 }}>
                <View>
                  <View
                    style={{
                      position: "absolute",
                      right: this.props.Language == "ar" ? 45 : null,
                      left: this.props.Language == "en" ? 45 : null,
                      height: 60,
                      zIndex: 99,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#9c9c9c",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        fontFamily: "Medium",
                        fontSize: 13,
                        marginTop: 1,
                      }}
                    >
                      | {this.state.code}
                    </Text>
                  </View>

                  <Input
                    inputStyle={{
                      textAlign: this.props.Language == "en" ? "left" : "right",
                      fontFamily: "Medium",
                      fontSize: 14,
                      paddingRight: this.props.Language == "ar" ? 50 : 0,
                      paddingLeft: this.props.Language == "en" ? 50 : 0,
                      marginTop: 1,
                    }}
                    placeholder={i18n.t("phone")}
                    keyboardType="numeric"
                    returnKeyType="done"
                    autoCapitalize="none"
                    inputContainerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    onChangeText={(phone) => this.setState({ phone })}
                  />
                </View>
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
    textAlign: "center",
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

export default connect(mapStateToProps, {})(ForgetPassword);
