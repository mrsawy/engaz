import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Linking,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, CheckBox, Divider } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { SignUpAuthFun, CheckUserLogin } from "../../Actions";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import PhoneInput from "react-native-phone-input";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";

class SignUpUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      checked: false,
      photo: null,
      name: "",
      mobile: "",
      email: "",
      password: "",
      phone_err: "",
      code: "",
      error_name: "",
      error_email: "",
      error_password: "",
      error_phone: "",
    };
  }

  _pickImage = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ photo: result.uri });
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

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

  _onPressSignUp() {
    const { name, mobile, email, password, city, governorate, photo, checked } =
      this.state;
    if (checked === true) {
      if (
        name.trim() !== "" &&
        mobile.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        city !== "" &&
        governorate !== "" &&
        photo
      ) {
        this.setState({ error_name: "", error_phone: "" });
        const type = this.props.route.params["TypeAccount"];
        this.props.SignUpAuthFun(
          type,
          name,
          "966" + mobile,
          email,
          password,
          null,
          null,
          photo,
          null,
          null,
          "yes"
        );
      } else {
        // Alert.alert(i18n.t('errorr'))
        showMessage({
          message: i18n.t("errorr"),
          description: i18n.t("error_auth"),
          type: "error",
          backgroundColor: "red",
        });
      }
    } else {
      // Alert.alert(i18n.t('user_policy_check'))
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("user_policy_check"),
        type: "warn",
        backgroundColor: "#D3A257",
      });
    }
  }

  UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.props.CheckUserLogin();
      this.props.navigation.navigate(
        NextProps.data.type == "user"
          ? "HomeStackNavigatorUser"
          : "HomeStackNavigatorProvider"
      );
    }

    if (
      NextProps.false_name &&
      NextProps.false_name !== null &&
      NextProps.false_name !== this.props.false_name
    ) {
      this.setState({ error_name: i18n.t("check_username") });
    }

    if (
      NextProps.false_email &&
      NextProps.false_email !== null &&
      NextProps.false_email !== this.props.false_email
    ) {
      this.setState({ error_email: i18n.t("check_email") });
    }

    if (
      NextProps.false_phone &&
      NextProps.false_phone !== null &&
      NextProps.false_phone !== this.props.false_phone
    ) {
      this.setState({ error_phone: i18n.t("check_phone") });
    }

    if (
      NextProps.false_password &&
      NextProps.false_password !== null &&
      NextProps.false_password !== this.props.false_password
    ) {
      this.setState({ error_password: i18n.t("check_password") });
    }
  }

  renderLoginBtn() {
    if (this.props.loading) {
      return (
        <View
          style={[
            styles.btn,
            {
              backgroundColor: "#2a2a2a",
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
          onPress={() => this._onPressSignUp()}
          style={[
            styles.btn,
            { backgroundColor: "#2a2a2a", justifyContent: "center" },
          ]}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#fff",
              fontFamily: "Medium",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            {i18n.t("signUp")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderImage1() {
    if (this.state.photo) {
      return (
        <View style={{ width: "100%" }}>
          <Image
            source={{ uri: this.state.photo }}
            style={{
              height: 90,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={{
            height: 90,
            width: "100%",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: this.state.image_border,
            borderStyle: "dashed",
            justifyContent: "center",
          }}
        >
          <AntDesign
            name="user"
            size={24}
            color="#c4c4c4"
            style={{ alignSelf: "center" }}
          />
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
            <View style={{ paddingTop: 50 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  padding: 15,
                  alignSelf:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
                  marginRight: this.props.Language == "ar" ? 10 : 0,
                  marginLeft: this.props.Language == "en" ? 10 : 0,
                }}
              >
                <MaterialCommunityIcons
                  name={
                    this.props.Language == "ar" ? "arrow-right" : "arrow-left"
                  }
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
                {i18n.t("information_account")}
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
                {i18n.t("information_account_des")}
              </Text>
            </View>

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("name")}
              returnKeyType="done"
              autoCapitalize="none"
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(name) => this.setState({ name })}
              rightIcon={
                this.props.Language == "ar" ? (
                  <View
                    style={{
                      borderLeftColor: "#ccc",
                      borderLeftWidth: 1,
                      paddingLeft: 10,
                    }}
                  >
                    <FontAwesome name="user" size={21} color="#2a2a2a" />
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
                    <FontAwesome name="user" size={21} color="#2a2a2a" />
                  </View>
                ) : null
              }
              errorMessage={this.state.error_name}
              errorStyle={{
                color: "red",
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                marginTop: -5,
                marginRight: 20,
                marginLeft: 20,
              }}
            />

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
              inputContainerStyle={styles.input}
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
                    <MaterialIcons name="email" size={21} color="#2a2a2a" />
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
                    <MaterialIcons name="email" size={21} color="#2a2a2a" />
                  </View>
                ) : null
              }
              errorMessage={this.state.error_email}
              errorStyle={{
                color: "red",
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                marginTop: -5,
                marginRight: 20,
                marginLeft: 20,
              }}
            />

            <View>
              <View
                style={{
                  position: "absolute",
                  right: this.props.Language == "ar" ? 90 : null,
                  left: this.props.Language == "en" ? 90 : null,
                  height: 60,
                  zIndex: 99,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#9c9c9c",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    fontFamily: "Medium",
                    fontSize: 13,
                    marginTop: 1,
                  }}
                >
                  966
                </Text>
              </View>

              <Input
                inputStyle={{
                  textAlign: this.props.Language == "en" ? "left" : "right",
                  fontFamily: "Medium",
                  fontSize: 14,
                  paddingRight: this.props.Language == "ar" ? 30 : 0,
                  paddingLeft: this.props.Language == "en" ? 30 : 0,
                  marginTop: 1,
                }}
                placeholder={""}
                keyboardType="numeric"
                returnKeyType="done"
                autoCapitalize="none"
                inputContainerStyle={styles.input}
                underlineColorAndroid="transparent"
                onChangeText={(mobile) => this.setState({ mobile })}
                rightIcon={
                  this.props.Language == "ar" ? (
                    <View
                      style={{
                        borderLeftColor: "#ccc",
                        borderLeftWidth: 1,
                        paddingLeft: 10,
                      }}
                    >
                      <FontAwesome name="phone" size={21} color="#2a2a2a" />
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
                      <FontAwesome name="phone" size={21} color="#2a2a2a" />
                    </View>
                  ) : null
                }
              />

              {this.state.error_phone ? (
                <Text
                  style={{
                    color: "red",
                    textAlign: "right",
                    fontFamily: "Medium",
                    marginTop: -5,
                    marginBottom: 8,
                    marginRight: 40,
                    marginLeft: 20,
                    fontSize: 11,
                  }}
                >
                  {this.state.error_phone}
                </Text>
              ) : null}

              {this.state.phone_err ? (
                <Text
                  style={{
                    color: "red",
                    textAlign: "right",
                    fontFamily: "Medium",
                    marginTop: -5,
                    marginBottom: 8,
                    marginRight: 40,
                    marginLeft: 20,
                    fontSize: 11,
                  }}
                >
                  {this.state.phone_err}
                </Text>
              ) : null}
            </View>

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("password")}
              secureTextEntry
              returnKeyType="done"
              autoCapitalize="none"
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
              errorMessage={this.state.error_password}
              errorStyle={{
                color: "red",
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                marginTop: -5,
                marginRight: 20,
                marginLeft: 20,
              }}
            />

            <View
              style={{
                marginLeft: 30,
                marginRight: 30,
                alignSelf: "flex-end",
                marginBottom: 5,
                marginTop: 5,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: "#8a8a8a",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {i18n.t("Photo")}
                </Text>
                {this.renderImage1()}
              </View>
            </View>

            <View
              style={{
                marginRight: 25,
                marginLeft: 25,
                marginTop: 5,
                marginBottom: 20,
                flexDirection:
                  this.props.Language == "en" ? "row" : "row-reverse",
                alignItems: "center",
              }}
            >
              <CheckBox
                center
                checkedColor={"#000"}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.checked}
                onPress={() => this.setState({ checked: !this.state.checked })}
                containerStyle={{ marginRight: 5, padding: 0, marginLeft: 5 }}
              />
              <Text
                style={{
                  marginTop: 3,
                  fontSize: 14,
                  fontFamily: "Medium",
                  color: "#8f8f8f",
                  textAlign: "center",
                }}
              >
                {i18n.t("agree")}{" "}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("UserPolicyLogin")
                }
              >
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 14,
                    color: "#0e5be1",
                    fontFamily: "BOLD",
                  }}
                >
                  {" "}
                  {i18n.t("Privacypolicy")}{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 5 }}>{this.renderLoginBtn()}</View>
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
    paddingRight: 20,
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
  },
  bottom: {
    height: 100,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  model: {
    borderRadius: 20,
    margin: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.SignUpAuth.loading,
    data: state.SignUpAuth.data,
    data_errorServer: state.SignUpAuth.errorServer,
    false_name: state.SignUpAuth.false_name,
    false_phone: state.SignUpAuth.false_phone,
    false_email: state.SignUpAuth.false_email,
    false_password: state.SignUpAuth.false_password,
    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, { SignUpAuthFun, CheckUserLogin })(
  SignUpUser
);
