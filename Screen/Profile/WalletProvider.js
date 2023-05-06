import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Divider } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { GetWallet, GetWalletLog } from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class WalletProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      selected: "log",
      avilable_wallet: "",
      name_cart: "",
      name_number: "",
      loading: false,
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetWallet(id_user);
    this.props.GetWalletLog(id_user);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetWallet(id_user);
    this.props.GetWalletLog(id_user);

    this.setState({ refreshing: false });
  };

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

  RenderData() {
    if (this.props.loading) {
      return <ActivityIndicator size="small" color="#454545" />;
    }

    if (this.props.data) {
      return (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Medium",
            fontSize: 30,
            color: "#454545",
            marginTop: 4,
          }}
        >
          {this.props.data.available_balance} {i18n.t("riyal")}
        </Text>
      );
    }

    if (!this.props.data) {
      return (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Medium",
            fontSize: 30,
            color: "#454545",
            marginTop: 4,
          }}
        >
          0 {i18n.t("riyal")}
        </Text>
      );
    }
  }

  RenderDataPend() {
    if (this.props.loading) {
      return <ActivityIndicator size="small" color="#454545" />;
    }

    if (this.props.data) {
      return (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Medium",
            fontSize: 30,
            color: "#454545",
            marginTop: 4,
          }}
        >
          {this.props.data.qutstanding_balance} {i18n.t("riyal")}
        </Text>
      );
    }

    if (!this.props.data) {
      return (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Medium",
            fontSize: 30,
            color: "#454545",
            marginTop: 4,
          }}
        >
          0 {i18n.t("riyal")}
        </Text>
      );
    }
  }

  RenderDataLog() {
    if (this.props.loading_log) {
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
          <ActivityIndicator size="small" color="#454545" />
        </View>
      );
    }

    if (this.props.data_log) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data_log}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginLeft: -15,
                marginRight: -15,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text
                style={{
                  lineHeight: 25,
                  flex: 1,
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  fontFamily: "Medium",
                  fontSize: 15,
                  color: "#454545",
                  marginTop: 4,
                }}
              >
                {item.description}
              </Text>
              <Text
                style={{
                  width: 80,
                  textAlign: this.props.Language == "ar" ? "left" : "right",
                  fontFamily: "BOLD",
                  fontSize: 13,
                  color: "#454545",
                  marginTop: 4,
                }}
              >
                {item.movement_type == "deposit" ? "+" : "-"} {item.value}{" "}
                {i18n.t("riyal")}
              </Text>
            </View>
          )}
          keyExtractor={({ id }, index) => id}
        />
      );
    }

    if (!this.props.data_log) {
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

  ChangeState(val) {
    this.setState({ selected: val });
  }

  async Withdraw() {
    if (
      this.state.avilable_wallet.trim() !== "" &&
      this.state.name_cart.trim() !== "" &&
      this.state.name_number.trim() !== ""
    ) {
      if (
        Number(this.state.avilable_wallet) <=
        Number(this.props.data.available_balance)
      ) {
        this.setState({ loading: true });

        var id_user = await AsyncStorage.getItem("id_user");
        fetch(API_URI + "/api/withdraw_store", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: id_user,
            value_withdrawals: this.state.avilable_wallet,
            name_card: this.state.name_number,
            card_number: this.state.name_number,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ loading: false });

            if (responseJson.status == "true") {
              this.setState({
                avilable_wallet: "",
                name_number: "",
                name_number: "",
              });
              showMessage({
                message: i18n.t("success"),
                description: i18n.t("success_des"),
                type: "success",
                backgroundColor: "green",
              });
            } else {
              showMessage({
                message: i18n.t("errorr"),
                description: "لديك طلب سحب سابق , انتظر رد الادارة",
                type: "error",
                backgroundColor: "red",
              });
            }
          })
          .catch((error) => {});
      } else {
        showMessage({
          message: i18n.t("errorr"),
          description: "يجب أن تكون القيمة أقل او يساوي فيمة رصيدك المتاح",
          type: "error",
          backgroundColor: "red",
        });
      }
    } else {
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("error_auth"),
        type: "error",
        backgroundColor: "red",
      });
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
                {i18n.t("my_wallet")}
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
                {i18n.t("my_wallet")}
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
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={{ margin: 10 }}>
              <View style={{ flexDirection: "row-reverse" }}>
                <View
                  style={{
                    flex: 1,
                    padding: 30,
                    backgroundColor: "#eee",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Medium",
                      fontSize: 15,
                      color: "#2a2a2a",
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    {i18n.t("pending_wallet")}
                  </Text>

                  {this.RenderDataPend()}
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 30,
                    backgroundColor: "#eee",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Medium",
                      fontSize: 15,
                      color: "#2a2a2a",
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    {i18n.t("avilable_wallet")}
                  </Text>

                  {this.RenderData()}
                </View>
              </View>

              <View
                style={{
                  margin: 10,
                  marginTop: 20,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  flexDirection: "row-reverse",
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 12,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor:
                      this.state.selected == "log" ? "#2a2a2a" : "#eee",
                  }}
                  onPress={() => this.ChangeState("log")}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily:
                        this.state.selected == "log" ? "BOLD" : "Medium",
                      fontSize: 13,
                      color: this.state.selected == "log" ? "#fff" : "#2a2a2a",
                      marginTop: 4,
                    }}
                  >
                    {i18n.t("log_wallet")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 12,
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                    backgroundColor:
                      this.state.selected == "withdraw" ? "#2a2a2a" : "#eee",
                  }}
                  onPress={() => this.ChangeState("withdraw")}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily:
                        this.state.selected == "withdraw" ? "BOLD" : "Medium",
                      fontSize: 13,
                      color:
                        this.state.selected == "withdraw" ? "#fff" : "#2a2a2a",
                      marginTop: 4,
                    }}
                  >
                    {i18n.t("withdraw")}
                  </Text>
                </TouchableOpacity>
              </View>

              {this.state.selected == "log" ? (
                <View style={{ margin: 10 }}>{this.RenderDataLog()}</View>
              ) : (
                <View>
                  <View
                    style={{
                      margin: 10,
                      backgroundColor: "#f1f1f1",
                      padding: 15,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#eee",
                    }}
                  >
                    <Input
                      inputStyle={{
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        fontFamily: "Medium",
                        fontSize: 15,
                      }}
                      placeholder={i18n.t("avilable_wallet")}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      autoCapitalize="none"
                      placeholderTextColor={"#606060"}
                      inputContainerStyle={styles.input}
                      underlineColorAndroid="transparent"
                      onChangeText={(avilable_wallet) =>
                        this.setState({ avilable_wallet })
                      }
                    />

                    <Input
                      inputStyle={{
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
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
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
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
                      onChangeText={(name_number) =>
                        this.setState({ name_number })
                      }
                    />
                  </View>

                  <View>
                    {this.state.loading ? (
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
                        onPress={() => this.Withdraw()}
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
                          {i18n.t("send")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
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
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderWidth: 1,
  },
  btn: {
    borderRadius: 30,
    height: 55,
    justifyContent: "center",
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.GetWallet.loading,
    data: state.GetWallet.data,

    loading_log: state.GetWalletLog.loading,
    data_log: state.GetWalletLog.data,
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, { GetWallet, GetWalletLog })(
  WalletProvider
);
