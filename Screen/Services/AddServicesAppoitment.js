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
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";

// let data = this.state.day_hover ? this.state.date : this.state.date_se;
// let data = this.state.time_hover ? this.state.time : this.state.time_se;

class AddServicesAppoitment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      selected_address: null,
      isDateTimePickerVisible: null,
      isTimePickerVisible: null,
      date: null,
      time: null,
      currentDay: new Date(),
      weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      day_hover: false,
      time_hover: false,
      time_se: null,
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

  SelectAddress(val) {
    this.setState({ selected_address: val });
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({
      date:
        new Date(date).getDate() +
        "," +
        this.state.weekday[new Date(date).getDay() - 1] +
        "," +
        new Date(date).getMonth() +
        "," +
        new Date(date).getFullYear(),
      day_hover: true,
      date_se: null,
    });
    this._hideDateTimePicker();
  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });

  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handlePicked = (date) => {
    this.setState({
      time: new Date(date).getHours() + ":" + new Date(date).getMinutes(),
      time_hover: true,
      time_se: null,
    });
    this._hideTimePicker();
  };

  SelectDate(d, dd, ddd, dddd) {
    this.setState({
      date_se: d + "," + dd + "," + ddd + "," + dddd,
      day_hover: false,
    });
  }

  SelectTime(t, tt) {
    this.setState({ time_se: t + ":" + tt, time_hover: false });
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
                {i18n.t("add_service")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ width: 30 }}
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
                {i18n.t("add_service")}
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
            <View
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "#eee",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  fontFamily: "Medium",
                  fontSize: 14,
                  color: "#454545",
                  marginTop: 2,
                }}
              >
                {i18n.t("services_selected")}
              </Text>

              <View
                style={{ flex: 1, flexDirection: "row-reverse", marginTop: 10 }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#454545",
                      fontFamily: "BOLD",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                    }}
                  >
                    {this.props.route.params.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#a2a2a2",
                      fontFamily: "Medium",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 3,
                    }}
                  >
                    {this.props.route.params.des}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "#eee",
                top: 45,
                position: "relative",
                zIndex: 0,
              }}
            ></View>
            <View
              style={{
                height: 1,
                width: "50%",
                backgroundColor: "#606060",
                top: 45,
                position: "relative",
                zIndex: 0,
                alignSelf:
                  this.props.Language == "ar" ? "flex-end" : "flex-start",
              }}
            ></View>

            <View
              style={{
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginTop: 15,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 10,
                    backgroundColor: "#2a2a2a",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome name="map-marker" size={25} color="#fff" />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#454545",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginTop: 7,
                  }}
                >
                  {i18n.t("spicified_address")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#454545",
                    borderWidth: 1,
                  }}
                >
                  <Ionicons name="ios-time" size={25} color="#606060" />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#8a8a8a",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginTop: 7,
                  }}
                >
                  {i18n.t("spicified_appoitment")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems:
                    this.props.Language == "ar" ? "flex-start" : "flex-end",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 10,
                    backgroundColor: "#eee",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={25}
                    color="#606060"
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#8a8a8a",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginTop: 7,
                  }}
                >
                  {i18n.t("complete_order")}
                </Text>
              </View>
            </View>

            <Divider
              style={{
                backgroundColor: "#eee",
                height: 1,
                marginTop: 15,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: this.props.Language == "ar" ? "right" : "left",
              }}
            >
              {i18n.t("day_selected")}
            </Text>

            <View
              style={{
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.SelectDate(
                    this.state.currentDay.getDate(),
                    this.state.weekday[this.state.currentDay.getDay() - 1],
                    this.state.currentDay.getMonth(),
                    this.state.currentDay.getFullYear()
                  )
                }
                style={{
                  flex: 1,
                  height: 80,
                  backgroundColor:
                    this.state.date_se ==
                    this.state.currentDay.getDate() +
                      "," +
                      this.state.weekday[this.state.currentDay.getDay() - 1] +
                      "," +
                      this.state.currentDay.getMonth() +
                      "," +
                      this.state.currentDay.getFullYear()
                      ? "#D3A257"
                      : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay() - 1] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.currentDay.getDate()}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay() - 1] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.weekday[this.state.currentDay.getDay() - 1]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.SelectDate(
                    this.state.currentDay.getDate() + 1,
                    this.state.weekday[this.state.currentDay.getDay()],
                    this.state.currentDay.getMonth(),
                    this.state.currentDay.getFullYear()
                  )
                }
                style={{
                  flex: 1,
                  height: 80,
                  backgroundColor:
                    this.state.date_se ==
                    this.state.currentDay.getDate() +
                      1 +
                      "," +
                      this.state.weekday[this.state.currentDay.getDay()] +
                      "," +
                      this.state.currentDay.getMonth() +
                      "," +
                      this.state.currentDay.getFullYear()
                      ? "#D3A257"
                      : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        1 +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay()] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.currentDay.getDate() + 1}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        1 +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay()] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.weekday[this.state.currentDay.getDay()]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.SelectDate(
                    this.state.currentDay.getDate() + 2,
                    this.state.weekday[this.state.currentDay.getDay() + 1],
                    this.state.currentDay.getMonth(),
                    this.state.currentDay.getFullYear()
                  )
                }
                style={{
                  flex: 1,
                  height: 80,
                  backgroundColor:
                    this.state.date_se ==
                    this.state.currentDay.getDate() +
                      2 +
                      "," +
                      this.state.weekday[this.state.currentDay.getDay() + 1] +
                      "," +
                      this.state.currentDay.getMonth() +
                      "," +
                      this.state.currentDay.getFullYear()
                      ? "#D3A257"
                      : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        2 +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay() + 1] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.currentDay.getDate() + 2}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color:
                      this.state.date_se ==
                      this.state.currentDay.getDate() +
                        2 +
                        "," +
                        this.state.weekday[this.state.currentDay.getDay() + 1] +
                        "," +
                        this.state.currentDay.getMonth() +
                        "," +
                        this.state.currentDay.getFullYear()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                  }}
                >
                  {this.state.weekday[this.state.currentDay.getDay() + 1]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._showDateTimePicker()}
                style={{
                  flex: 2,
                  height: 80,
                  backgroundColor: this.state.day_hover ? "#D3A257" : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                {this.state.date ? (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: this.state.day_hover ? "#fff" : "#454545",
                        fontFamily: "BOLD",
                        textAlign: "right",
                      }}
                    >
                      {this.state.date}
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="calendar-plus"
                      size={24}
                      color="#606060"
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#454545",
                        fontFamily: "Medium",
                        textAlign: "center",
                      }}
                    >
                      {i18n.t("day_selected")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode="date"
            />

            <Divider
              style={{
                backgroundColor: "#eee",
                height: 1,
                marginTop: 15,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: this.props.Language == "ar" ? "right" : "left",
              }}
            >
              {i18n.t("time_selected")}
            </Text>

            <View
              style={{
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.SelectTime(
                    this.state.currentDay.getHours(),
                    this.state.currentDay.getMinutes()
                  )
                }
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor:
                    this.state.time_se ==
                    this.state.currentDay.getHours() +
                      ":" +
                      this.state.currentDay.getMinutes()
                      ? "#D3A257"
                      : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      this.state.time_se ==
                      this.state.currentDay.getHours() +
                        ":" +
                        this.state.currentDay.getMinutes()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                    marginTop: 3,
                  }}
                >
                  {this.state.currentDay.getHours() +
                    ":" +
                    this.state.currentDay.getMinutes()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.SelectTime(
                    this.state.currentDay.getHours() + 1,
                    this.state.currentDay.getMinutes()
                  )
                }
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor:
                    this.state.time_se ==
                    this.state.currentDay.getHours() +
                      1 +
                      ":" +
                      this.state.currentDay.getMinutes()
                      ? "#D3A257"
                      : "#fff",
                  borderRadius: 10,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      this.state.time_se ==
                      this.state.currentDay.getHours() +
                        1 +
                        ":" +
                        this.state.currentDay.getMinutes()
                        ? "#fff"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: "right",
                    marginTop: 3,
                  }}
                >
                  {this.state.currentDay.getHours() +
                    1 +
                    ":" +
                    this.state.currentDay.getMinutes()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._showTimePicker()}
                style={{
                  flexDirection: "row-reverse",
                  flex: 2,
                  height: 50,
                  backgroundColor: this.state.time_hover ? "#D3A257" : "#fff",
                  borderRadius: 10,
                  marginLeft: this.props.Language == "ar" ? 10 : 0,
                  marginRight: this.props.Language == "en" ? 10 : 0,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                {this.state.time ? (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: this.state.time_hover ? "#fff" : "#454545",
                        fontFamily: "BOLD",
                        textAlign: "right",
                      }}
                    >
                      {this.state.time}
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons
                      name="ios-time"
                      size={24}
                      style={{ marginLeft: 10 }}
                      color="#606060"
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#454545",
                        fontFamily: "Medium",
                        textAlign: "center",
                      }}
                    >
                      {i18n.t("time_selected")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <DateTimePicker
              isVisible={this.state.isTimePickerVisible}
              onConfirm={this._handlePicked}
              onCancel={this._hideTimePicker}
              mode="time"
            />

            {(this.state.date && this.state.time) ||
            (this.state.date_se && this.state.time_se) ||
            (this.state.date && this.state.time_se) ||
            (this.state.date_se && this.state.time) ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("AddServicesComplete", {
                    subcategories_id: this.props.route.params.subcategories_id,
                    address_id: this.props.route.params.address_id,
                    title: this.props.route.params.title,
                    des: this.props.route.params.des,
                    date: this.state.day_hover
                      ? this.state.date
                      : this.state.date_se,
                    time: this.state.time_hover
                      ? this.state.time
                      : this.state.time_se,
                    maincategories_id:
                      this.props.route.params.maincategories_id,
                  })
                }
                style={[
                  styles.btn,
                  {
                    backgroundColor: "#000",
                    justifyContent: "center",
                    marginBottom: 40,
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
                  {i18n.t("Next")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.btn,
                  {
                    backgroundColor: "#606060",
                    justifyContent: "center",
                    marginBottom: 40,
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
                  {i18n.t("Next")}
                </Text>
              </View>
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
    marginTop: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, {})(AddServicesAppoitment);
