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
import { AcceptOrders } from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";

import StarRating from "react-native-star-rating";

class PaymentDataOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      name_cart: "",
      name_number: "",
      expire: "",
      cvc: "",
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

  async accept() {
    if (
      this.state.name_cart.trim() !== "" &&
      this.state.name_number.trim() !== "" &&
      this.state.expire.trim() !== "" &&
      this.state.cvc.trim() !== ""
    ) {
      this.props.AcceptOrders(
        this.props.route.params.item.order_id,
        this.props.route.params.item.user_id.id,
        this.props.route.params.item.price,
        "online",
        this.state.name_cart,
        this.state.name_number,
        this.state.expire
      );
    } else {
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("error_auth"),
        type: "error",
        backgroundColor: "red",
      });
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
            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
              }}
              placeholder={i18n.t("name_cart")}
              returnKeyType="done"
              autoCapitalize="none"
              placeholderTextColor={"#606060"}
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(name_cart) => this.setState({ name_cart })}
            />

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
              }}
              placeholder={i18n.t("name_number")}
              keyboardType="number-pad"
              placeholderTextColor={"#606060"}
              returnKeyType="done"
              maxLength={16}
              autoCapitalize="none"
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(name_number) => this.setState({ name_number })}
            />

            <View
              style={{
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
              }}
            >
              <View style={{ flex: 1 }}>
                <Input
                  inputStyle={{
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    fontFamily: "Medium",
                    fontSize: 15,
                  }}
                  placeholder={i18n.t("expire")}
                  keyboardType="number-pad"
                  placeholderTextColor={"#606060"}
                  returnKeyType="done"
                  autoCapitalize="none"
                  inputContainerStyle={styles.input}
                  underlineColorAndroid="transparent"
                  onChangeText={(expire) => this.setState({ expire })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  inputStyle={{
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    fontFamily: "Medium",
                    fontSize: 15,
                  }}
                  placeholder={i18n.t("cvc")}
                  keyboardType="number-pad"
                  maxLength={3}
                  returnKeyType="done"
                  placeholderTextColor={"#606060"}
                  autoCapitalize="none"
                  inputContainerStyle={styles.input}
                  underlineColorAndroid="transparent"
                  onChangeText={(cvc) => this.setState({ cvc })}
                />
              </View>
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
                    marginTop: 15,
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
                    marginTop: 15,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginTop: 3,
                  }}
                >
                  تأكيد
                </Text>
              </TouchableOpacity>
            )}
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
    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { AcceptOrders })(PaymentDataOrders);
