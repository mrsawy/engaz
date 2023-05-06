import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Header, SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import {
  GetNotificationFun,
  ReadNotificationFun,
  CountNotificationFun,
} from "../Actions";
import i18n from "../Language";

import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/BOLD.otf"),
      REGULAR: require("../Fonts/REGULAR.otf"),
    });

    this.setState({ fontLoaded: true });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    var id = await AsyncStorage.getItem("id_user");
    this.props.GetNotificationFun(id);
    this.props.ReadNotificationFun(id);
    this.props.CountNotificationFun(id);
    this.setState({ refreshing: false });
  };

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id = await AsyncStorage.getItem("id_user");
    this.props.GetNotificationFun(id);
    this.props.ReadNotificationFun(id);
    this.props.CountNotificationFun(id);
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data_hide &&
      NextProps.data_hide !== null &&
      NextProps.data_hide !== this.props.data_hide
    ) {
      var id = await AsyncStorage.getItem("id_user");
      this.props.GetNotificationFun(id);
    }
  }

  RenderContent() {
    if (this.props.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
            marginTop: 15,
          }}
        >
          <ActivityIndicator size="small" color="#454545" />
        </View>
      );
    }

    if (this.props.data) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                backgroundColor: "#eee",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                flexDirection: "row-reverse",
                padding: 15,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "BOLD",
                    fontSize: 15,
                    textAlign: "right",
                    marginRight: 10,
                    marginLeft: 10,
                    color: "#2a2a2a",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "REGULAR",
                    fontSize: 15,
                    textAlign: "right",
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                >
                  {item.description}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "REGULAR",
                  fontSize: 14,
                  color: "#8a8a8a",
                  textAlign: "left",
                  padding: 5,
                }}
              >
                {item.created_date}
              </Text>
            </View>
          )}
          keyExtractor={({ id }, index) => id}
        />
      );
    }

    if (!this.props.data) {
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
            name="bell-o"
            type="font-awesome"
            size={60}
            color={"#cfcfcf"}
            iconStyle={{ marginBottom: 10 }}
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

    if (this.props.data_errorServer) {
      return (
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ backgroundColor: "#905b28" }}>
            <View
              style={{
                backgroundColor: "#905b28",
                flexDirection: "row-reverse",
                height: Platform.OS === "ios" ? 50 : 60,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: Platform.OS === "ios" ? 0 : 5,
                marginTop: Platform.OS === "ios" ? 0 : 20,
              }}
            >
              <View style={styles.centerName}>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "REGULAR",
                    fontSize: 19,
                    textAlign: "right",
                  }}
                >
                  {i18n.t("notification")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Home")}
                style={{
                  padding: 10,
                  left: 10,
                  top: Platform.OS === "ios" ? 0 : 15,
                  position: "absolute",
                }}
              >
                <Icon
                  name="long-arrow-right"
                  type="font-awesome"
                  size={21}
                  color={"#fff"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Icon
              name="wifi-off"
              type="feather"
              size={70}
              color={"#454545"}
              iconStyle={{ marginBottom: 10 }}
            />
            <Text style={{ fontFamily: "REGULAR", fontSize: 16 }}>
              لا يوجد اتصال بالانترنت
            </Text>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#905b28" }]}
              onPress={() => this._onRefresh()}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "REGULAR",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                اعادة المحاولة
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
                {i18n.t("notification")}
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
                {i18n.t("notification")}
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ margin: 15 }}>{this.RenderContent()}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  leftIcon: {
    position: "absolute",
  },
  btn: {
    borderRadius: 4,
    height: 45,
    justifyContent: "center",
    marginTop: 15,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.GetNotification.loading,
    data: state.GetNotification.data,
    data_errorServer: state.GetNotification.errorServer,

    Language: state.ChecLanguage.Language,
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  GetNotificationFun,
  ReadNotificationFun,
  CountNotificationFun,
})(Notification);
