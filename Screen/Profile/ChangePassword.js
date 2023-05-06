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
import {} from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      confirm_new_password: "",
      old_password: "",
      new_password: "",
      loading: false,
    };
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

  async CheckLogin() {
    if (
      this.state.old_password.trim() !== "" &&
      this.state.new_password.trim() !== "" &&
      this.state.confirm_new_password.trim() !== ""
    ) {
      var id = await AsyncStorage.getItem("id_user");
      if (this.state.new_password == this.state.confirm_new_password) {
        if (this.state.new_password.length <= 6) {
          Alert.alert("يجب ان تحتوي كلمة المرور على 7 خانات على الاقل");
        } else {
          this.setState({ loading: true });

          fetch(API_URI + "/api/change_password", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              old_password: this.state.old_password,
              new_password: this.state.new_password,
            }),
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.success == "true") {
                this.setState({ loading: false });
                showMessage({
                  message: i18n.t("success"),
                  description: i18n.t("success_des"),
                  type: "success",
                  backgroundColor: "green",
                });

                setTimeout(() => {
                  this.props.navigation.goBack();
                }, 2000);
              } else {
                this.setState({ loading: false });
                showMessage({
                  message: i18n.t("errorr"),
                  description: i18n.t("old_password_incorrect"),
                  type: "error",
                  backgroundColor: "red",
                });
              }
            })
            .catch((error) => {
              dispatch({
                type: "SendCodeFaildServer",
                errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
              });
            });
        }
      } else {
        showMessage({
          message: i18n.t("errorr"),
          description: i18n.t("error_pass"),
          type: "error",
          backgroundColor: "red",
        });
      }
    } else {
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("check_field"),
        type: "error",
        backgroundColor: "red",
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
            {i18n.t("send")}
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
          barStyle="light-content"
          backgroundColor={"#2A2A2A"}
        />

        {this.props.Language == "ar" ? (
          <Header
            backgroundColor={"#2A2A2A"}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
                style={{ width: 40 }}
              >
                <Icon
                  name="bell"
                  type="font-awesome"
                  size={17}
                  color={"#D3A257"}
                />
                {this.props.data_count_notification > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      left: 20,
                      justifyContent: "center",
                      top: -3,
                      width: 12,
                      height: 12,
                      backgroundColor: "#454545",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#fff",
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Messages")}
                style={{ width: 35, marginLeft: 5 }}
              >
                <MaterialCommunityIcons
                  name="comment"
                  size={20}
                  color="#D3A257"
                />
                {this.props.data_count_msg > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      left: 17,
                      justifyContent: "center",
                      top: -3,
                      width: 12,
                      height: 12,
                      backgroundColor: "#454545",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#fff",
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Medium",
                  fontSize: 15,
                  color: "#fff",
                  marginTop: 2,
                }}
              >
                {i18n.t("change_password")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <MaterialCommunityIcons
                name={
                  this.props.Language == "ar" ? "arrow-right" : "arrow-left"
                }
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </Header>
        ) : (
          <Header
            backgroundColor={"#2A2A2A"}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <MaterialCommunityIcons
                name={
                  this.props.Language == "ar" ? "arrow-right" : "arrow-left"
                }
                size={22}
                color="#fff"
              />
            </TouchableOpacity>

            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Medium",
                  fontSize: 15,
                  color: "#fff",
                  marginTop: 2,
                }}
              >
                {i18n.t("change_password")}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
                style={{ width: 40 }}
              >
                <Icon
                  name="bell"
                  type="font-awesome"
                  size={17}
                  color={"#D3A257"}
                />
                {this.props.data_count_notification > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      left: 20,
                      justifyContent: "center",
                      top: -3,
                      width: 12,
                      height: 12,
                      backgroundColor: "#454545",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#fff",
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Messages")}
                style={{ width: 35, marginLeft: 5 }}
              >
                <MaterialCommunityIcons
                  name="comment"
                  size={20}
                  color="#D3A257"
                />
                {/* <View style={{position:'absolute',left:17 ,justifyContent:'center',
                top:-3, width:10,height:10,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
            </View> */}
              </TouchableOpacity>
            </View>
          </Header>
        )}

        <ScrollView>
          <View style={{ margin: 15 }}>
            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("old_password")}
              returnKeyType="done"
              secureTextEntry
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(old_password) => this.setState({ old_password })}
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

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("new_password")}
              returnKeyType="done"
              secureTextEntry
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(new_password) => this.setState({ new_password })}
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

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("confiem_password")}
              returnKeyType="done"
              secureTextEntry
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(confirm_new_password) =>
                this.setState({ confirm_new_password })
              }
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

            {this.renderLoginBtn()}
          </View>
        </ScrollView>
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
    marginLeft: 0,
    marginRight: 0,
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
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, {})(ChangePassword);
