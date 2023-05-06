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
import { Icon, CheckBox, Header, Divider } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import {} from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import Modal from "react-native-modal";
import { showMessage, hideMessage } from "react-native-flash-message";
import ToggleSwitch from "toggle-switch-react-native";
import { API_URI } from "../../constants";
class RootProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      isModalVisible: false,
      value: "no",
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

  isModalVisible() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  async componentDidMount() {
    this.LoadFontAsync();
    const notification = await AsyncStorage.getItem("notification");
    this.setState({
      checked_ar: this.props.Language == "ar" ? true : false,
      checked_en: this.props.Language == "en" ? true : false,
      value: notification,
    });
  }

  SelectEn() {
    this.setState({ checked_en: !this.state.checked_en, checked_ar: false });
  }

  SelectAr() {
    this.setState({ checked_ar: !this.state.checked_ar, checked_en: false });
  }

  Apply() {
    this.setState({ isModalVisible: !this.state.isModalVisible });

    showMessage({
      message: i18n.t("success"),
      description:
        "The language has changed successfully, the application will be reloaded",
      type: "success",
      backgroundColor: "green",
    });

    if (this.state.checked_ar) {
      AsyncStorage.setItem("Language", "ar");
    } else {
      AsyncStorage.setItem("Language", "en");
    }

    setTimeout(async () => {
      this.props.navigation.navigate("SettingApp");
    }, 2000);
  }

  async ChangeNotification(on) {
    this.setState({ value: on ? "yes" : "no" });

    const id = await AsyncStorage.getItem("id_user");
    fetch(API_URI + "/api/change_notification", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        value: on ? "yes" : "no",
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          AsyncStorage.setItem("notification", responseJson.data);
        }
      })
      .catch((error) => {});
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
                {i18n.t("account_setting")}
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
                {i18n.t("account_setting")}
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
          <TouchableOpacity
            onPress={() => this.setState({ isModalVisible: true })}
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: "#EEE",
              flexDirection:
                this.props.Language == "ar" ? "row-reverse" : "row",
            }}
          >
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="language" size={24} color="#2a2a2a" />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  color: "#2a2a2a",
                  marginRight: 10,
                  marginLeft: 10,
                  fontFamily: "BOLD",
                  marginTop: 4,
                }}
              >
                {i18n.t("change_lang")}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name={
                  this.props.Language == "ar" ? "angle-left" : "angle-right"
                }
                type="font-awesome"
                size={19}
                color="#2a2a2a"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ChangePassword")}
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: "#EEE",
              flexDirection:
                this.props.Language == "ar" ? "row-reverse" : "row",
              borderBottomWidth: 1,
              borderBottomColor: "#EEE",
            }}
          >
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="lock" size={22} color="#2a2a2a" />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  color: "#2a2a2a",
                  marginRight: 10,
                  marginLeft: 10,
                  fontFamily: "BOLD",
                  marginTop: 4,
                }}
              >
                {i18n.t("change_password")}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name={
                  this.props.Language == "ar" ? "angle-left" : "angle-right"
                }
                type="font-awesome"
                size={19}
                color="#2a2a2a"
              />
            </View>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              flexDirection:
                this.props.Language == "ar" ? "row-reverse" : "row",
              borderBottomWidth: 1,
              borderBottomColor: "#EEE",
            }}
          >
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome name="bell" size={20} color="#2a2a2a" />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  color: "#2a2a2a",
                  marginRight: 10,
                  marginLeft: 10,
                  fontFamily: "BOLD",
                  marginTop: 4,
                }}
              >
                {i18n.t("notification_disable")}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              <ToggleSwitch
                isOn={this.state.value == "yes" ? true : false}
                onColor="green"
                offColor="#ccc"
                size="small"
                onToggle={(isOn) => this.ChangeNotification(isOn)}
              />
            </View>
          </View>

          <Modal
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            isVisible={this.state.isModalVisible}
            animationIn={"slideInUp"}
            animationOut={"fadeOutDown"}
          >
            <View style={styles.model}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "BOLD",
                  color: "#454545",
                  textAlign: "center",
                  padding: 15,
                  marginTop: 5,
                }}
              >
                {i18n.t("change_lang")}
              </Text>
              <Divider style={{ backgroundColor: "#606060" }} />

              <TouchableOpacity
                onPress={() => this.SelectAr()}
                style={{
                  marginRight: 25,
                  marginLeft: 25,
                  marginTop: 5,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  borderBottomColor: "#EEE",
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                  paddingTop: 5,
                }}
              >
                <CheckBox
                  center
                  checkedColor={"#D3A257"}
                  checked={this.state.checked_ar}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => this.SelectAr()}
                  containerStyle={{ marginRight: 5, padding: 0, marginLeft: 5 }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 14,
                    fontFamily: "BOLD",
                    color: this.state.checked_ar ? "#454545" : "#8f8f8f",
                    textAlign: "center",
                  }}
                >
                  اللغة العربية
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.SelectEn()}
                style={{
                  marginRight: 25,
                  marginLeft: 25,
                  marginTop: 5,
                  marginBottom: 5,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  borderBottomColor: "#EEE",
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                  paddingTop: 5,
                }}
              >
                <CheckBox
                  center
                  checkedColor={"#D3A257"}
                  checked={this.state.checked_en}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => this.SelectEn()}
                  containerStyle={{ marginRight: 5, padding: 0, marginLeft: 5 }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 14,
                    fontFamily: "BOLD",
                    color: this.state.checked_en ? "#454545" : "#8f8f8f",
                    textAlign: "center",
                  }}
                >
                  English
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  marginRight: 30,
                  marginLeft: 30,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.Apply()}
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
                    {i18n.t("apply")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ isModalVisible: false })}
                  style={[
                    styles.btn,
                    {
                      backgroundColor: "#f7f7f7",
                      justifyContent: "center",
                      borderColor: "#ccc",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#2a2a2a",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 3,
                    }}
                  >
                    {i18n.t("cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    height: 40,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
    flex: 1,
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
    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {})(RootProfile);
