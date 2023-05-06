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
  FlatList,
  RefreshControl,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { AddOffer, GetMyOrder, LastOrderProvider } from "../../Actions";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";

class AddOffers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      price: "",
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

  async accept() {
    var id_user = await AsyncStorage.getItem("id_user");
    if (this.state.price.trim() !== "") {
      this.props.AddOffer(
        id_user,
        this.props.route.params.item.id,
        this.state.price
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
      this.props.LastOrderProvider(id_user);

      setTimeout(async () => {
        this.props.navigation.goBack();
      }, 1500);
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
          onPress={() => this.accept()}
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
                {i18n.t("add_offers")}
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
                {i18n.t("add_offers")}
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
              placeholder={i18n.t("add_offers")}
              keyboardType="number-pad"
              returnKeyType="done"
              autoCapitalize="none"
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(price) => this.setState({ price })}
              rightIcon={
                this.props.Language == "ar" ? (
                  <View
                    style={{
                      borderLeftColor: "#ccc",
                      borderLeftWidth: 1,
                      paddingLeft: 10,
                    }}
                  >
                    <FontAwesome5
                      name="money-bill-wave"
                      size={21}
                      color="#2a2a2a"
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: "Medium",
                        fontSize: 13,
                        color: "#2a2a2a",
                        marginTop: 3,
                      }}
                    >
                      {i18n.t("riyal")}
                    </Text>
                  </View>
                )
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
                    <FontAwesome5
                      name="money-bill-wave"
                      size={21}
                      color="#2a2a2a"
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: "Medium",
                        fontSize: 13,
                        color: "#2a2a2a",
                        marginTop: 3,
                      }}
                    >
                      {i18n.t("riyal")}
                    </Text>
                  </View>
                )
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
    height: 50,
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    Language: state.ChecLanguage.Language,
    data_success: state.AddOffers.data,
    loading: state.AddOffers.loading,
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  AddOffer,
  GetMyOrder,
  LastOrderProvider,
})(AddOffers);
