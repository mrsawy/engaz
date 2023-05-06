import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Linking,
  AsyncStorage,
  Share,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { CheckUserLogin } from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { API_URI } from "../../constants";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var type = await AsyncStorage.getItem("type");
    this.setState({ type: type });
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async logout() {
    var id_user = await AsyncStorage.getItem("id_user");

    const formData = new FormData();
    formData.append("id", id_user);

    fetch(API_URI + "/api/clear_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {})
      .catch((error) => {});

    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("id_user");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("photo");
    AsyncStorage.removeItem("cover");
    AsyncStorage.removeItem("mobile");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("city");
    AsyncStorage.removeItem("governorate");
    AsyncStorage.removeItem("type");
    AsyncStorage.removeItem("rating");
    AsyncStorage.removeItem("notification");

    this.props.CheckUserLogin();
    // AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

  onShare = async () => {
    try {
      var text =
        Platform.OS === "ios"
          ? "حمل تطبيق خدمة " + this.props.socail.app_store
          : "حمل تطبيق خدمة " + this.props.socail.google_play;

      const result = await Share.share({
        message: text,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  componentDidMount() {
    this.LoadFontAsync();
  }

  render() {
    if (!this.props.is_login) {
      return (
        <View style={[styles.container, { backgroundColor: "#fff" }]}>
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
                  {i18n.t("profile")}
                </Text>
              </View>
              <View></View>
            </Header>
          ) : (
            <Header
              backgroundColor={"#2A2A2A"}
              containerStyle={{ borderBottomWidth: 0 }}
            >
              <View></View>

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
                  {i18n.t("profile")}
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

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 25,
              paddingBottom: 25,
            }}
          >
            <Icon
              name="exclamation-circle"
              type="font-awesome"
              size={60}
              color={"#cfcfcf"}
              iconStyle={{ marginBottom: 5 }}
            />
            <Text
              style={{
                fontFamily: "BOLD",
                fontSize: 16,
                color: "#969696",
                marginRight: 30,
                marginLeft: 30,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {i18n.t("login_s")}
            </Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
              style={[
                {
                  width: 150,
                  height: 55,
                  marginBottom: 5,
                  borderRadius: 30,
                  justifyContent: "center",
                  marginLeft: 5,
                  marginRight: 5,
                  marginBottom: 10,
                  backgroundColor: "#2A2A2A",
                  marginTop: 20,
                },
              ]}
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
          </View>
        </View>
      );
    }

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
                {/* <View style={{position:'absolute',left:17 ,justifyContent:'center',
                    top:-3, width:10,height:10,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                </View> */}
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
                {i18n.t("profile")}
              </Text>
            </View>
            <View />
          </Header>
        ) : (
          <Header
            backgroundColor={"#2A2A2A"}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            <View />

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
                {i18n.t("profile")}
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
          <View
            style={{
              margin: 15,
              flexDirection:
                this.props.Language == "ar" ? "row-reverse" : "row",
              backgroundColor: "#F4F5F7",
              padding: 15,
              borderWidth: 1,
              borderColor: "#EEE",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Address")}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderLeftColor: "#ccc",
                borderLeftWidth: this.props.Language == "ar" ? 1 : 0,
                borderRightColor: "#ccc",
                borderRightWidth: this.props.Language == "en" ? 1 : 0,
              }}
            >
              <MaterialIcons
                name="location-on"
                size={25}
                color="#D3A257"
                style={{ height: 27 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "BOLD",
                  fontSize: 13,
                  color: "#2a2a2a",
                  marginTop: 5,
                }}
              >
                {i18n.t("my_address")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(
                  this.state.type == "provider" ? "WalletProvider" : "Wallet"
                )
              }
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <FontAwesome5
                name="wallet"
                size={20}
                color="#D3A257"
                style={{ height: 27 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "BOLD",
                  fontSize: 13,
                  color: "#2a2a2a",
                  marginTop: 5,
                }}
              >
                {i18n.t("my_wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("EditProfile")}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderRightColor: "#ccc",
                borderRightWidth: this.props.Language == "ar" ? 1 : 0,
                borderLeftColor: "#ccc",
                borderLeftWidth: this.props.Language == "en" ? 1 : 0,
              }}
            >
              <FontAwesome5
                name="user-alt"
                size={20}
                color="#D3A257"
                style={{ height: 27 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "BOLD",
                  fontSize: 13,
                  color: "#2a2a2a",
                  marginTop: 5,
                }}
              >
                {i18n.t("profile")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("RootProfile")}
            style={{
              backgroundColor: "#F4F5F7",
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
              <MaterialIcons name="settings" size={24} color="#2a2a2a" />
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
                {i18n.t("account_setting")}
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
            onPress={() => this.props.navigation.navigate("TermAndPrivecy")}
            style={{
              backgroundColor: "#F4F5F7",
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
              <FontAwesome5 name="clipboard-list" size={22} color="#2a2a2a" />
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
                {i18n.t("user_policy")}
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
            onPress={() => this.props.navigation.navigate("Advertise")}
            style={{
              backgroundColor: "#F4F5F7",
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
              <FontAwesome5 name="list-ol" size={22} color="#2a2a2a" />
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
                {i18n.t("ads")}
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
            onPress={() => this.props.navigation.navigate("Help")}
            style={{
              backgroundColor: "#F4F5F7",
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
              <Ionicons name="ios-help-buoy" size={25} color="#2a2a2a" />
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
                {i18n.t("help")}
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
            onPress={() => this.props.navigation.navigate("About")}
            style={{
              backgroundColor: "#F4F5F7",
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
              <FontAwesome name="info-circle" size={25} color="#2a2a2a" />
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
                {i18n.t("about")}
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
            onPress={() => this.onShare()}
            style={{
              backgroundColor: "#F4F5F7",
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
              <FontAwesome name="share-alt" size={22} color="#2a2a2a" />
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
                {i18n.t("share_app")}
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
            onPress={() => this.logout()}
            style={{
              backgroundColor: "#F4F5F7",
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
              <FontAwesome name="sign-out" size={23} color="#2a2a2a" />
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
                {i18n.t("sign_out")}
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

          {this.props.socail ? (
            <View
              style={{
                flexDirection: "row",
                marginRight: 50,
                marginLeft: 50,
                marginTop: 20,
                marginBottom: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => Linking.openURL(this.props.socail.facebook)}
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="facebook" size={17} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(this.props.socail.instagram)}
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5,
                }}
              >
                <FontAwesome name="instagram" size={17} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(this.props.socail.youtube)}
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5,
                }}
              >
                <FontAwesome5 name="youtube" size={17} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(this.props.socail.twitter)}
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5,
                }}
              >
                <FontAwesome name="twitter" size={17} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : null}
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
});

const mapStateToProps = (state) => {
  return {
    socail: state.GetAbout.socail,
    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,
    is_login: state.CheckUserLogin.is_login,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { CheckUserLogin })(Profile);
