import React from "react";
import {
  StyleSheet,
  Text,
  RefreshControl,
  View,
  ScrollView,
  Image,
  AsyncStorage,
  Linking,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { API_URI } from "../constants";
import * as Font from "expo-font";
import { Icon, Header, CheckBox, Divider } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";
import * as Notifications from "expo-notifications";
import { connect } from "react-redux";
import {
  GetCategoriesRandom,
  GetSubCategoriesRandom,
  GetAds,
  CountNotificationFun,
  CheckUserLogin,
  CountGetMsgNotRead,
} from "../Actions";
import i18n from "../Language";

const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 30 : StatusBar.currentHeight;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      selected: null,
      refreshing: false,
      maincategories_id: "",
      des: "",
    };
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });

    this.props.GetCategoriesRandom();
    this.props.GetAds();
    this.props.GetSubCategoriesRandom();
    var id = await AsyncStorage.getItem("id_user");
    this.props.CountNotificationFun(id);
    this.props.CountGetMsgNotRead(id);

    this.setState({ refreshing: false });
  };

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("chat-messages", {
        name: "chat-messages",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      } else {
      }
      if (finalStatus !== "granted") {
        return;
      } else {
      }

      // token =  (await Notifications.getExpoPushTokenAsync()).data;

      try {
        const token = await Notifications.getExpoPushTokenAsync();

        const id = await AsyncStorage.getItem("id_user");

        if (id) {
          await fetch(API_URI + "/api/save_token_expo", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              token: token.data,
            }),
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.success == "false") {
                Alert.alert(
                  "خطأ",
                  "الجلسة الخاصة بك انتهت !",
                  [{ text: "OK", onPress: () => this.EndSession() }],
                  { cancelable: false }
                );
              }
            })
            .catch((error) => {});
        }
      } catch (e) {
        // alert(e)
      }
    } else {
      // alert('Must use physical device for Push Notifications');
    }
  }

  EndSession() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("id_user");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("image");
    AsyncStorage.removeItem("cover");
    AsyncStorage.removeItem("mobile");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("city");
    AsyncStorage.removeItem("governorate");
    AsyncStorage.removeItem("type");
    AsyncStorage.removeItem("notification");
    AsyncStorage.removeItem("rating");

    this.props.CheckUserLogin();
    this.props.navigation.navigate("Login");
  }

  UNSAFE_componentWillReceiveProps(NextProps) {}

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id = await AsyncStorage.getItem("id_user");
    this.props.CountNotificationFun(id);
    this.props.CountGetMsgNotRead(id);
  }

  async componentDidMount() {
    var id_user = await AsyncStorage.getItem("id_user");
    if (id_user) {
      this.props.CountNotificationFun(id_user);
      this.props.CountGetMsgNotRead(id_user);
    }
    this.registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        this._handleNotification2(notification);
      }
    );

    const subscription2 = Notifications.addNotificationReceivedListener(
      (notification) => {
        this._handleNotification(notification);
      }
    );

    this._onFocusListener = this.props.navigation.addListener(
      "didFocus",
      async (payload) => {
        if (id_user) {
          this.props.CountNotificationFun(id_user);
          this.props.CountGetMsgNotRead(id_user);
        }
      }
    );

    this.LoadFontAsync();

    fetch(API_URI + "/api/get_rating", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: id_user,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          AsyncStorage.setItem("rating", responseJson.data);
          AsyncStorage.setItem("notification", responseJson.notification);
        }
      })
      .catch((error) => {});
  }

  _handleNotification2 = async (notification) => {
    var id = await AsyncStorage.getItem("id_user");
    if (id) {
      this.props.CountNotificationFun(id);
      this.props.CountGetMsgNotRead(id);
    }

    if (
      Platform.OS === "android"
        ? notification.notification.request.content.data.msg
        : notification.notification.request.content.data.body.msg
    ) {
      this.props.navigation.navigate("MessageDetails", {
        item:
          Platform.OS === "android"
            ? notification.notification.request.content.data.message_id
            : notification.notification.request.content.data.body.message_id,
      });
    }

    if (
      Platform.OS === "android"
        ? notification.notification.request.content.data.order_id
        : notification.notification.request.content.data.body.order_id
    ) {
      this.props.navigation.navigate("MyOffersDetailsProvider", {
        item:
          Platform.OS === "android"
            ? notification.notification.request.content.data.order
            : notification.notification.request.content.data.body.order,
      });
    }

    if (
      Platform.OS === "android"
        ? notification.notification.request.content.data.cancel_request
        : notification.notification.request.content.data.body.cancel_request
    ) {
      this.props.navigation.navigate("MyOrderDetails", {
        item:
          Platform.OS === "android"
            ? notification.notification.request.content.data.order
            : notification.notification.request.content.data.body.order,
      });
    }

    var type = await AsyncStorage.getItem("type");
    if (
      Platform.OS === "android"
        ? notification.notification.request.content.data.message_id_private
        : notification.notification.request.content.data.body.message_id_private
    ) {
      this.props.navigation.navigate(
        type == "user" ? "MyOrderDetails" : "MyOffersDetailsProvider",
        {
          item:
            Platform.OS === "android"
              ? notification.notification.request.content.data.data_msg
              : notification.notification.request.content.data.body.data_msg,
        }
      );
    }
  };

  _handleNotification = async (notification) => {
    var id = await AsyncStorage.getItem("id_user");
    if (id) {
      this.props.CountNotificationFun(id);
      this.props.CountGetMsgNotRead(id);
    }
  };

  get pagination() {
    return (
      <Pagination
        dotsLength={this.props.data_ads.length}
        activeDotIndex={this.state.activeTab}
        containerStyle={{ marginTop: -35 }}
        dotStyle={{
          width: 22,
          height: 5,
          borderRadius: 15,
          backgroundColor: "#C78638",
        }}
        inactiveDotStyle={{
          backgroundColor: "#454545",
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        animatedDuration={5}
        animatedTension={2}
        animatedFriction={1}
      />
    );
  }

  goToAdv(title, des, image) {
    this.props.navigation.navigate("DetailsAds", {
      image: image,
      title: title,
      des: des,
    });
  }

  _renderItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => this.goToAdv(item.title, item.description, item.image)}
        style={[styles.imageSilder, { margin: 20 }]}
      >
        <Image
          source={{ uri: item.image }}
          style={{ borderRadius: 10, width: "100%", height: 150 }}
        />
      </TouchableOpacity>
    );
  }

  RenderCursoul() {
    if (this.props.loading_ads) {
      return (
        <View style={{ height: 160, margin: 20 }}>
          <Placeholder Animation={Fade}>
            <PlaceholderMedia
              style={{ width: "100%", height: 150, borderRadius: 10 }}
            />
          </Placeholder>
        </View>
      );
    }

    if (this.props.data_ads) {
      return (
        <View>
          <Carousel
            layout={"default"}
            loop={true}
            autoplay={true}
            ref={(v) => (this.slider1Pagination = v)}
            data={this.props.data_ads}
            renderItem={(item, index) => this._renderItem(item, index)}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={Dimensions.get("window").width}
            onSnapToItem={(i) => this.setState({ activeTab: i })}
            autoplayInterval={this.props.speed}
          />
          {this.pagination}
        </View>
      );
    }

    if (!this.props.data_ads) {
      return (
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
          <Text style={{ fontFamily: "BOLD", fontSize: 18, color: "#969696" }}>
            {i18n.t("no_order")}
          </Text>
        </View>
      );
    }
  }
  /* Service  ServicesSub*/
  GoToService(item) {
    this.props.navigation.navigate("Service", {
      screen: "ServicesSub",
      params: {
        main_cat: this.props.Language == "ar" ? item.name_ar : item.name_en,
        id: item.id,
        maincategories_id: item.id,
      },
    });
  }

  GetData() {
    if (this.props.loading_cat) {
      return (
        <View>
          <View style={{ height: 50, margin: 5 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderMedia
                style={{
                  width: "48%",
                  height: 45,
                  position: "absolute",
                  right: 0,
                  borderRadius: 8,
                }}
              />
              <PlaceholderMedia
                style={{
                  width: "48%",
                  height: 45,
                  position: "absolute",
                  left: 0,
                  borderRadius: 8,
                }}
              />
            </Placeholder>
          </View>
          <View style={{ height: 50, margin: 5, marginTop: -2.5 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderMedia
                style={{
                  width: "48%",
                  height: 45,
                  position: "absolute",
                  right: 0,
                  borderRadius: 8,
                }}
              />
              <PlaceholderMedia
                style={{
                  width: "48%",
                  height: 45,
                  position: "absolute",
                  left: 0,
                  borderRadius: 8,
                }}
              />
            </Placeholder>
          </View>
        </View>
      );
    }

    if (this.props.data_cat) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data_cat}
          numColumns={2}
          renderItem={({ item }) =>
            !this.props.is_login ? (
              <View
                style={{
                  flexDirection: "row-reverse",
                  flex: 1,
                  padding: 15,
                  alignItems: "center",
                  marginBottom: 10,
                  justifyContent: "center",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#c9c9c9",
                  marginRight: 5,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "BOLD",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  {this.props.Language == "ar" ? item.name_ar : item.name_en}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.GoToService(item)}
                style={{
                  flexDirection: "row-reverse",
                  flex: 1,
                  padding: 15,
                  alignItems: "center",
                  marginBottom: 10,
                  justifyContent: "center",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#c9c9c9",
                  marginRight: 5,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "BOLD",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  {this.props.Language == "ar" ? item.name_ar : item.name_en}
                </Text>
              </TouchableOpacity>
            )
          }
          keyExtractor={({ id }, index) => id}
        />
      );
    }

    if (!this.props.data_cat) {
      return (
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
          <Text style={{ fontFamily: "BOLD", fontSize: 18, color: "#969696" }}>
            {i18n.t("no_order")}
          </Text>
        </View>
      );
    }
  }

  GetDataSub() {
    if (this.props.loading_cat_sub) {
      return (
        <View>
          <View style={{ height: 50, margin: 5 }}>
            <Placeholder
              Animation={Fade}
              Left={(props) => (
                <PlaceholderMedia
                  style={[
                    { flex: 1, height: 45, borderRadius: 8 },
                    props.style,
                  ]}
                />
              )}
              Right={(props) => (
                <PlaceholderMedia
                  style={[
                    { flex: 1, height: 45, borderRadius: 8 },
                    props.style,
                  ]}
                />
              )}
            >
              <PlaceholderMedia
                style={{ width: "100%", height: 45, borderRadius: 8 }}
              />
            </Placeholder>
          </View>
          <View style={{ height: 50, margin: 5 }}>
            <Placeholder
              Animation={Fade}
              Left={(props) => (
                <PlaceholderMedia
                  style={[
                    { flex: 1, height: 45, borderRadius: 8 },
                    props.style,
                  ]}
                />
              )}
              Right={(props) => (
                <PlaceholderMedia
                  style={[
                    { flex: 1, height: 45, borderRadius: 8 },
                    props.style,
                  ]}
                />
              )}
            >
              <PlaceholderMedia
                style={{ width: "100%", height: 45, borderRadius: 8 }}
              />
            </Placeholder>
          </View>
        </View>
      );
    }

    if (this.props.data_cat_sub) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data_cat_sub}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Service", {
                  screen: "AddServices2",
                  params: {
                    sub_cat: item.id,
                    title:
                      this.props.Language == "ar"
                        ? item.name_subcategories_ar
                        : item.name_subcategories_en,
                    des:
                      this.props.Language == "ar"
                        ? item.maincategories_id.name_ar
                        : item.maincategories_id.name_en,
                    maincategories_id: item.maincategories_id.id,
                  },
                })
              }
              style={{
                marginBottom: 10,
                flex: 1,
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#c9c9c9",
                marginRight: 5,
                marginLeft: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "BOLD",
                  color: "#000",
                  textAlign: "center",
                  marginTop: 3,
                }}
              >
                {this.props.Language == "ar"
                  ? item.name_subcategories_ar
                  : item.name_subcategories_en}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={({ id }, index) => id}
        />
      );
    }

    if (!this.props.data_cat_sub) {
      return (
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
          <Text style={{ fontFamily: "BOLD", fontSize: 18, color: "#969696" }}>
            {i18n.t("no_order")}
          </Text>
        </View>
      );
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }

    return (
      <View style={[styles.container, { backgroundColor: "#fff" }]}>
        <View style={styles.StatusBar}>
          <StatusBar
            translucent={true}
            barStyle="light-content"
            backgroundColor={"#2A2A2A"}
          />
        </View>

        <SafeAreaView>
          <View
            style={{
              flexDirection:
                this.props.Language == "ar" ? "row" : "row-reverse",
              padding: 10,
              paddingTop: Platform.OS === "android" ? 30 : 10,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                  this.props.Language == "ar" ? "flex-start" : "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
                style={{ width: 40 }}
              >
                <Icon
                  name="bell"
                  type="font-awesome"
                  size={22}
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
                style={{ width: 35, marginTop: 5, marginLeft: 10 }}
              >
                <MaterialCommunityIcons
                  name="comment"
                  size={25}
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

            {!this.props.is_login ? (
              <View
                style={{
                  flex: 1,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                }}
              >
                <Image
                  source={require("../assets/logo.png")}
                  style={{ width: 55, height: 55 }}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                }}
              >
                <View style={{ width: 60, marginLeft: 10, marginRight: 10 }}>
                  <Image
                    source={
                      this.props.image
                        ? { uri: this.props.image }
                        : {
                            uri: "http://mehandis.net/wp-content/uploads/2017/12/default-user.png",
                          }
                    }
                    borderRadius={50}
                    style={{
                      overflow: "hidden",
                      width: 55,
                      height: 55,
                      borderRadius: 50,
                      borderColor: "#ccc",
                      borderWidth: 1,
                    }}
                  />
                </View>
                {/* <View style={{flex:1,justifyContent:'center',alignItems:this.props.Language == 'ar' ? 'flex-end':'flex-start'}}>
                        <Text style={{fontSize:15,color:'#454545',fontFamily:'BOLD',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:8}}>{this.props.name}</Text>
                        <View style={{flexDirection:this.props.Language == 'ar' ? 'row-reverse':'row'}}>
                            <FontAwesome name="envelope-o" size={15} style={{marginLeft:this.props.Language == 'ar' ? 7:0,marginRight:this.props.Language == 'en' ? 7:0}} color="#245359" />
                            <Text style={{fontSize:13,color:'#a2a2a2',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3}}>{this.props.email}</Text>
                        </View>
                      </View> */}
              </View>
            )}
          </View>
        </SafeAreaView>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View
            style={{
              marginRight: 20,
              marginLeft: 20,
              marginTop: 30,
              flexDirection:
                this.state.localLang == "en" ? "row" : "row-reverse",
            }}
          >
            <View>
              <Text
                style={{
                  textAlign: this.state.localLang == "en" ? "left" : "right",
                  fontFamily: "BOLD",
                  fontSize: 15,
                  color: "#454545",
                }}
              >
                {i18n.t("service_random")}
              </Text>
            </View>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.navigation.navigate("Service")}
            >
              <Text
                style={{
                  textAlign: this.state.localLang == "en" ? "right" : "left",
                  fontFamily: "Medium",
                  color: "#606060",
                }}
              >
                {i18n.t("more")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginRight: 15, marginLeft: 15, marginTop: 10 }}>
            {this.GetData()}
          </View>

          {this.RenderCursoul()}

          <View
            style={{
              marginRight: 20,
              marginLeft: 20,
              marginTop: 0,
              flexDirection:
                this.state.localLang == "en" ? "row" : "row-reverse",
            }}
          >
            <TouchableOpacity style={{ flex: 1 }}>
              <Text
                style={{
                  textAlign: this.state.localLang == "en" ? "left" : "right",
                  fontFamily: "BOLD",
                  fontSize: 15,
                  color: "#454545",
                }}
              >
                {i18n.t("service_random")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.navigation.navigate("Service")}
            >
              <Text
                style={{
                  textAlign: this.state.localLang == "en" ? "right" : "left",
                  fontFamily: "Medium",
                  color: "#606060",
                }}
              >
                {i18n.t("more")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginRight: 15, marginLeft: 15, marginTop: 10 }}>
            {this.GetDataSub()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leftIcon: {
    position: "absolute",
  },
  btn: {
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 15,
    marginTop: 15,
  },
  imageSilder: {
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    shadowColor: "#cfcfcf",
    borderRadius: 4,
    borderColor: "#eee",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: "#2a2a2a",
  },
});

const mapStateToProps = (state) => {
  return {
    Language: state.ChecLanguage.Language,
    name: state.CheckUserLogin.name,
    email: state.CheckUserLogin.email,
    image: state.CheckUserLogin.image,

    loading_cat: state.GetCategoriesRandom.loading,
    data_cat: state.GetCategoriesRandom.data,

    loading_cat_sub: state.GetSubCategoriesRandom.loading,
    data_cat_sub: state.GetSubCategoriesRandom.data,

    loading_ads: state.GetAds.loading,
    data_ads: state.GetAds.data,

    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,

    is_login: state.CheckUserLogin.is_login,
  };
};

export default connect(mapStateToProps, {
  GetCategoriesRandom,
  GetSubCategoriesRandom,
  GetAds,
  CountNotificationFun,
  CountGetMsgNotRead,
  CheckUserLogin,
})(Home);
