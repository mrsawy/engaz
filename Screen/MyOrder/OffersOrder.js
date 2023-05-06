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
import {
  GetOffersOrder,
  GetMyOrder,
  AcceptOrders,
  Chating,
} from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import Loading from "react-native-whc-loading";

import StarRating from "react-native-star-rating";
import { API_URI } from "../../constants";
class OffersOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      selected_id: null,
      data: [],
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    this.props.GetOffersOrder(this.props.route.params.id);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.props.GetOffersOrder(this.props.route.params.id);
    this.setState({ refreshing: false });
  };

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.loading_chat &&
      NextProps.loading_chat !== null &&
      NextProps.loading_chat !== this.props.loading_chat
    ) {
      this.refs.loading.show();
    } else {
      this.refs.loading.show(false);
    }

    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.setState({ data: NextProps.data });
    }
  }

  async SendMsg(user_id_offers) {
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.Chating(id_user, user_id_offers.id);
  }

  async SelectedStuts(val, less) {
    this.RBSheet.close();
    if (val == "all") {
      this.props.GetOffersOrder(this.props.route.params.id);
    } else {
      this.setState({ loading: true, data: [] });
      var id_user = await AsyncStorage.getItem("id_user");

      fetch(API_URI + "/api/get_my_orders_status_price", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          less: less,
          val: val,
          order_id: this.props.route.params.id,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "true") {
            this.setState({ data: responseJson.data, loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    }
  }

  GetData() {
    if (this.props.loading || this.state.loading) {
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

    if (this.state.data) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginTop: 15,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
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
                      item.user_id.photo
                        ? { uri: API_URI + "/storage/" + item.user_id.photo }
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
                    {item.user_id.name}
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
                    {item.user_id.email}
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
                    {/* <Text style={{flex:1,fontSize:10,color:'#606060',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginRight:5,marginLeft:5,marginTop:1}}>3.0</Text> */}

                    <TouchableOpacity
                      onPress={() => this.SendMsg(item.user_id)}
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
                  {item.price} {i18n.t("riyal")}
                </Text>

                {this.props.loading_succeess &&
                item.id == this.state.selected_id ? (
                  <View
                    style={[
                      styles.btn,
                      {
                        height: 33,
                        backgroundColor: "#D3A257",
                        justifyContent: "center",
                        marginTop: 3,
                      },
                    ]}
                  >
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("OffersPayment", {
                        item: item,
                        user_id_params: this.props.route.params.user_id,
                      })
                    }
                    style={[
                      styles.btn,
                      {
                        height: 33,
                        backgroundColor: "#D3A257",
                        justifyContent: "center",
                        marginTop: 3,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {i18n.t("accept_offers")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ margin: 15 }}>
            <TouchableOpacity
              onPress={() => this.RBSheet.open()}
              style={{
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                alignSelf:
                  this.props.Language == "ar" ? "flex-start" : "flex-end",
                padding: 8,
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                width: 120,
              }}
            >
              <MaterialCommunityIcons name="filter" size={18} color="#2a2a2a" />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Medium",
                  fontSize: 13,
                  color: "#2a2a2a",
                  marginTop: 2,
                }}
              >
                {i18n.t("View_status_price")}
              </Text>
            </TouchableOpacity>

            {this.GetData()}
          </View>
        </ScrollView>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={200}
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
                {i18n.t("View_status_price")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("all")}
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
                {i18n.t("all")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("price_less", "<")}
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
                {i18n.t("price_less")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("price_less", ">")}
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
                {i18n.t("price_more")}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

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
    Language: state.ChecLanguage.Language,
    data: state.GetOffersOrder.data,
    loading: state.GetOffersOrder.loading,

    data_chat: state.Chating.data,
    loading_chat: state.Chating.loading,

    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  GetOffersOrder,
  GetMyOrder,
  AcceptOrders,
  Chating,
})(OffersOrder);
