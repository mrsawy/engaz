import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Linking,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Divider } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { LoginAuth, CheckUserLogin } from "../../Actions";
import DropdownAlert from "react-native-dropdownalert";
import Modal from "react-native-modal";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      email: "",
      password: "",
      isModalVisible: false,
    };
  }

  isModalVisible() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  CheckLogin() {
    const { email, password } = this.state;
    if (email.trim() !== "" && password.trim() !== "") {
      this.props.LoginAuth(email, password);
    } else {
      // Alert.alert(i18n.t('check_field'))
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("check_field"),
        type: "error",
        backgroundColor: "#D3A257",
      });
    }
  }

  UNSAFE_componentWillReceiveProps(NextProps) {
    if (NextProps.user) {
      this.props.CheckUserLogin();
      this.props.navigation.navigate(
        NextProps.user.type == "user"
          ? "HomeStackNavigatorUser"
          : "HomeStackNavigatorProvider"
      );
      // this.props.navigation.navigate('ValidateNumber',{mobile:'+966'+this.state.mobile});
    }
    if (NextProps.error) {
      // this.dropDownAlertRef.alertWithType('errorr', i18n.t('fail_login'), i18n.t('error_login'));
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("error_login"),
        type: "error",
        backgroundColor: "red",
      });
    }

    if (NextProps.data_ban) {
      showMessage({
        message: i18n.t("pending"),
        description: i18n.t("pending_des"),
        type: "warning",
        backgroundColor: "#D3A257",
      });
    }
  }

  renderLoginBtn() {
    if (this.props.loading) {
      return (
        <View
          style={[
            styles.btn,
            {
              backgroundColor: "#000",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 5,
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
          style={[styles.btn, { backgroundColor: "#000", marginBottom: 5 }]}
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
            {i18n.t("login")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={"transparent"}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
        >
          <ScrollView>
            <View style={{ flex: 1, padding: 30, flexDirection: "row" }}>
              <View
                style={{
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 30,
                }}
              >
                <Image
                  style={{ width: 40, height: 230 }}
                  source={require("../../assets/rightsideintro.png")}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  height: 250,
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: 80,
                }}
              >
                <Image
                  style={{ width: 220, height: 220, marginHorizontal: 25 }}
                  source={require("../../assets/logo.png")}
                  resizeMode="contain"
                />

                <View style={{ marginRight: 20, marginLeft: 20 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: "BOLD",
                      color: "#454545",
                      textAlign: "center",
                      marginBottom: 5,
                    }}
                  >
                    {i18n.t("login")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Medium",
                      color: "#454545",
                      textAlign: "center",
                      paddingBottom: 20,
                    }}
                  >
                    {i18n.t("signlogin")}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: 40, height: 170 }}
                  source={require("../../assets/leftsideintro.png")}
                />
              </View>
            </View>

            <View style={{ flex: 1, paddingTop: 10 }}>
              <Input
                inputStyle={{
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  fontFamily: "Medium",
                  fontSize: 15,
                  paddingRight: this.props.Language == "ar" ? 10 : 0,
                  paddingLeft: this.props.Language == "en" ? 10 : 0,
                }}
                placeholder={i18n.t("email")}
                keyboardType="email-address"
                returnKeyType="done"
                autoCapitalize="none"
                inputContainerStyle={[styles.input]}
                underlineColorAndroid="transparent"
                onChangeText={(email) => this.setState({ email })}
                rightIcon={
                  this.props.Language == "ar" ? (
                    <View
                      style={{
                        borderLeftColor: "#ccc",
                        borderLeftWidth: 1,
                        paddingLeft: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="email"
                        size={21}
                        color="#2a2a2a"
                      />
                    </View>
                  ) : null
                }
                leftIcon={
                  this.props.Language == "en" ? (
                    <View
                      style={{
                        borderLeftColor: "#ccc",
                        borderRightWidth: 1,
                        paddingRight: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="email"
                        size={21}
                        color="#2a2a2a"
                      />
                    </View>
                  ) : null
                }
              />

              <Input
                inputStyle={{
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  fontFamily: "Medium",
                  fontSize: 15,
                  paddingRight: this.props.Language == "ar" ? 10 : 0,
                  paddingLeft: this.props.Language == "en" ? 10 : 0,
                }}
                placeholder={i18n.t("password")}
                returnKeyType="done"
                secureTextEntry
                inputContainerStyle={styles.input}
                underlineColorAndroid="transparent"
                onChangeText={(password) => this.setState({ password })}
                rightIcon={
                  this.props.Language == "ar" ? (
                    <View
                      style={{
                        borderLeftColor: "#ccc",
                        borderLeftWidth: 1,
                        paddingLeft: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="lock"
                        size={21}
                        color="#2a2a2a"
                      />
                    </View>
                  ) : null
                }
                leftIcon={
                  this.props.Language == "en" ? (
                    <View
                      style={{
                        borderLeftColor: "#ccc",
                        borderRightWidth: 1,
                        paddingRight: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="lock"
                        size={21}
                        color="#2a2a2a"
                      />
                    </View>
                  ) : null
                }
              />

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ForgetPassword")}
                style={{
                  marginBottom: 10,
                  marginTop: 5,
                  marginLeft: 25,
                  marginRight: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: "#454545",
                    textAlign: this.props.Language == "ar" ? "left" : "right",
                  }}
                >
                  {i18n.t("forget_password")}
                </Text>
              </TouchableOpacity>
            </View>

            {this.renderLoginBtn()}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("HomeStackNavigatorUser")
              }
              style={[
                styles.btn,
                {
                  marginTop: 5,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ccc",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("login_visitor")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("SignUpRoot")}
              style={{ marginTop: 15, padding: 15, marginBottom: 40 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#a2a2a2",
                  fontFamily: "Medium",
                  textAlign: "center",
                }}
              >
                {i18n.t("signAlreadyAccountNo")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#454545",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 3,
                }}
              >
                {i18n.t("create_account")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    loading: state.LoginAuth.loading,
    user: state.LoginAuth.user,
    token: state.LoginAuth.token,
    error: state.LoginAuth.error,
    data_ban: state.LoginAuth.data_ban,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, { LoginAuth, CheckUserLogin })(Login);
