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
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Divider } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { EditProfileAuth, CheckUserLogin, GetGovernorate } from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import PhoneInput from "react-native-phone-input";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { showMessage, hideMessage } from "react-native-flash-message";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      image: null,
      cover: null,
      name: null,
      cover: null,
      mobile: null,
      email: null,
      city: null,
      governorate: null,
      type: null,
      cover_upload: false,
      image_upload: false,
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var type = await AsyncStorage.getItem("type");
    var name = await AsyncStorage.getItem("name");
    var photo = await AsyncStorage.getItem("photo");
    var cover = await AsyncStorage.getItem("cover");
    var mobile = await AsyncStorage.getItem("mobile");
    var email = await AsyncStorage.getItem("email");
    var city = await AsyncStorage.getItem("city");
    var governorate = await AsyncStorage.getItem("governorate");

    this.setState({
      type: type,
      name: name,
      image: photo,
      cover: cover,
      mobile: mobile,
      email: email,
      city: city,
      governorate: governorate,
    });
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  _pickImage = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, image_upload: true });
    }
  };

  _pickcover = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ cover: result.uri, cover_upload: true });
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

  renderImage() {
    if (this.state.image) {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={{ width: "100%" }}
        >
          <Image
            source={{ uri: this.state.image }}
            style={{
              height: 90,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickImage()}
          style={{
            height: 90,
            width: "100%",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: this.state.image_border,
            borderStyle: "dashed",
            justifyContent: "center",
          }}
        >
          <AntDesign
            name="user"
            size={24}
            color="#c4c4c4"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
    }
  }

  rendercover() {
    if (this.state.cover) {
      return (
        <TouchableOpacity
          onPress={() => this._pickcover()}
          style={{ width: "100%" }}
        >
          <Image
            source={{ uri: this.state.cover }}
            style={{
              height: 90,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#c4c4c4",
            }}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._pickcover()}
          style={{
            height: 90,
            width: "100%",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: this.state.image_border,
            borderStyle: "dashed",
            justifyContent: "center",
          }}
        >
          <AntDesign
            name="idcard"
            size={30}
            color="#c4c4c4"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
    }
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  async edit() {
    const id = await AsyncStorage.getItem("id_user");

    var type = await AsyncStorage.getItem("type");
    var name_p = await AsyncStorage.getItem("name");
    var photo_p = await AsyncStorage.getItem("photo");
    var cover_p = await AsyncStorage.getItem("cover");
    var mobile_p = await AsyncStorage.getItem("mobile");
    var email_p = await AsyncStorage.getItem("email");
    var city_p = await AsyncStorage.getItem("city");
    var governorate_p = await AsyncStorage.getItem("governorate");

    var name_user = name_p == this.state.name ? null : this.state.name;
    var email_user = email_p == this.state.email ? null : this.state.email;

    const {
      name,
      image,
      cover,
      mobile,
      email,
      city,
      governorate,
      image_upload,
      cover_upload,
    } = this.state;
    this.setState({ error_name: "", false_email: "" });
    if (name !== null || email !== null) {
      this.props.EditProfileAuth(
        id,
        name_user,
        image,
        cover,
        mobile,
        email_user,
        city,
        governorate,
        image_upload,
        cover_upload
      );
    } else {
      this.props.navigation.navigate("Profile");
    }
  }

  UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data_after_edit &&
      NextProps.data_after_edit !== null &&
      NextProps.data_after_edit !== this.props.data_after_edit
    ) {
      this.props.CheckUserLogin();
      showMessage({
        message: i18n.t("success"),
        description: i18n.t("success_des"),
        type: "success",
        backgroundColor: "green",
      });

      setTimeout(async () => {
        this.props.navigation.navigate("Profile");
      }, 2000);
    }

    if (
      NextProps.false_name &&
      NextProps.false_name !== null &&
      NextProps.false_name !== this.props.false_name
    ) {
      this.setState({ error_name: "الاسم الذي ادخلته موجود مسبقاً" });
    }

    if (
      NextProps.false_email &&
      NextProps.false_email !== null &&
      NextProps.false_email !== this.props.false_email
    ) {
      this.setState({ error_email: "البريد الذي ادخلته موجود مسبقاً" });
    }
  }

  renderLoginBtn() {
    if (this.props.loading_after_edit) {
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
          onPress={() => this.edit()}
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
            {i18n.t("edit_profile")}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  SelectCity(val, id) {
    this.setState({ city: val, governorate: null });
    this.props.GetGovernorate(id);
    this.RBSheet.close();
  }

  SelectGovernorate(val) {
    this.setState({ governorate: val });
    this.RBSheet2.close();
  }

  GetData() {
    if (this.props.MainCategories) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.MainCategories}
          contentContainerStyle={{
            flexDirection: this.props.Language == "ar" ? "row-reverse" : "row",
          }}
          renderItem={({ item }) => (
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                color: this.state.governorate ? "#2a2a2a" : "#b5b5b5",
                fontFamily: "Medium",
                textAlign: this.props.Language == "ar" ? "right" : "left",
                marginTop: 4,
                paddingRight: this.props.Language == "ar" ? 15 : 0,
                paddingLeft: this.props.Language == "en" ? 15 : 0,
              }}
            >
              {item},
            </Text>
          )}
          keyExtractor={({ id }, index) => id}
        />
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
                {i18n.t("profile")}
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
                {i18n.t("profile")}
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
          <View style={{ flex: 3, margin: 15 }}>
            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("name")}
              returnKeyType="done"
              autoCapitalize="none"
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              rightIcon={
                this.props.Language == "ar" ? (
                  <View
                    style={{
                      borderLeftColor: "#ccc",
                      borderLeftWidth: 1,
                      paddingLeft: 10,
                    }}
                  >
                    <FontAwesome name="user" size={21} color="#2a2a2a" />
                  </View>
                ) : null
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
                    <FontAwesome name="user" size={21} color="#2a2a2a" />
                  </View>
                ) : null
              }
              errorMessage={this.state.error_name}
              errorStyle={{
                color: "red",
                textAlign: "right",
                fontFamily: "Medium",
                marginTop: -5,
                marginRight: 20,
                marginLeft: 20,
              }}
            />

            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("email")}
              keyboardType="email-address"
              returnKeyType="done"
              autoCapitalize="none"
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
              rightIcon={
                this.props.Language == "ar" ? (
                  <View
                    style={{
                      borderLeftColor: "#ccc",
                      borderLeftWidth: 1,
                      paddingLeft: 10,
                    }}
                  >
                    <MaterialIcons name="email" size={21} color="#2a2a2a" />
                  </View>
                ) : null
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
                    <MaterialIcons name="email" size={21} color="#2a2a2a" />
                  </View>
                ) : null
              }
              errorMessage={this.state.error_email}
              errorStyle={{
                color: "red",
                textAlign: "right",
                fontFamily: "Medium",
                marginTop: -5,
                marginRight: 20,
                marginLeft: 20,
              }}
            />

            {this.state.type == "provider" ? (
              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
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
                <View
                  style={{
                    borderLeftColor: "#ccc",
                    borderRightColor: "#ccc",
                    borderLeftWidth: this.props.Language == "ar" ? 1 : 0,
                    borderRightWidth: this.props.Language == "en" ? 1 : 0,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-marker" size={21} color="#2a2a2a" />
                </View>
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
                    width: 40,
                    alignItems:
                      this.props.Language == "ar" ? "flex-start" : "flex-end",
                  }}
                >
                  <AntDesign name="down" size={15} color="#2a2a2a" />
                </View>
              </TouchableOpacity>
            ) : null}

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
                    {i18n.t("select_city")}
                  </Text>
                </View>

                {this.props.data_city ? (
                  <View>
                    {this.props.data_city.map((item) => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.SelectCity(item.name, item.id)}
                          key={item.id}
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
                ) : (
                  <ActivityIndicator size="small" color="#2a2a2a" />
                )}
              </View>
            </RBSheet>

            {this.state.type == "provider" ? (
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
                <View
                  style={{
                    borderLeftColor: "#ccc",
                    borderRightColor: "#ccc",
                    borderLeftWidth: this.props.Language == "ar" ? 1 : 0,
                    borderRightWidth: this.props.Language == "en" ? 1 : 0,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-marker" size={21} color="#2a2a2a" />
                </View>
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
                    width: 40,
                    alignItems:
                      this.props.Language == "ar" ? "flex-start" : "flex-end",
                  }}
                >
                  <AntDesign name="down" size={15} color="#2a2a2a" />
                </View>
              </TouchableOpacity>
            ) : null}

            <RBSheet
              ref={(ref) => {
                this.RBSheet2 = ref;
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
                    {i18n.t("select_city")}
                  </Text>
                </View>

                {this.props.data_governorate ? (
                  <View>
                    {this.props.data_governorate.map((item) => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.SelectGovernorate(item.name)}
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
                ) : (
                  <ActivityIndicator size="small" color="#2a2a2a" />
                )}
              </View>
            </RBSheet>

            {this.state.type == "provider" ? (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("EditCategories")}
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
                {this.GetData()}
                <View
                  style={{
                    width: 40,
                    alignItems:
                      this.props.Language == "ar" ? "flex-start" : "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome name="edit" size={16} color="#2a2a2a" />
                </View>
              </TouchableOpacity>
            ) : null}

            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                alignSelf:
                  this.props.Language == "ar" ? "flex-end" : "flex-start",
                marginBottom: 5,
                marginTop: 5,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems:
                    this.props.Language == "ar" ? "flex-end" : "flex-start",
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: "#8a8a8a",
                    fontFamily: "Medium",
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  {i18n.t("Photo")}
                </Text>
                {this.renderImage()}
              </View>

              {this.state.type == "provider" ? (
                <View
                  style={{
                    flex: 1,
                    alignItems:
                      this.props.Language == "ar" ? "flex-end" : "flex-start",
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#8a8a8a",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    {i18n.t("cover")}
                  </Text>
                  {this.rendercover()}
                </View>
              ) : null}
            </View>

            <View style={{ marginTop: 5, marginBottom: 40 }}>
              {this.renderLoginBtn()}
            </View>
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
    Language: state.ChecLanguage.Language,

    false_name: state.EditProfileAuth.false_name,
    false_email: state.EditProfileAuth.false_email,

    data_after_edit: state.EditProfileAuth.data,
    loading_after_edit: state.EditProfileAuth.loading,

    MainCategories: state.GetStatistic.MainCategories,
    data_count_notification: state.CountNotification.data,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  EditProfileAuth,
  CheckUserLogin,
  GetGovernorate,
})(EditProfile);
