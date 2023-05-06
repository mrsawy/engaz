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

class AddServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      selected_address: null,
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

  GetData() {
    if (this.props.loading) {
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
            <TouchableOpacity
              onPress={() => this.SelectAddress(item.id)}
              style={{
                flex: 1,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              <View
                style={{
                  marginLeft: 10,
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
                {this.state.selected_address == item.id ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: -5,
                      right: 0,
                      zIndex: 99999,
                    }}
                  >
                    <Icon
                      name="check-circle"
                      type="fontawsome"
                      size={17}
                      color={"#454545"}
                      style={{}}
                    />
                  </View>
                ) : null}
                <Icon
                  name="home"
                  type="fontawsome"
                  size={27}
                  color={
                    this.state.selected_address == item.id
                      ? "#D3A257"
                      : "#454545"
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginRight: 5,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color:
                      this.state.selected_address == item.id
                        ? "#D3A257"
                        : "#454545",
                    fontFamily: "BOLD",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 3,
                  }}
                >
                  {item.type}{" "}
                  <Text
                    style={{
                      fontSize: 11,
                      marginRight: 10,
                      color: "#454545",
                      fontFamily: "Medium",
                    }}
                  >
                    {item.city_id.name} , {item.governorate_id.name}
                  </Text>
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
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
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
                {"اضافة طلب جديد"}
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
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#454545",
                    borderWidth: 1,
                  }}
                >
                  <FontAwesome name="map-marker" size={25} color="#2a2a2a" />
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
              {/* <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:55,height:55,borderRadius:10,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                <Ionicons name="ios-time" size={25} color="#606060" />
                            </View>
                            <Text style={{fontSize:12,color:'#8a8a8a',fontFamily:'Medium',textAlign:'center',marginTop:7}}>{i18n.t('spicified_appoitment')}</Text>

                        </View> */}
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

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AddAddressOrder")}
              style={{
                flex: 1,
                flexDirection:
                  this.props.Language == "ar" ? "row-reverse" : "row",
              }}
            >
              <View
                style={{
                  marginLeft: 10,
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
                <Icon name="plus" type="feather" size={25} color={"#454545"} />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#454545",
                    fontFamily: "BOLD",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                    marginTop: 3,
                  }}
                >
                  {i18n.t("add_address")}
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
                  {i18n.t("add_address_new")}
                </Text>
              </View>
            </TouchableOpacity>

            <Divider
              style={{
                backgroundColor: "#eee",
                height: 1,
                marginTop: 15,
                marginBottom: 15,
              }}
            />

            {this.GetData()}

            {this.state.selected_address ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("AddServicesComplete", {
                    subcategories_id: this.props.route.params.sub_cat,
                    address_id: this.state.selected_address,
                    title: this.props.route.params.title,
                    des: this.props.route.params.des,
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
    data: state.GetAddress.data,
    loading: state.GetAddress.loading,
    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {})(AddServices);
