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
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { AcceptOrders, GetMyOrder, Chating } from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";
import Loading from "react-native-whc-loading";

import StarRating from "react-native-star-rating";
import { API_URI } from "../../constants";
import { fetchPaymentSheetParams } from "../../services/stripe";
import {
  presentPaymentSheet,
  initPaymentSheet,
} from "@stripe/stripe-react-native";
class OffersPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      payment: "cash",
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

  selectPayment(val) {
    this.setState({ payment: val });
  }
  onPaymentSuccess(paymentIntentId) {
    this.props.AcceptOrders(
      this.props.route.params.item.order_id,
      this.props.route.params.item.user_id.id,
      this.props.route.params.item.price,
      "online",
      null,
      null,
      null,
      paymentIntentId
    );
  }
  async accept() {
    if (this.state.payment == "card") {
      try {
        const amount = Math.max(this.props.route.params.item.price * 100, 200);

        const { status, stripeResponse, message } =
          await fetchPaymentSheetParams({
            amount,
            description: "Test payment for user Mohamed Nasser at Engaze",
            user_id: this.props.route.params.item.user_id.id,
          });
        if (status && stripeResponse) {
          const { error } = await initPaymentSheet({
            customerId: stripeResponse.customer,
            customerEphemeralKeySecret: stripeResponse.ephemeralKey,
            paymentIntentClientSecret: stripeResponse.paymentIntent,
            merchantDisplayName: "Engaze Inc.",
            merchantCountryCode: "US",
            testEnv: false,
          });
          if (error) {
            console.log(error);
          } else {
            const { error: errorPresentingSheet } = await presentPaymentSheet();
            if (errorPresentingSheet) {
            } else {
              this.onPaymentSuccess(stripeResponse.paymentIntentId);
            }
          }
        } else {
          console.log("Error Presenting payment sheet");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      this.props.AcceptOrders(
        this.props.route.params.item.order_id,
        this.props.route.params.item.user_id.id,
        this.props.route.params.item.price,
        "cash",
        null,
        null,
        null,
        null
      );
    }
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data_success &&
      NextProps.data_success !== null &&
      NextProps.data_success !== this.props.data_success
    ) {
      showMessage({
        message: i18n.t("success"),
        description: i18n.t("success_des"),
        type: "success",
        backgroundColor: "green",
      });

      var id_user = await AsyncStorage.getItem("id_user");
      this.props.GetMyOrder(id_user);

      setTimeout(async () => {
        this.props.navigation.navigate("MyOrderDetails", {
          item: NextProps.data_success,
        });
      }, 1500);
    }

    if (
      NextProps.loading_chat &&
      NextProps.loading_chat !== null &&
      NextProps.loading_chat !== this.props.loading_chat
    ) {
      this.refs.loading.show();
    } else {
      this.refs.loading.show(false);
    }
  }

  SendMsg(user_id_offers) {
    this.props.Chating(
      user_id_offers.id,
      this.props.route.params.user_id_params
    );
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
                {i18n.t("offers_order")}
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
                {i18n.t("offers_order")}
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
            <Text
              style={{
                textAlign: "right",
                fontFamily: "BOLD",
                fontSize: 14,
                color: "#2a2a2a",
                marginTop: 2,
              }}
            >
              {i18n.t("provider")}
            </Text>

            <View
              onPress={() => this.props.navigation.navigate("MyOrderDetails")}
              style={{
                flexDirection: "row-reverse",
                marginTop: 15,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                padding: 13,
                backgroundColor: "#F4F5F7",
                borderColor: "#ccc",
                borderWidth: 1,
              }}
            >
              <View
                style={{
                  flex: 2,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                }}
              >
                <View
                  style={{
                    width: 60,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  <Image
                    source={
                      this.props.route.params.item.user_id.photo
                        ? {
                            uri:
                              API_URI +
                              "/storage/" +
                              this.props.route.params.item.user_id.photo,
                          }
                        : {
                            uri: "http://mehandis.net/wp-content/uploads/2017/12/default-user.png",
                          }
                    }
                    style={{
                      overflow: "hidden",
                      width: 55,
                      height: 55,
                      borderRadius: 30,
                      borderColor: "#ccc",
                      borderWidth: 1,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#454545",
                      fontFamily: "BOLD",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 5,
                    }}
                  >
                    {this.props.route.params.item.user_id.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#454545",
                      fontFamily: "Medium",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  >
                    {this.props.route.params.item.user_id.email}
                  </Text>
                  <View
                    style={{
                      flexDirection:
                        this.props.Language == "ar" ? "row-reverse" : "row",
                    }}
                  >
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={3}
                      reversed
                      fullStarColor={"#D3A257"}
                      emptyStarColor={"#ccc"}
                      starSize={10}
                    />
                    {/* <Text style={{fontSize:10,color:'#606060',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginRight:5,marginLeft:5,marginTop:1}}>3.0</Text> */}
                    <TouchableOpacity
                      onPress={() =>
                        this.SendMsg(this.props.route.params.item.user_id)
                      }
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 20,
                        backgroundColor: "#fff",
                        borderColor: "#eee",
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: -7,
                        marginRight: 5,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="comment"
                        size={13}
                        color="#D3A257"
                        style={{ marginTop: 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    marginRight: 10,
                  }}
                ></View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#606060",
                    fontFamily: "BOLD",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {this.props.route.params.item.price} {i18n.t("riyal")}
                </Text>
              </View>
            </View>

            <Text
              style={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "BOLD",
                fontSize: 14,
                color: "#2a2a2a",
                marginTop: 20,
              }}
            >
              {i18n.t("select_payment")}
            </Text>

            <View
              style={{
                borderRadius: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => this.selectPayment("cash")}
                style={{
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  padding: 10,
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    width: 70,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 55,
                    width: 55,
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                >
                  <FontAwesome5
                    name="money-bill-wave"
                    size={20}
                    color={this.state.payment == "cash" ? "#D3A257" : "#ccc"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        this.state.payment == "cash" ? "#D3A257" : "#606060",
                      fontFamily: "BOLD",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 13,
                    }}
                  >
                    الدفع كاش
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#606060",
                      fontFamily: "Medium",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 5,
                    }}
                  >
                    الدفع كاش بعد تقديم الخدمة
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 55,
                    width: 55,
                  }}
                >
                  <FontAwesome
                    name="check-circle"
                    size={24}
                    color={this.state.payment == "cash" ? "black" : "#ccc"}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.selectPayment("card")}
                style={{
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    width: 70,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 55,
                    width: 55,
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                >
                  <FontAwesome5
                    name="money-bill-wave"
                    size={20}
                    color={this.state.payment == "card" ? "#D3A257" : "#ccc"}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        this.state.payment == "card" ? "#D3A257" : "#606060",
                      fontFamily: "BOLD",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 13,
                    }}
                  >
                    بطاقة ائتمان
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#606060",
                      fontFamily: "Medium",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 5,
                    }}
                  >
                    الدفع كاش بعد تقديم الخدمة
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 55,
                    width: 55,
                  }}
                >
                  <FontAwesome
                    name="check-circle"
                    size={24}
                    color={this.state.payment == "card" ? "black" : "#ccc"}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {this.props.loading_succeess ? (
              <View
                style={[
                  styles.btn,
                  {
                    height: 55,
                    backgroundColor: "#2a2a2a",
                    justifyContent: "center",
                    marginBottom: 40,
                    marginTop: 30,
                  },
                ]}
              >
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.accept()}
                style={[
                  styles.btn,
                  {
                    height: 55,
                    backgroundColor: "#2a2a2a",
                    justifyContent: "center",
                    marginBottom: 40,
                    marginTop: 30,
                  },
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
                  {this.state.payment == "card"
                    ? i18n.t("Next")
                    : i18n.t("send")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <Loading ref="loading" easing={Loading.EasingType.linear} />
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
    data_success: state.AcceptOrders.data,
    loading_succeess: state.AcceptOrders.loading,
    Language: state.ChecLanguage.Language,
    data_count_notification: state.CountNotification.data,

    data_chat: state.Chating.data,
    loading_chat: state.Chating.loading,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { AcceptOrders, GetMyOrder, Chating })(
  OffersPayment
);
