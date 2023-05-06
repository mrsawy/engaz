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
import { LastOrderProvider } from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

import StarRating from "react-native-star-rating";
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
    this.props.LastOrderProvider(id_user);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    var id_user = await AsyncStorage.getItem("id_user");
    this.props.LastOrderProvider(id_user);
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
  }

  async SelectedStuts(val) {
    this.RBSheet.close();
    if (val == "all") {
      var id_user = await AsyncStorage.getItem("id_user");
      this.props.LastOrderProvider(id_user);
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

    if (this.props.data) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data}
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
                {/* <TouchableOpacity style={{width:30,height:30,}} >
                                <MaterialIcons name="more-vert" size={22} color="#2a2a2a" />
                            </TouchableOpacity> */}
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

                <View />
              </View>

              {item.user_id ? (
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
                          item.user_id.photo
                            ? {
                                uri: API_URI + "/storage/" + item.user_id.photo,
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
                        {item.user_id.name}
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
                          rating={item.user_id.rating}
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
                          {item.user_id.rating}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexDirection:
                          this.props.Language == "ar" ? "row" : "row-reverse",
                        marginRight: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("AddOffers", {
                            item: item,
                          })
                        }
                        style={[
                          styles.btn,
                          {
                            height: 35,
                            backgroundColor: "#457045",
                            justifyContent: "center",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#fff",
                            fontFamily: "Medium",
                            textAlign: "center",
                            marginTop: 3,
                          }}
                        >
                          {i18n.t("add_offers")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null}

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
                <View style={{ flex: 2, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#2a2a2a",
                      fontFamily: "BOLD",
                      textAlign: this.props.Language == "ar" ? "right" : "left",
                      marginTop: 1,
                    }}
                  >
                    {i18n.t("offers_order")}: ({item.offers_count})
                  </Text>
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#2a2a2a",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 1,
                    }}
                  >
                    {i18n.t("Average_offers")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#2a2a2a",
                      fontFamily: "BOLD",
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    {item.avarage_price} {i18n.t("riyal")}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("MyOrderDetailsProvider", {
                      item: item,
                    })
                  }
                  style={[
                    styles.btn,
                    {
                      marginRight: 70,
                      marginLeft: 70,
                      backgroundColor: "#2a2a2a",
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
                    {i18n.t("order_details")}
                  </Text>
                </TouchableOpacity>
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
                {i18n.t("last_orders")}
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
                {i18n.t("last_orders")}
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
            {/* <TouchableOpacity onPress={()=> this.RBSheet.open()} style={{borderRadius:5,justifyContent:'center',alignItems:'center',alignSelf:this.props.Language=='ar'? 'flex-start':'flex-end',padding:8,backgroundColor:'#fff',borderColor:'#ccc',borderWidth:1,flexDirection:this.props.Language=='ar'?'row-reverse':'row',width:120}}>
                        <MaterialCommunityIcons name="filter" size={18} color="#2a2a2a" />
                        <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:13,color:'#2a2a2a',marginTop:2}}>{i18n.t('View_status')}</Text>
                    </TouchableOpacity> */}

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

    data: state.LastOrderProvider.data,
    loading: state.LastOrderProvider.loading,

    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { LastOrderProvider })(MyOrder);
