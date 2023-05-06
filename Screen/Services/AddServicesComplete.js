import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
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
import { GetMyOrder } from "../../Actions";
import { OrderStore } from "../../Actions/OrderFunction";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { showMessage, hideMessage } from "react-native-flash-message";

class AddServicesComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      selected_address: null,
      image1: null,
      image2: null,
      image3: null,
      description: "",
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      // showMessage({
      //   message: i18n.t('success'),
      //   description: i18n.t('success_des'),
      //   type: "success",
      //   backgroundColor: "green",
      // });

      var id_user = await AsyncStorage.getItem("id_user");
      this.props.GetMyOrder(id_user);

      // setTimeout(async ()  =>  {
      this.props.navigation.navigate("SuccessOrder", {
        id: NextProps.data.id,
        item: NextProps.data,
      });
      // }, 1500);
    }
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  _pickImage1 = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image1: result.uri });
    }
  };

  _pickImage2 = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image2: result.uri });
    }
  };

  _pickImage3 = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image3: result.uri });
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  renderImage1() {
    if (this.state.image1) {
      return (
        <View style={{ width: 80 }}>
          <Image
            source={{ uri: this.state.image1 }}
            style={{
              height: 80,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage1()}
          style={{
            height: 80,
            width: 80,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#ccc",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="plus"
            size={24}
            color="#454545"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
    }
  }

  renderImage2() {
    if (this.state.image2) {
      return (
        <View style={{ width: 80 }}>
          <Image
            source={{ uri: this.state.image2 }}
            style={{
              height: 80,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage2()}
          style={{
            height: 80,
            width: 80,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#ccc",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="plus"
            size={24}
            color="#454545"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
    }
  }

  renderImage3() {
    if (this.state.image3) {
      return (
        <View style={{ width: 80 }}>
          <Image
            source={{ uri: this.state.image3 }}
            style={{
              height: 80,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage3()}
          style={{
            height: 80,
            width: 80,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#ccc",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="plus"
            size={24}
            color="#454545"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
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
            {i18n.t("send")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  async Confirm() {
    var id_user = await AsyncStorage.getItem("id_user");
    const { description, image1, image2, image3 } = this.state;
    const maincategories_id = this.props.route.params.maincategories_id;
    const subcategories_id = this.props.route.params.subcategories_id;
    const address_id = this.props.route.params.address_id;
    const date = this.props.route.params.date;
    const time = this.props.route.params.time;

    this.props.OrderStore(
      id_user,
      maincategories_id,
      subcategories_id,
      address_id,
      "طلب جديد",
      description,
      null,
      null,
      image1,
      image2,
      image3
    );
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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
        >
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
                  style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    marginTop: 10,
                  }}
                >
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#454545",
                        fontFamily: "BOLD",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                      }}
                    >
                      {this.props.route.params.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#a2a2a2",
                        fontFamily: "Medium",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
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
                  width: "90%",
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
                {/* <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:55,height:55,borderRadius:10,backgroundColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}>
                                <Ionicons name="ios-time" size={25} color="#fff" />
                            </View>
                            <Text style={{fontSize:12,color:'#454545',fontFamily:'Medium',textAlign:'center',marginTop:7}}>{i18n.t('spicified_appoitment')}</Text>

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
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "#454545",
                      borderWidth: 1,
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
                {i18n.t("description_service")}
              </Text>

              <TextInput
                style={[
                  styles.textArea,
                  {
                    textAlignVertical: "top",
                    textAlign: this.props.Language == "ar" ? "right" : "left",
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholder={i18n.t("description_service")}
                returnKeyType="done"
                multiline={true}
                numberOfLines={5}
                placeholderTextColor={"#8e8e8e"}
                onChangeText={(description) => this.setState({ description })}
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
                {i18n.t("image_service")}{" "}
                <Text style={{ fontSize: 11, fontFamily: "Medium" }}>
                  ( {i18n.t("optinal")} )
                </Text>
              </Text>

              <View
                style={{
                  alignSelf:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
                  marginBottom: 5,
                  marginTop: 5,
                  flexDirection:
                    this.props.Language == "ar" ? "row" : "row-reverse",
                }}
              >
                <View
                  style={{
                    width: 90,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  {this.renderImage1()}
                </View>

                <View
                  style={{
                    width: 90,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  {this.renderImage2()}
                </View>

                <View
                  style={{
                    width: 90,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                  }}
                >
                  {this.renderImage3()}
                </View>
              </View>

              {this.state.description ? (
                this.renderBtn()
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
                    {i18n.t("send")}
                  </Text>
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
    marginLeft: 20,
    marginRight: 20,
    padding: 8,
    paddingRight: 20,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "#eee",
  },
  textArea: {
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 8,
    paddingRight: 20,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderBottomWidth: 1,
    height: 120,
    marginTop: 5,
    textAlign: "right",
    fontFamily: "Medium",
    paddingTop: 10,
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
    Language: state.ChecLanguage.Language,
    data_count_notification: state.CountNotification.data,

    loading: state.OrderStore.loading,
    data: state.OrderStore.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { OrderStore, GetMyOrder })(
  AddServicesComplete
);
