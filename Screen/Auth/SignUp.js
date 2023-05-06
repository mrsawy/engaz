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
import { SignUpAuthFun, CheckUserLogin, GetGovernorate } from "../../Actions";
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      checked: false,
      photo: null,
      cover: null,
      name: "",
      mobile: "",
      email: "",
      password: "",
      city: "",
      governorate: "",
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

  _pickcover = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ cover: result.uri });
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
    const {
      name,
      mobile,
      email,
      password,
      city,
      governorate,
      photo,
      cover,
      checked,
    } = this.state;
    if (checked === true) {
      if (
        name.trim() !== "" &&
        mobile.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        city.trim() !== "" &&
        governorate.trim() !== "" &&
        photo &&
        cover
      ) {
        this.setState({ error_name: "", error_phone: "" });
        const type = this.props.route.params["TypeAccount"];
        const Interests = this.props.route.params["Interests"];
        this.props.SignUpAuthFun(
          type,
          name,
          "966" + mobile,
          email,
          password,
          city,
          governorate,
          photo,
          cover,
          Interests,
          "no"
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
      // this.props.CheckUserLogin()
      // this.props.navigation.navigate(NextProps.data.type == 'user' ? 'HomeStackNavigatorUser':'HomeStackNavigatorProvider');

      showMessage({
        message: i18n.t("sign_done"),
        description: i18n.t("check_user"),
        type: "success",
        backgroundColor: "green",
      });

      setTimeout(async () => {
        this.props.navigation.navigate("Login");
      }, 1500);
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

  renderImage() {
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

  rendercover() {
    if (this.state.cover) {
      return (
        <View style={{ width: "100%" }}>
          <Image
            source={{ uri: this.state.cover }}
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
          onPress={() => this._pickcover()}
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
            name="idcard"
            size={30}
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

  updateCode() {
    this.setState({ code: "+" + this.phone.getCountryCode() });
  }

  SelectCity(val, id) {
    this.setState({ city: val, governorate: null });
    this.props.GetGovernorate(id);
    this.RBSheet.close();
  }

  SelectGovernorate(val) {
    this.setState({ governorate: val });
    this.RBSheet2.close();
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

            <View style={{ flex: 3 }}>
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
                  textAlign: "right",
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
                  textAlign: "right",
                  fontFamily: "Medium",
                  marginTop: -5,
                  marginRight: 20,
                  marginLeft: 20,
                }}
              />

              {/* <View>

            <View style={{position:'absolute',right:this.props.Language == 'ar' ? 87:null,left:this.props.Language == 'en' ? 87:null,height:60,zIndex:99,justifyContent:'center'}}>
            <Text style={{color: '#9c9c9c',textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily:'Medium',fontSize:13,marginTop:6}}>
            | {this.state.code}
            </Text>
            </View>

            <PhoneInput
                style={[styles.input,{marginRight:30,marginLeft:30,height:60,paddingLeft:20,flexDirection:this.props.Language == 'ar' ?'row-reverse':'row'}]}
                textStyle={{textAlign:this.props.Language == 'ar' ? 'right':'left',paddingRight:this.props.Language == 'ar' ?45:0,paddingLeft:this.props.Language == 'en' ?45:0}}
                initialCountry={'sa'}
                ref={(ref) => { this.phone = ref; }}
                onChangePhoneNumber={(phone) => this.updateInfo(phone)}
                onSelectCountry={() => this.updateCode()}
                // buttonTextStyle={{fontFamily:'Medium',color:'red'}}
                confirmText={'تأكيد'}
                cancelText={'تجاهل'}
                pickerItemStyle={{fontFamily:'Medium',}}
            /> */}

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
                  textAlign: "right",
                  fontFamily: "Medium",
                  marginTop: -5,
                  marginRight: 20,
                  marginLeft: 20,
                }}
              />

              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
                style={[
                  styles.input,
                  {
                    marginLeft: 30,
                    marginRight: 30,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    height: 55,
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    borderLeftColor: "#ccc",
                    borderRightColor: "#ccc",
                    borderLeftWidth: this.props.Language == "ar" ? 1 : 0,
                    borderRightWidth: this.props.Language == "en" ? 1 : 0,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-marker" size={21} color="#2a2a2a" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: this.state.city ? "#2a2a2a" : "#b5b5b5",
                    fontFamily: "Medium",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 4,
                    paddingRight: this.props.Language == "ar" ? 15 : 0,
                    paddingLeft: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.state.city ? this.state.city : i18n.t("city")}
                </Text>
                <View
                  style={{
                    width: 40,
                    alignItems:
                      this.props.Language == "ar" ? "flex-start" : "flex-end",
                  }}
                >
                  <AntDesign name="down" size={15} color="#2a2a2a" />
                </View>
              </TouchableOpacity>

              <RBSheet
                ref={(ref) => {
                  this.RBSheet = ref;
                }}
                height={200}
                duration={0}
                customStyles={{}}
              >
                <View>
                  <View
                    style={{
                      borderBottomColor: "#eee",
                      borderBottomWidth: 2,
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("select_city")}
                    </Text>
                  </View>

                  {this.props.data_city ? (
                    <ScrollView>
                      {this.props.data_city.map((item) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.SelectCity(item.name, item.id)}
                            style={{
                              padding: 10,
                              borderBottomColor: "#eee",
                              borderBottomWidth: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                color: "#2a2a2a",
                                fontFamily: "Medium",
                                textAlign: "center",
                                marginTop: 4,
                              }}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <ActivityIndicator size="small" color="#2a2a2a" />
                  )}
                </View>
              </RBSheet>

              <TouchableOpacity
                onPress={() => this.RBSheet2.open()}
                style={[
                  styles.input,
                  {
                    marginLeft: 30,
                    marginRight: 30,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    height: 55,
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    borderLeftColor: "#ccc",
                    borderRightColor: "#ccc",
                    borderLeftWidth: this.props.Language == "ar" ? 1 : 0,
                    borderRightWidth: this.props.Language == "en" ? 1 : 0,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-marker" size={21} color="#2a2a2a" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: this.state.governorate ? "#2a2a2a" : "#b5b5b5",
                    fontFamily: "Medium",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 4,
                    paddingRight: this.props.Language == "ar" ? 15 : 0,
                    paddingLeft: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.state.governorate
                    ? this.state.governorate
                    : i18n.t("governorate")}
                </Text>
                <View
                  style={{
                    width: 40,
                    alignItems:
                      this.props.Language == "ar" ? "flex-start" : "flex-end",
                  }}
                >
                  <AntDesign name="down" size={15} color="#2a2a2a" />
                </View>
              </TouchableOpacity>

              <RBSheet
                ref={(ref) => {
                  this.RBSheet2 = ref;
                }}
                height={200}
                duration={0}
                customStyles={{}}
              >
                <View>
                  <View
                    style={{
                      borderBottomColor: "#eee",
                      borderBottomWidth: 2,
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("select_city")}
                    </Text>
                  </View>

                  {this.props.data_governorate ? (
                    <ScrollView>
                      {this.props.data_governorate.map((item) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.SelectGovernorate(item.name)}
                            style={{
                              padding: 10,
                              borderBottomColor: "#eee",
                              borderBottomWidth: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                color: "#2a2a2a",
                                fontFamily: "Medium",
                                textAlign: "center",
                                marginTop: 4,
                              }}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <ActivityIndicator size="small" color="#2a2a2a" />
                  )}
                </View>
              </RBSheet>

              <View
                style={{
                  marginLeft: 30,
                  marginRight: 30,
                  alignSelf:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
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
                  {this.renderImage()}
                </View>

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
                    {i18n.t("cover")}
                  </Text>
                  {this.rendercover()}
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
                  checked={this.state.checked}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() =>
                    this.setState({ checked: !this.state.checked })
                  }
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
            </View>

            <View style={{ marginTop: 5, marginBottom: 40 }}>
              {this.renderLoginBtn()}
            </View>
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

    data_city: state.GetCity.data,
    data_governorate: state.GetGovernorate.data,
  };
};

export default connect(mapStateToProps, {
  SignUpAuthFun,
  CheckUserLogin,
  GetGovernorate,
})(SignUp);
