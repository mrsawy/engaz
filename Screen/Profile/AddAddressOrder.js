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
import { StoreAddress, GetAddress, GetGovernorate } from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class AddAddressOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      type: "",
      description: "",
      city: "",
      governorate: "",
      latitude: "",
      longitude: "",
      city_id: null,
      governorate_id: null,
      data_governorate: [],
      loading_governorate: false,
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

  SelectCarAddress(val) {
    if (val == "home") {
      this.setState({ type: i18n.t("home") });
    } else if (val == "office") {
      this.setState({ type: i18n.t("office") });
    } else {
      this.setState({ type: i18n.t("other") });
    }

    this.RBSheet.close();
  }

  SelectCity(val, id) {
    this.setState({
      city: val,
      city_id: id,
      governorate: null,
      loading_governorate: true,
    });
    // this.props.GetGovernorate(id);

    const formData = new FormData();
    formData.append("id", id);

    fetch(API_URI + "/api/get_governorate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading_governorate: false });

        if (responseJson.status == "true") {
          this.setState({ data_governorate: responseJson.data });
        } else {
          this.setState({ data_governorate: [] });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetGovernorateFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });

    this.RBSheetCity.close();
  }

  SelectGovernorate(val, id) {
    this.setState({ governorate: val, governorate_id: id });
    this.RBSheet2.close();
  }

  componentDidMount() {
    this.LoadFontAsync();

    this._onFocusListener = this.props.navigation.addListener(
      "didFocus",
      async (payload) => {
        var latitude = this.props.route.params?.latitude;
        var longitude = this.props.route.params?.longitude;
        this.setState({ latitude: latitude, longitude: longitude });
      }
    );
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      showMessage({
        message: i18n.t("success"),
        description: i18n.t("success_des"),
        type: "success",
        backgroundColor: "green",
      });

      const id_user = await AsyncStorage.getItem("id_user");
      this.props.GetAddress(id_user);

      setTimeout(async () => {
        this.props.navigation.goBack();
      }, 1500);
    }
  }

  async Confirm() {
    var id_user = await AsyncStorage.getItem("id_user");
    const {
      type,
      city_id,
      governorate_id,
      description,
      longitude,
      latitude,
      city,
      governorate,
    } = this.state;
    if (
      type.trim() !== "" &&
      city.trim() !== "" &&
      governorate.trim() !== "" &&
      description.trim() !== ""
    ) {
      this.props.StoreAddress(
        id_user,
        type,
        city_id,
        governorate_id,
        description,
        longitude,
        latitude
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

  renderBtn() {
    if (this.props.loading) {
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
          onPress={() => this.Confirm()}
          style={[
            styles.btn,
            { backgroundColor: "#000", justifyContent: "center" },
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
            {i18n.t("add_address_new")}
          </Text>
        </TouchableOpacity>
      );
    }
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
                {i18n.t("add_address_new")}
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
                {i18n.t("add_address_new")}
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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
        >
          <ScrollView>
            <View style={{ margin: 15 }}>
              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
                style={[
                  styles.input,
                  {
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection:
                      this.props.Language == "ar" ? "row" : "row-reverse",
                    height: 55,
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    width: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="angle-down" size={21} color="#2a2a2a" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: this.state.type ? "#2a2a2a" : "#b5b5b5",
                    fontFamily: "Medium",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 4,
                  }}
                >
                  {this.state.type ? this.state.type : i18n.t("cat_address")}
                </Text>
              </TouchableOpacity>

              <RBSheet
                ref={(ref) => {
                  this.RBSheet = ref;
                }}
                height={250}
                duration={0}
                customStyles={{}}
              >
                <View>
                  <View
                    style={{
                      borderBottomColor: "#eee",
                      borderBottomWidth: 2,
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("cat_address")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.SelectCarAddress("home")}
                    style={{
                      padding: 10,
                      borderBottomColor: "#eee",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#2a2a2a",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("home")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.SelectCarAddress("office")}
                    style={{
                      padding: 10,
                      borderBottomColor: "#eee",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#2a2a2a",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("office")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.SelectCarAddress("other")}
                    style={{
                      padding: 10,
                      borderBottomColor: "#eee",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#2a2a2a",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("other")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>

              <Input
                inputStyle={{
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  fontFamily: "Medium",
                  fontSize: 15,
                }}
                placeholder={i18n.t("des_address")}
                returnKeyType="done"
                autoCapitalize="none"
                inputContainerStyle={[styles.input, { paddingLeft: 20 }]}
                underlineColorAndroid="transparent"
                onChangeText={(description) => this.setState({ description })}
              />

              <TouchableOpacity
                onPress={() => this.RBSheetCity.open()}
                style={[
                  styles.input,
                  {
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    height: 55,
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: this.state.city ? "#2a2a2a" : "#b5b5b5",
                    fontFamily: "Medium",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 4,
                    paddingRight: this.props.Language == "ar" ? 15 : 0,
                    paddingLeft: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.state.city ? this.state.city : i18n.t("city")}
                </Text>
                <View
                  style={{
                    width: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="angle-down" size={21} color="#2a2a2a" />
                </View>
              </TouchableOpacity>

              <RBSheet
                ref={(ref) => {
                  this.RBSheetCity = ref;
                }}
                height={250}
                duration={0}
                customStyles={{}}
              >
                <View>
                  <View
                    style={{
                      borderBottomColor: "#eee",
                      borderBottomWidth: 2,
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("select_city")}
                    </Text>
                  </View>

                  {this.props.data_city ? (
                    <ScrollView>
                      <View style={{ marginBottom: 30 }}>
                        {this.props.data_city.map((item) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.SelectCity(item.name, item.id)
                              }
                              style={{
                                padding: 10,
                                borderBottomColor: "#eee",
                                borderBottomWidth: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: "#2a2a2a",
                                  fontFamily: "Medium",
                                  textAlign: "center",
                                  marginTop: 4,
                                }}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  ) : (
                    <ActivityIndicator size="small" color="#2a2a2a" />
                  )}
                </View>
              </RBSheet>

              <TouchableOpacity
                onPress={() => this.RBSheet2.open()}
                style={[
                  styles.input,
                  {
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    height: 55,
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: this.state.governorate ? "#2a2a2a" : "#b5b5b5",
                    fontFamily: "Medium",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 4,
                    paddingRight: this.props.Language == "ar" ? 15 : 0,
                    paddingLeft: this.props.Language == "en" ? 15 : 0,
                  }}
                >
                  {this.state.governorate
                    ? this.state.governorate
                    : i18n.t("governorate")}
                </Text>
                <View
                  style={{
                    width: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="angle-down" size={21} color="#2a2a2a" />
                </View>
              </TouchableOpacity>

              <RBSheet
                ref={(ref) => {
                  this.RBSheet2 = ref;
                }}
                height={250}
                duration={0}
                customStyles={{}}
              >
                <View>
                  <View
                    style={{
                      borderBottomColor: "#eee",
                      borderBottomWidth: 2,
                      padding: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {i18n.t("select_city")}
                    </Text>
                  </View>

                  {this.state.data_governorate.length > 0 &&
                  !this.state.loading_governorate ? (
                    <ScrollView>
                      <View style={{ marginBottom: 30 }}>
                        {this.state.data_governorate.map((item) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.SelectGovernorate(item.name, item.id)
                              }
                              style={{
                                padding: 10,
                                borderBottomColor: "#eee",
                                borderBottomWidth: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: "#2a2a2a",
                                  fontFamily: "Medium",
                                  textAlign: "center",
                                  marginTop: 4,
                                }}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  ) : null}

                  {this.state.loading_governorate ? (
                    <View style={{ padding: 15 }}>
                      <ActivityIndicator size="small" color="#2a2a2a" />
                    </View>
                  ) : null}

                  {this.state.data_governorate.length == 0 &&
                  !this.state.loading_governorate ? (
                    <View style={{ padding: 15 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#2a2a2a",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 4,
                        }}
                      >
                        {i18n.t("no_order")}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </RBSheet>

              {this.renderBtn()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    data_city: state.GetCity.data,
    data_governorate: state.GetGovernorate.data,
    data_count_notification: state.CountNotification.data,

    data: state.StoreAddress.data,
    loading: state.StoreAddress.loading,

    Language: state.ChecLanguage.Language,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  StoreAddress,
  GetAddress,
  GetGovernorate,
})(AddAddressOrder);
