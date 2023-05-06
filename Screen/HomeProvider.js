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
  GetAds,
  GetStatistic,
  CountNotificationFun,
  CountGetMsgNotRead,
  CheckUserLogin,
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
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

class HomeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      selected: null,
      refreshing: false,
    };
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.props.GetAds();
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetStatistic(id_user);
    this.props.CountNotificationFun(id_user);
    this.props.CountGetMsgNotRead(id_user);

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

        // alert(token.data)

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

    var id_user = await AsyncStorage.getItem("id_user");

    this.props.CountNotificationFun(id_user);
    this.props.CountGetMsgNotRead(id_user);
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

    this.LoadFontAsync();

    var id_user = await AsyncStorage.getItem("id_user");
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
        activeDotIndex={this.state.activeTab ?? 0}
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
          style={{ borderRadius: 4, width: "100%", height: 150 }}
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

  render() {
    var _mapView;

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

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MyProfile")}
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
            </TouchableOpacity>
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
          {this.RenderCursoul()}

          <View style={{ margin: 20 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MyOffers")}
              style={{
                marginBottom: 10,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                backgroundColor: "#E9ECEF",
                padding: 10,
                borderColor: "#eee",
                borderWidth: 1,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  marginLeft: this.props.Language == "ar" ? 15 : 0,
                  marginRight: this.props.Language == "en" ? 15 : 0,
                  backgroundColor: "#F97534",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="playlist-add-check"
                  size={25}
                  style={{}}
                  color="#fff"
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "BOLD",
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  marginTop: 3,
                }}
              >
                {i18n.t("order_in_progress")}
              </Text>
              {this.props.Orders ? (
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#2a2a2a",
                    fontFamily: "BOLD",
                    textAlign: this.props.Language == "ar" ? "left" : "right",
                    marginTop: 3,
                    marginLeft: this.props.Language == "ar" ? 15 : 0,
                    marginRight: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.props.Orders == "zero" ? "0" : this.props.Orders}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#454545" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MyOffers")}
              style={{
                marginBottom: 10,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                backgroundColor: "#E9ECEF",
                padding: 10,
                borderColor: "#eee",
                borderWidth: 1,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  marginLeft: this.props.Language == "ar" ? 15 : 0,
                  marginRight: this.props.Language == "en" ? 15 : 0,
                  backgroundColor: "#707A89",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="clipboard-list"
                  size={25}
                  style={{}}
                  color="#fff"
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "BOLD",
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  marginTop: 3,
                }}
              >
                {i18n.t("offers_order")}
              </Text>
              {this.props.Offers ? (
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#2a2a2a",
                    fontFamily: "BOLD",
                    textAlign: this.props.Language == "ar" ? "left" : "right",
                    marginTop: 3,
                    marginLeft: this.props.Language == "ar" ? 15 : 0,
                    marginRight: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.props.Offers == "zero" ? "0" : this.props.Offers}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#454545" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Wallet")}
              style={{
                marginBottom: 10,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                backgroundColor: "#E9ECEF",
                padding: 10,
                borderColor: "#eee",
                borderWidth: 1,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  marginLeft: this.props.Language == "ar" ? 15 : 0,
                  marginRight: this.props.Language == "en" ? 15 : 0,
                  backgroundColor: "#457045",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="money-bill-wave"
                  size={20}
                  style={{}}
                  color="#fff"
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "BOLD",
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  marginTop: 3,
                }}
              >
                {i18n.t("money")}
              </Text>
              {this.props.Wallet ? (
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#2a2a2a",
                    fontFamily: "BOLD",
                    textAlign: this.props.Language == "ar" ? "left" : "right",
                    marginTop: 3,
                    marginLeft: this.props.Language == "ar" ? 15 : 0,
                    marginRight: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.props.Wallet.available_balance == "zero"
                    ? "0"
                    : this.props.Wallet.available_balance}{" "}
                  {i18n.t("riyal")}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#454545" />
              )}
            </TouchableOpacity>
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

    loading_ads: state.GetAds.loading,
    data_ads: state.GetAds.data,

    loading_sta: state.GetStatistic.loading,
    Orders: state.GetStatistic.Orders,
    Offers: state.GetStatistic.Offers,
    Wallet: state.GetStatistic.Wallet,

    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  GetAds,
  GetStatistic,
  CountNotificationFun,
  CountGetMsgNotRead,
  CheckUserLogin,
})(HomeProvider);
