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
  FlatList,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { GetMyOrder, Chating } from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import Loading from "react-native-whc-loading";

import StarRating from "react-native-star-rating";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { API_URI } from "../../constants";
class MyOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      data: [],
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetMyOrder(id_user);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.GetMyOrder(id_user);
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
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.setState({ data: NextProps.data });
    }

    if (
      NextProps.data_chat &&
      NextProps.data_chat !== null &&
      NextProps.data_chat !== this.props.data_chat
    ) {
      this.props.navigation.navigate("MessageDetails", {
        item: NextProps.data_chat,
      });
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

  async SelectedStuts(val) {
    this.RBSheet.close();
    if (val == "all") {
      var id_user = await AsyncStorage.getItem("id_user");
      this.props.GetMyOrder(id_user);
    } else {
      this.setState({ loading: true, data: [] });
      var id_user = await AsyncStorage.getItem("id_user");

      fetch(API_URI + "/api/get_my_orders_status", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          val: val,
          user_id: id_user,
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

  Cancel(id) {
    fetch(API_URI + "/api/canceled_order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_order: id,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status == "true") {
          var id_user = await AsyncStorage.getItem("id_user");
          this.props.GetMyOrder(id_user);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  SendMsg(user_id_offers, user_id) {
    this.props.Chating(user_id_offers, user_id);
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
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    fontFamily: "Medium",
                    fontSize: 12,
                    color: "#2a2a2a",
                    marginTop: 6,
                  }}
                >
                  {i18n.t("order_date")} : {item.created_date}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: this.props.Language == "ar" ? "left" : "right",
                    fontFamily: "Medium",
                    fontSize: 12,
                    color: "#2a2a2a",
                    marginTop: 6,
                  }}
                >
                  {i18n.t("order_num")} : {item.id}
                </Text>

                {item.order_status == "new" ? (
                  <Menu style={{ width: 30, height: 30 }}>
                    <MenuTrigger style={{ width: 30, height: 30 }}>
                      <MaterialIcons
                        name="more-vert"
                        size={22}
                        color="#2a2a2a"
                      />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => this.Cancel(item.id)}
                        style={{
                          padding: 10,
                          flexDirection:
                            this.props.Language == "ar" ? "row-reverse" : "row",
                        }}
                      >
                        <Text
                          style={{
                            textAlign:
                              this.props.Language == "ar" ? "left" : "right",
                            fontFamily: "Medium",
                            fontSize: 12,
                            color: "#2a2a2a",
                            marginTop: 3,
                          }}
                        >
                          {i18n.t("Cancelling_order")}
                        </Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                ) : null}
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  marginTop: 10,
                  borderBottomColor: "#dfdfdf",
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 60,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  {item.image1 ? (
                    <Image
                      source={
                        item.image1
                          ? { uri: item.image1 }
                          : {
                              uri: "http://mehandis.net/wp-content/uploads/2017/12/default-user.png",
                            }
                      }
                      style={{
                        overflow: "hidden",
                        width: 55,
                        height: 55,
                        borderRadius: 10,
                        borderColor: "#ccc",
                        borderWidth: 1,
                      }}
                    />
                  ) : null}
                  {item.image2 && !item.image1 ? (
                    <Image
                      source={
                        item.image2
                          ? { uri: item.image2 }
                          : {
                              uri: "http://mehandis.net/wp-content/uploads/2017/12/default-user.png",
                            }
                      }
                      style={{
                        overflow: "hidden",
                        width: 55,
                        height: 55,
                        borderRadius: 10,
                        borderColor: "#ccc",
                        borderWidth: 1,
                      }}
                    />
                  ) : null}
                  {item.image3 && !item.image1 && !item.image2 ? (
                    <Image
                      source={
                        item.image3
                          ? { uri: item.image3 }
                          : {
                              uri: "http://mehandis.net/wp-content/uploads/2017/12/default-user.png",
                            }
                      }
                      style={{
                        overflow: "hidden",
                        width: 55,
                        height: 55,
                        borderRadius: 10,
                        borderColor: "#ccc",
                        borderWidth: 1,
                      }}
                    />
                  ) : null}
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                    marginRight: 7,
                    marginLeft: 7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#454545",
                      fontFamily: "BOLD",
                      textAlign: "right",
                    }}
                  >
                    {this.props.Language == "ar"
                      ? item.subcategories_id_id.name_subcategories_ar
                      : item.subcategories_id_id.name_subcategories_en}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#a2a2a2",
                      fontFamily: "Medium",
                      textAlign: "right",
                      marginTop: 3,
                    }}
                  >
                    {this.props.Language == "ar"
                      ? item.maincategories_id_id.name_ar
                      : item.maincategories_id_id.name_en}
                  </Text>
                </View>

                {item.order_status == "new" ? (
                  <View
                    style={{
                      height: 25,
                      width: 90,
                      backgroundColor: "#707A89",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 1,
                      }}
                    >
                      {i18n.t("new")}
                    </Text>
                  </View>
                ) : null}

                {item.order_status == "in_progress" ? (
                  <View
                    style={{
                      height: 25,
                      width: 90,
                      backgroundColor: "#F97534",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 1,
                      }}
                    >
                      {i18n.t("in_progress")}
                    </Text>
                  </View>
                ) : null}

                {item.order_status == "completed" ? (
                  <View
                    style={{
                      height: 25,
                      width: 90,
                      backgroundColor: "#457045",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 1,
                      }}
                    >
                      {i18n.t("completed")}
                    </Text>
                  </View>
                ) : null}

                {item.order_status == "canceled" ? (
                  <View
                    style={{
                      height: 25,
                      width: 90,
                      backgroundColor: "#704545",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 1,
                      }}
                    >
                      {i18n.t("canceled")}
                    </Text>
                  </View>
                ) : null}
              </View>

              {!item.user_id_offers ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    marginTop: 10,
                    borderBottomColor: "#dfdfdf",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                  }}
                >
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#2a2a2a",
                        fontFamily: "BOLD",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        marginTop: 1,
                      }}
                    >
                      {i18n.t("offers_order")}: ({item.offers_count})
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("OffersOrder", {
                        id: item.id,
                        user_id: item.user_id,
                      })
                    }
                    style={{
                      height: 25,
                      width: 110,
                      backgroundColor: "#D3A257",
                      borderRadius: 15,
                      alignItems: "center",
                      flexDirection:
                        this.props.Language == "ar" ? "row" : "row-reverse",
                    }}
                  >
                    <Feather
                      name={
                        this.props.Language == "ar"
                          ? "arrow-left"
                          : "arrow-right"
                      }
                      size={17}
                      color="#fff"
                      style={{
                        marginLeft: this.props.Language == "ar" ? 7 : 0,
                        marginRight: this.props.Language == "en" ? 7 : 0,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        marginTop: 1,
                        marginRight: this.props.Language == "ar" ? 15 : 0,
                        marginLeft: this.props.Language == "en" ? 15 : 0,
                      }}
                    >
                      {i18n.t("watch")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                    marginTop: 10,
                    borderBottomColor: "#dfdfdf",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
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
                          this.props.Language == "ar"
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <Image
                        source={
                          item.user_id_offers.photo
                            ? {
                                uri:
                                  API_URI +
                                  "/storage/" +
                                  item.user_id_offers.photo,
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
                        flex: 2,
                        justifyContent: "center",
                        alignItems:
                          this.props.Language == "ar"
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#454545",
                          fontFamily: "BOLD",
                          textAlign:
                            this.props.Language == "ar" ? "right" : "left",
                          marginTop: 5,
                        }}
                      >
                        {item.user_id_offers.name}
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
                          rating={Number(item.user_id_offers.rating).toFixed(2)}
                          reversed
                          fullStarColor={"#D3A257"}
                          emptyStarColor={"#ccc"}
                          starSize={10}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#606060",
                            fontFamily: "Medium",
                            textAlign:
                              this.props.Language == "ar" ? "right" : "left",
                            marginRight: 5,
                            marginLeft: 5,
                            marginTop: 1,
                          }}
                        >
                          {Number(item.user_id_offers.rating).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        this.SendMsg(item.user_id_offers.id, item.user_id)
                      }
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexDirection:
                          this.props.Language == "ar" ? "row" : "row-reverse",
                        marginRight: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 20,
                          backgroundColor: "#fff",
                          borderColor: "#eee",
                          borderWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 0,
                          marginRight: 5,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="comment"
                          size={13}
                          color="#D3A257"
                          style={{ marginTop: 2 }}
                        />
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 13,
                          color: "#606060",
                          fontFamily: "Medium",
                          textAlign:
                            this.props.Language == "ar" ? "left" : "right",
                          marginRight: 5,
                          marginLeft: 5,
                          marginTop: 3,
                        }}
                      >
                        {i18n.t("chating")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!item.user_id_offers ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("MyOrderDetails", {
                        item: item,
                      })
                    }
                    style={[
                      styles.btn,
                      { backgroundColor: "#2a2a2a", justifyContent: "center" },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 3,
                      }}
                    >
                      {i18n.t("order_details")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("MyOrderDetails", {
                        item: item,
                      })
                    }
                    style={[
                      styles.btn,
                      { backgroundColor: "#707A89", justifyContent: "center" },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 3,
                      }}
                    >
                      {i18n.t("order_canceled")}
                    </Text>
                  </TouchableOpacity>
                  {item.request_cancel == "yes" &&
                  item.order_status !== "canceled" ? (
                    <TouchableOpacity
                      onPress={() => this.Cancel(item.id)}
                      style={[
                        styles.btn,
                        {
                          backgroundColor: "#c51616",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 3,
                        }}
                      >
                        {i18n.t("Cancelling_order")}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection:
                      this.props.Language == "ar" ? "row-reverse" : "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("MyOrderDetails", {
                        item: item,
                      })
                    }
                    style={[
                      styles.btn,
                      { backgroundColor: "#2a2a2a", justifyContent: "center" },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontFamily: "Medium",
                        textAlign: "center",
                        marginTop: 3,
                      }}
                    >
                      {i18n.t("order_details")}
                    </Text>
                  </TouchableOpacity>
                  {item.request_cancel == "yes" &&
                  item.order_status !== "canceled" ? (
                    <TouchableOpacity
                      onPress={() => this.Cancel(item.id)}
                      style={[
                        styles.btn,
                        {
                          backgroundColor: "#c51616",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 3,
                        }}
                      >
                        {i18n.t("Cancelling_order")}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}

              {item.request_cancel == "yes" &&
              item.order_status !== "canceled" ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#c51616",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginTop: 3,
                  }}
                >
                  {i18n.t("request_Cancelling_order_des")}
                </Text>
              ) : null}
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
    if (!this.props.is_login) {
      return (
        <View style={[styles.container, { backgroundColor: "#fff" }]}>
          <StatusBar
            translucent={true}
            barStyle="light-content"
            backgroundColor={"transparent"}
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
                  {i18n.t("my_orders")}
                </Text>
              </View>
              <View></View>
            </Header>
          ) : (
            <Header
              backgroundColor={"#2A2A2A"}
              containerStyle={{ borderBottomWidth: 0 }}
            >
              <View></View>

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
                  {i18n.t("my_orders")}
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
            <Text
              style={{
                fontFamily: "BOLD",
                fontSize: 16,
                color: "#969696",
                marginRight: 30,
                marginLeft: 30,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {i18n.t("login_s")}
            </Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
              style={[
                {
                  width: 150,
                  height: 55,
                  marginBottom: 5,
                  borderRadius: 30,
                  justifyContent: "center",
                  marginLeft: 5,
                  marginRight: 5,
                  marginBottom: 10,
                  backgroundColor: "#2A2A2A",
                  marginTop: 20,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#fff",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("login")}
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
                {/* <View style={{position:'absolute',left:17 ,justifyContent:'center',
                    top:-3, width:10,height:10,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                </View> */}
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
                {i18n.t("my_orders")}
              </Text>
            </View>
            <View />
          </Header>
        ) : (
          <Header
            backgroundColor={"#2A2A2A"}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            <View />

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
                {i18n.t("my_orders")}
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
                {i18n.t("View_status")}
              </Text>
            </TouchableOpacity>

            {this.GetData()}
          </View>
        </ScrollView>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={300}
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
                {i18n.t("View_status")}
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
                  fontSize: 14,
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
              onPress={() => this.SelectedStuts("new")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("new")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("in_progress")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("in_progress")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("completed")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("completed")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("canceled")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("canceled")}
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

    data: state.GetMyOrder.data,
    loading: state.GetMyOrder.loading,

    data_chat: state.Chating.data,
    loading_chat: state.Chating.loading,

    data_count_notification: state.CountNotification.data,
    is_login: state.CheckUserLogin.is_login,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { GetMyOrder, Chating })(MyOrder);
