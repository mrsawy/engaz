import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  StatusBar,
  RefreshControl,
  Platform,
  Keyboard,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import {
  GetOrderChat,
  StoreChat,
  CompleteOrder,
  GetMyOrder,
} from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
  FontAwesome,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import StarRating from "react-native-star-rating";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import ZoomImage from "react-native-zoom-image";
import { Easing } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class MyOrderDetailsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      page: "Details",
      data: [],
      text_messages: "",
      keyboardHeight: 0,
      inputHeight: 30,
      id_msg: null,
      image: null,
      file: null,
    };
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    this.setState({ file: result.uri });
  };

  openLink(url) {
    Linking.openURL(url);
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });

    var id_user = await AsyncStorage.getItem("id_user");
    this.setState({ id_user: id_user });

    this.props.GetOrderChat(this.props.route.params.item.id);
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  selectPage(val) {
    this.setState({ page: val });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });

    this.setState({ refreshing: false });
  };

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.setState({ data: [...this.state.data, ...NextProps.data] });
    }

    if (
      NextProps.msg &&
      NextProps.msg !== null &&
      NextProps.msg !== this.props.msg
    ) {
      this.setState({ id_msg: NextProps.msg.id });
    }

    if (
      NextProps.data_complete &&
      NextProps.data_complete !== null &&
      NextProps.data_complete !== this.props.data_complete
    ) {
      showMessage({
        message: i18n.t("success"),
        description: i18n.t("success_des"),
        type: "success",
        backgroundColor: "green",
      });

      var id_user = await AsyncStorage.getItem("id_user");
      this.props.GetMyOrder(id_user);
      setTimeout(async () => {
        this.props.navigation.navigate("MyOrder");
      }, 1500);
    }
  }

  Renderadmin(msg, image, file, created_date) {
    if (image) {
      return (
        <View
          style={[
            styles.item,
            { backgroundColor: "#D3A257", alignSelf: "flex-end" },
          ]}
        >
          <View style={[styles.balloon, { padding: 0 }]}>
            <ZoomImage
              source={{ uri: image }}
              imgStyle={{ width: 250, height: 250, borderRadius: 10 }}
              PlaceholderContent={<ActivityIndicator />}
              duration={200}
              enableScaling={false}
              easingFunc={Easing.ease}
            />
          </View>
        </View>
      );
    } else if (file) {
      return (
        <View
          style={[
            styles.item,
            { backgroundColor: "#D3A257", alignSelf: "flex-end" },
          ]}
        >
          <TouchableOpacity
            onPress={() => this.openLink(file)}
            style={[styles.balloon, { padding: 15 }]}
          >
            {/* <Text style={{textAlign:'center',fontFamily: 'Medium',color:'#fff'}}>{file}</Text> */}
            <AntDesign name="filetext1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={[
              styles.item,
              { backgroundColor: "#D3A257", alignSelf: "flex-end" },
            ]}
          >
            <View style={[styles.balloon]}>
              <Text
                style={{ color: "#fff", fontFamily: "Medium", fontSize: 16 }}
              >
                {msg}
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: "right",
              fontFamily: "Medium",
              fontSize: 14,
              color: "#24344D",
              marginLeft: 15,
              marginRight: 15,
              marginTop: -15,
            }}
          >
            {created_date}
          </Text>
        </View>
      );
    }
  }

  RenderUser(msg, image, file, created_date) {
    if (image) {
      return (
        <View style={[styles.item, { alignSelf: "flex-start" }]}>
          <View style={[styles.balloon, { padding: 0 }]}>
            <ZoomImage
              source={{ uri: image }}
              imgStyle={{ width: 250, height: 250, borderRadius: 10 }}
              PlaceholderContent={<ActivityIndicator />}
              duration={200}
              enableScaling={false}
              easingFunc={Easing.ease}
            />
          </View>
        </View>
      );
    } else if (file) {
      return (
        <View
          style={[
            styles.item,
            { backgroundColor: "#D3A257", alignSelf: "flex-end" },
          ]}
        >
          <TouchableOpacity
            onPress={() => this.openLink(file)}
            style={[styles.balloon, { padding: 15 }]}
          >
            {/* <Text style={{textAlign:'center',fontFamily: 'Medium',color:'#fff'}}>{file}</Text> */}
            <AntDesign name="filetext1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={[
              styles.item,
              {
                alignSelf: "flex-start",
                backgroundColor: "#F4F5F7",
                borderColor: "#ccc",
                borderWidth: 1,
              },
            ]}
          >
            <View style={[styles.balloon]}>
              <Text
                style={{ color: "#24344D", fontFamily: "Medium", fontSize: 16 }}
              >
                {msg}
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: "left",
              fontFamily: "Medium",
              fontSize: 14,
              color: "#24344D",
              marginLeft: 15,
              marginRight: 15,
              marginTop: -15,
            }}
          >
            {created_date}
          </Text>
        </View>
      );
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
        <View style={{ marginTop: 15, marginBottom: 15 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 15 }}>
                {this.state.id_user == item.sender_id
                  ? this.Renderadmin(
                      item.text_message,
                      item.image,
                      item.file,
                      null
                    )
                  : this.RenderUser(
                      item.text_message,
                      item.image,
                      item.file,
                      null
                    )}
              </View>
            )}
            keyExtractor={({ id }, index) => id}
          />
        </View>
      );
    }
  }

  componentDidMount() {
    this.LoadFontAsync();
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (e) => {
    this.setState({ keyboardHeight: e.endCoordinates.height });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  };

  async sendData() {
    var id_user = await AsyncStorage.getItem("id_user");
    var item = this.props.route.params.item;

    var we = {
      created_date: new Date().getHours() + ":" + new Date().getMinutes(),
      sender_id: id_user,
      recived_id:
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,
      message_id: this.state.id_msg,
      text_message: this.state.text_messages,
    };

    if (this.state.data.length == 0) {
      this.props.StoreChat(
        id_user,
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,
        this.state.id_msg,
        this.state.text_messages,
        null,
        null
      );
      this.setState({ text_messages: "", first_return_msg: true });
      this.props.GetOrderChat(this.props.route.params.item.id);
    } else {
      this.setState({
        data: [...this.state.data, we],
        total_num: this.state.total_num + 1,
      });
      this.props.StoreChat(
        id_user,
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,
        this.state.id_msg,
        this.state.text_messages,
        null,
        null
      );
      this.setState({ text_messages: "", first_return_msg: true });
    }
  }

  async SendImage() {
    var id_user = await AsyncStorage.getItem("id_user");
    var item = this.props.route.params.item;

    var we = {
      created_date: new Date().getHours() + ":" + new Date().getMinutes(),
      sender_id: id_user,
      recived_id:
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,
      message_id: this.state.id_msg,
      text_message: null,
    };

    if (this.state.data.length == 0) {
      // this.props.StoreChat(id_user,id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,this.state.id_msg,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });
      // this.props.GetOrderChat(this.props.route.params.item.id);

      const formData = new FormData();

      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id
      );
      formData.append("message_id", this.state.id_msg);
      formData.append("text_message", null);

      if (this.state.image) {
        const uriPart = this.state.image.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("image", {
          uri: this.state.image,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }

      fetch(API_URI + "/api/store_chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "true") {
            this.setState({
              image: null,
              text_message: "",
              first_return_msg: true,
            });
            this.props.GetOrderChat(this.props.route.params.item.id);
          } else {
            dispatch({ type: "StoreChatFaild" });
          }
        })
        .catch((error) => {
          dispatch({
            type: "StoreChatFaildServer",
            errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
          });
        });
    } else {
      // this.setState({ data:[...this.state.data , we ] , total_num :this.state.total_num + 1 });
      // this.props.StoreChat(id_user,id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,this.state.id_msg,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });

      const formData = new FormData();

      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id
      );
      formData.append("message_id", this.state.id_msg);
      formData.append("text_message", null);

      if (this.state.image) {
        const uriPart = this.state.image.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("image", {
          uri: this.state.image,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }

      fetch(API_URI + "/api/store_chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "true") {
            this.setState({
              data: [...this.state.data, responseJson.data],
              total_num: this.state.total_num + 1,
            });
            this.setState({
              image: null,
              text_message: "",
              first_return_msg: true,
            });
          } else {
            dispatch({ type: "StoreChatFaild" });
          }
        })
        .catch((error) => {
          dispatch({
            type: "StoreChatFaildServer",
            errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
          });
        });
    }
  }

  async SendFile() {
    var id_user = await AsyncStorage.getItem("id_user");
    var item = this.props.route.params.item;

    var we = {
      created_date: new Date().getHours() + ":" + new Date().getMinutes(),
      sender_id: id_user,
      recived_id:
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,
      message_id: this.state.id_msg,
      text_message: null,
    };

    if (this.state.data.length == 0) {
      // this.props.StoreChat(id_user,id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,this.state.id_msg,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });
      // this.props.GetOrderChat(this.props.route.params.item.id);

      const formData = new FormData();

      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id
      );
      formData.append("message_id", this.state.id_msg);
      formData.append("text_message", null);

      if (this.state.file) {
        const uriPart = this.state.image.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("file", {
          uri: this.state.file,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }

      fetch(API_URI + "/api/store_chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "true") {
            this.setState({
              file: null,
              text_message: "",
              first_return_msg: true,
            });
            this.props.GetOrderChat(this.props.route.params.item.id);
          } else {
            dispatch({ type: "StoreChatFaild" });
          }
        })
        .catch((error) => {
          dispatch({
            type: "StoreChatFaildServer",
            errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
          });
        });
    } else {
      // this.setState({ data:[...this.state.data , we ] , total_num :this.state.total_num + 1 });
      // this.props.StoreChat(id_user,id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id,this.state.id_msg,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });

      const formData = new FormData();

      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.user_id.id ? item.user_id_offers.id : item.user_id.id
      );
      formData.append("message_id", this.state.id_msg);
      formData.append("text_message", null);

      if (this.state.file) {
        const uriPart = this.state.file.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("file", {
          uri: this.state.file,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }

      fetch(API_URI + "/api/store_chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "true") {
            this.setState({
              data: [...this.state.data, responseJson.data],
              total_num: this.state.total_num + 1,
            });
            this.setState({
              file: null,
              text_message: "",
              first_return_msg: true,
            });
          } else {
            dispatch({ type: "StoreChatFaild" });
          }
        })
        .catch((error) => {
          dispatch({
            type: "StoreChatFaildServer",
            errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
          });
        });
    }
  }

  renderInput() {
    if (this.state.image) {
      return (
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            height: 45,
            alignItems: this.props.Language == "ar" ? "flex-end" : "flex-start",
            borderColor: "#eee",
            borderWidth: 1,
            backgroundColor: "#F4F5F7",
            borderRadius: 20,
          }}
        >
          <Image
            source={{ uri: this.state.image }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              marginLeft: 20,
              marginTop: 2.5,
            }}
          />
        </View>
      );
    }
    if (this.state.file) {
      return (
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            height: 45,
            alignItems: this.props.Language == "ar" ? "flex-end" : "flex-start",
            borderColor: "#eee",
            borderWidth: 1,
            backgroundColor: "#F4F5F7",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#eee",
              justifyContent: "center",
              alignItems: "center",
              height: 35,
              width: 35,
              marginTop: 3,
              marginLeft: 15,
            }}
          >
            <FontAwesome name="file" size={20} color="#606060" style={{}} />
          </View>
        </View>
      );
    } else {
      return (
        <Input
          placeholder={i18n.t("write_msg")}
          onChangeText={(text) => this.setState({ text_messages: text })}
          value={this.state.text_messages}
          underlineColorAndroid="transparent"
          returnKeyType="done"
          inputContainerStyle={{
            borderBottomWidth: 0,
            backgroundColor: "#F4F5F7",
            borderRadius: 20,
            padding: 7,
            height: 45,
          }}
          inputStyle={{
            textAlign: this.props.Language == "ar" ? "right" : "left",
            fontFamily: "Medium",
            marginTop: 2,
            fontSize: 14,
            paddingRight: 10,
            paddingLeft: 10,
          }}
          containerStyle={{ backgroundColor: "#fff" }}
        />
      );
    }
  }

  RenderBtn() {
    if (this.state.image) {
      return (
        <TouchableOpacity
          onPress={() => this.SendImage()}
          style={{
            justifyContent: "center",
            borderRadius: 25,
            width: 45,
            height: 45,
            alignItems: "center",
            backgroundColor: "#2a2a2a",
          }}
        >
          <Feather
            name={this.props.Language == "ar" ? "arrow-left" : "arrow-right"}
            size={23}
            color="#fff"
          />
        </TouchableOpacity>
      );
    } else if (this.state.file) {
      return (
        <TouchableOpacity
          onPress={() => this.SendFile()}
          style={{
            justifyContent: "center",
            borderRadius: 25,
            width: 45,
            height: 45,
            alignItems: "center",
            backgroundColor: "#2a2a2a",
          }}
        >
          <Feather
            name={this.props.Language == "ar" ? "arrow-left" : "arrow-right"}
            size={23}
            color="#fff"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          disabled={this.state.text_messages.length == 0 ? true : false}
          onPress={() => this.sendData()}
          style={{
            justifyContent: "center",
            borderRadius: 25,
            width: 45,
            height: 45,
            alignItems: "center",
            backgroundColor:
              this.state.text_messages.length == 0 ? "#606060" : "#2a2a2a",
          }}
        >
          <Feather
            name={this.props.Language == "ar" ? "arrow-left" : "arrow-right"}
            size={23}
            color="#fff"
          />
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
                {i18n.t("last_orders")}
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
                  {i18n.t("order_date")} :{" "}
                  {this.props.route.params.item.created_date}
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
                  {i18n.t("order_num")} : {this.props.route.params.item.id}
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
                  <Image
                    source={
                      this.props.route.params.item.image1
                        ? {
                            uri: this.props.route.params.item.image1,
                          }
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
                      ? this.props.route.params.item.subcategories_id_id
                          .name_subcategories_ar
                      : this.props.route.params.item.subcategories_id_id
                          .name_subcategories_en}
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
                      ? this.props.route.params.item.maincategories_id_id
                          .name_ar
                      : this.props.route.params.item.maincategories_id_id
                          .name_en}
                  </Text>
                </View>

                <View />
              </View>

              {this.props.route.params.item.user_id ? (
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
                          this.props.route.params.item.user_id.photo
                            ? {
                                uri:
                                  API_URI +
                                  "/storage/" +
                                  this.props.route.params.item.user_id.photo,
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
                        {this.props.route.params.item.user_id.name}
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
                          rating={this.props.route.params.item.user_id.rating}
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
                          {this.props.route.params.item.user_id.rating}
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
                            item: this.props.route.params.item,
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
                    {i18n.t("offers_order")}: (
                    {this.props.route.params.item.offers_count})
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
                    {this.props.route.params.item.avarage_price}{" "}
                    {i18n.t("riyal")}
                  </Text>
                </View>
              </View>
            </View>

            {this.props.Language == "ar" ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#eee",
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  borderRadius: 10,
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.selectPage("Details")}
                  style={{
                    flex: 1,
                    backgroundColor:
                      this.state.page == "Details" ? "#454545" : "#eee",
                    padding: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.page == "Details" ? "#fff" : "#454545",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 3,
                    }}
                  >
                    {i18n.t("order_details")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.selectPage("Chat")}
                  style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor:
                      this.state.page == "Chat" ? "#454545" : "#eee",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.page == "Chat" ? "#fff" : "#454545",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 3,
                    }}
                  >
                    {i18n.t("chat")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {this.props.Language == "en" ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#eee",
                  flexDirection:
                    this.props.Language == "ar" ? "row-reverse" : "row",
                  borderRadius: 10,
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.selectPage("Details")}
                  style={{
                    flex: 1,
                    backgroundColor:
                      this.state.page == "Details" ? "#454545" : "#eee",
                    padding: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.page == "Details" ? "#fff" : "#454545",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 3,
                    }}
                  >
                    {i18n.t("order_details")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.selectPage("Chat")}
                  style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor:
                      this.state.page == "Chat" ? "#454545" : "#eee",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.page == "Chat" ? "#fff" : "#454545",
                      fontFamily: "Medium",
                      textAlign: "center",
                      marginTop: 3,
                    }}
                  >
                    {i18n.t("chat")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {this.state.page == "Details" ? (
              <ScrollView>
                <View style={{ flex: 1, marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection:
                        this.props.Language == "ar" ? "row-reverse" : "row",
                    }}
                  >
                    <FontAwesome name="map-marker" size={21} color="#2a2a2a" />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: "#2a2a2a",
                        fontFamily: "Medium",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        marginTop: 4,
                        marginRight: 5,
                        marginLeft: 5,
                      }}
                    >
                      {i18n.t("address")}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection:
                        this.props.Language == "ar" ? "row-reverse" : "row",
                      marginBottom: 10,
                      marginTop: 10,
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
                      <Icon
                        name="home"
                        type="fontawsome"
                        size={27}
                        color={"#D3A257"}
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
                          color: "#D3A257",
                          fontFamily: "BOLD",
                          textAlign:
                            this.props.Language == "ar" ? "right" : "left",
                          marginTop: 3,
                        }}
                      >
                        {this.props.route.params.item.address_id_id.type}{" "}
                        <Text
                          style={{
                            fontSize: 11,
                            marginRight: 10,
                            color: "#454545",
                            fontFamily: "Medium",
                          }}
                        >
                          {this.props.route.params.item.city_id_id.name} ,{" "}
                          {this.props.route.params.item.governorate_id_id.name}
                        </Text>
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
                        {this.props.route.params.item.address_id_id.description}
                      </Text>
                    </View>
                    {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate('ShowMap',{long:this.props.route.params.item.address_id_id.longitude,lang:this.props.route.params.item.address_id_id.latitude})} style={{marginLeft:10,width:70,alignItems:'center',justifyContent:'center',height:55,width:70,flexDirection:this.props.Language == 'ar' ? 'row-reverse':'row'}}>
                                    <FontAwesome name="map-marker" size={17} color="#2a2a2a" />
                                    <Text style={{fontSize:11,color:'#2a2a2a',fontFamily:'Medium',textAlign:'center',marginTop:3,marginLeft:5,marginRight:5}}>{i18n.t('show_location')}</Text>
                                  </TouchableOpacity> */}
                    {Platform.OS === "ios" ? (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "maps://app?saddr=" +
                              this.props.route.params.item.address_id_id
                                .latitude +
                              "&daddr=" +
                              this.props.route.params.item.address_id_id
                                .longitude +
                              ""
                          )
                        }
                        style={{
                          marginLeft: 10,
                          width: 70,
                          alignItems: "center",
                          justifyContent: "center",
                          height: 55,
                          width: 70,
                          flexDirection:
                            this.props.Language == "ar" ? "row-reverse" : "row",
                        }}
                      >
                        <FontAwesome
                          name="map-marker"
                          size={17}
                          color="#2a2a2a"
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#2a2a2a",
                            fontFamily: "Medium",
                            textAlign: "center",
                            marginTop: 3,
                            marginLeft: 5,
                            marginRight: 5,
                          }}
                        >
                          {i18n.t("show_location")}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "google.navigation:q=" +
                              this.props.route.params.item.address_id_id
                                .latitude +
                              "+" +
                              this.props.route.params.item.address_id_id
                                .longitude +
                              ""
                          )
                        }
                        style={{
                          marginLeft: 10,
                          width: 70,
                          alignItems: "center",
                          justifyContent: "center",
                          height: 55,
                          width: 70,
                          flexDirection:
                            this.props.Language == "ar" ? "row-reverse" : "row",
                        }}
                      >
                        <FontAwesome
                          name="map-marker"
                          size={17}
                          color="#2a2a2a"
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#2a2a2a",
                            fontFamily: "Medium",
                            textAlign: "center",
                            marginTop: 3,
                            marginLeft: 5,
                            marginRight: 5,
                          }}
                        >
                          {i18n.t("show_location")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* <View style={{flexDirection:this.props.Language == 'ar' ?'row-reverse':'row',marginTop:10}}>
                                    <Ionicons name="ios-time" size={23} color="#2a2a2a" />
                                    <Text style={{flex:1,fontSize:14,color:'#2a2a2a',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:6,marginRight:5,marginLeft:5}}>{i18n.t('appoitment')}</Text>
                                </View>

                                <View style={{marginTop:5,alignItems:this.props.Language == 'ar' ?'flex-end':'flex-start',flexDirection:this.props.Language == 'ar' ?'row-reverse':'row',borderBottomWidth:1,borderBottomColor:'#e7e7e7',paddingBottom:15}}>
                                    <View>
                                        <Text style={{fontSize:13,color:'#2a2a2a',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3,marginBottom:5}}>{i18n.t('date')}</Text>
                                        <TouchableOpacity style={{width:120,height:50,backgroundColor:'#D3A257',borderRadius:10,marginLeft:this.props.Language == 'ar' ?10:0,marginRight:this.props.Language == 'en' ?10:0,justifyContent:'center',alignItems:'center',}}>
                                            <Text style={{fontSize:14,color:'#fff',fontFamily:'BOLD',textAlign:'right',marginTop:3}}>{this.props.route.params.item.date}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <Text style={{fontSize:13,color:'#2a2a2a',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ? 'right':'left',marginTop:3,marginBottom:5}}>{i18n.t('time')}</Text>
                                        <TouchableOpacity style={{width:90,height:50,backgroundColor:'#D3A257',borderRadius:10,marginLeft:this.props.Language == 'ar' ?10:0,marginRight:this.props.Language == 'en' ?10:0,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{fontSize:14,color:'#fff',fontFamily:'BOLD',textAlign:'right',marginTop:3}}>{this.props.route.params.item.time}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View> */}

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#e7e7e7",
                      paddingBottom: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection:
                          this.props.Language == "ar" ? "row-reverse" : "row",
                        marginTop: 10,
                      }}
                    >
                      <Ionicons name="md-list" size={21} color="#2a2a2a" />
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: "#2a2a2a",
                          fontFamily: "Medium",
                          textAlign:
                            this.props.Language == "ar" ? "right" : "left",
                          marginTop: 6,
                          marginRight: 5,
                          marginLeft: 5,
                        }}
                      >
                        {i18n.t("description")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: "#606060",
                        fontFamily: "Medium",
                        textAlign:
                          this.props.Language == "ar" ? "right" : "left",
                        marginTop: 4,
                        marginRight: 5,
                        lineHeight: 20,
                      }}
                    >
                      {this.props.route.params.item.description}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#e7e7e7",
                      paddingBottom: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection:
                          this.props.Language == "ar" ? "row-reverse" : "row",
                        marginTop: 10,
                      }}
                    >
                      <Ionicons name="md-list" size={21} color="#2a2a2a" />
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: "#2a2a2a",
                          fontFamily: "Medium",
                          textAlign:
                            this.props.Language == "ar" ? "right" : "left",
                          marginTop: 4,
                          marginRight: 5,
                          marginLeft: 5,
                        }}
                      >
                        {i18n.t("images")}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection:
                          this.props.Language == "ar" ? "row-reverse" : "row",
                        marginTop: 5,
                      }}
                    >
                      {this.props.route.params.item.image1 ? (
                        <View
                          style={{
                            width: 70,
                            alignItems:
                              this.props.Language == "ar"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Image
                            source={{
                              uri: this.props.route.params.item.image1,
                            }}
                            style={{
                              overflow: "hidden",
                              width: 55,
                              height: 55,
                              borderRadius: 10,
                              borderColor: "#ccc",
                              borderWidth: 1,
                            }}
                          />
                        </View>
                      ) : null}
                      {this.props.route.params.item.image2 ? (
                        <View
                          style={{
                            width: 70,
                            alignItems:
                              this.props.Language == "ar"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Image
                            source={{
                              uri: this.props.route.params.item.image2,
                            }}
                            style={{
                              overflow: "hidden",
                              width: 55,
                              height: 55,
                              borderRadius: 10,
                              borderColor: "#ccc",
                              borderWidth: 1,
                            }}
                          />
                        </View>
                      ) : null}
                      {this.props.route.params.item.image3 ? (
                        <View
                          style={{
                            width: 70,
                            alignItems:
                              this.props.Language == "ar"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Image
                            source={{
                              uri: this.props.route.params.item.image3,
                            }}
                            style={{
                              overflow: "hidden",
                              width: 55,
                              height: 55,
                              borderRadius: 10,
                              borderColor: "#ccc",
                              borderWidth: 1,
                            }}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {this.props.route.params.item.order_status ==
                  "in_progress" ? (
                    <View>
                      {!this.props.loading_complete ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.CompleteOrder(
                              this.props.route.params.item.id
                            )
                          }
                          style={[
                            styles.btn,
                            {
                              height: 55,
                              backgroundColor: "#2a2a2a",
                              justifyContent: "center",
                              marginBottom: 40,
                              marginTop: 30,
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
                            {i18n.t("complete_order")}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={[
                            styles.btn,
                            {
                              height: 55,
                              backgroundColor: "#2a2a2a",
                              justifyContent: "center",
                              marginBottom: 40,
                              marginTop: 30,
                            },
                          ]}
                        >
                          <ActivityIndicator size="small" color="#fff" />
                        </View>
                      )}
                    </View>
                  ) : null}

                  {this.props.route.params.item.rating ? (
                    <View
                      style={{
                        margin: 15,
                        marginLeft: 60,
                        marginRight: 60,
                        marginBottom: 20,
                      }}
                    >
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.props.route.params.item.rating}
                        reversed
                        fullStarColor={"#D3A257"}
                        emptyStarColor={"#ccc"}
                        starSize={20}
                      />
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            ) : (
              <View style={{ flex: 1 }}>
                {this.props.route.params.item.order_status == "in_progress" ? (
                  <ScrollView
                    ref={(ref) => (this.scrollView = ref)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      this.scrollView.scrollToEnd({ animated: true });
                    }}
                  >
                    {this.RenderContent()}
                  </ScrollView>
                ) : null}

                {this.props.route.params.item.order_status == "new" ? (
                  <ScrollView
                    ref={(ref) => (this.scrollView = ref)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      this.scrollView.scrollToEnd({ animated: true });
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 100,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="message-bulleted-off"
                        size={50}
                        color="#606060"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#606060",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 2,
                          marginLeft: 60,
                          marginRight: 60,
                        }}
                      >
                        {i18n.t("offer_waiting")}
                      </Text>

                      {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('OffersOrder',{id:this.props.route.params.item.id})}  style={{height:35,width:110,backgroundColor:'#D3A257',borderRadius:30,marginTop:10,alignItems:'center',justifyContent:'center',flexDirection:this.props.Language == 'ar' ?'row':'row-reverse'}}>
                          <Feather name={this.props.Language == 'ar' ? "arrow-left":"arrow-right"} size={17} color="#fff" style={{marginLeft:this.props.Language == 'ar' ? 7:0,marginRight:this.props.Language == 'en' ?7:0}} />
                          <Text style={{flex:1,fontSize:12,color:'#fff',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3,marginRight:this.props.Language == 'ar' ?15:0,marginLeft:this.props.Language == 'en' ?15:0}}>{i18n.t('watch')}</Text>
                      </TouchableOpacity>
                     */}
                    </View>
                  </ScrollView>
                ) : null}

                {this.props.route.params.item.order_status == "completed" ? (
                  <ScrollView
                    ref={(ref) => (this.scrollView = ref)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      this.scrollView.scrollToEnd({ animated: true });
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 100,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="message-bulleted-off"
                        size={50}
                        color="#606060"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#606060",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 2,
                          marginLeft: 60,
                          marginRight: 60,
                        }}
                      >
                        {i18n.t("Complete_order")}
                      </Text>
                    </View>
                  </ScrollView>
                ) : null}

                {this.props.route.params.item.order_status == "canceled" ? (
                  <ScrollView
                    ref={(ref) => (this.scrollView = ref)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      this.scrollView.scrollToEnd({ animated: true });
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 100,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="message-bulleted-off"
                        size={50}
                        color="#606060"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#606060",
                          fontFamily: "Medium",
                          textAlign: "center",
                          marginTop: 2,
                          marginLeft: 60,
                          marginRight: 60,
                        }}
                      >
                        {i18n.t("canceled_order")}
                      </Text>
                    </View>
                  </ScrollView>
                ) : null}
              </View>
            )}
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
                اختر اللغة
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.changeLang("اللغة العربية")}
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
                اللغة العربية
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.changeLang("English")}
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
                English
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {this.state.page == "Chat" &&
        this.props.route.params.item.order_status == "in_progress" ? (
          // <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding":null} enabled>
          <View
            style={{
              flexDirection:
                this.props.Language == "ar" ? "row" : "row-reverse",
              paddingTop: 5,
              paddingLeft: 15,
              paddingRight: 15,
              marginBottom:
                Platform.OS === "ios"
                  ? this.state.keyboardHeight + this.state.inputHeight
                  : 30,
            }}
          >
            {this.RenderBtn()}

            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              {this.renderInput()}

              <TouchableOpacity
                onPress={() => this._pickFile()}
                style={{
                  justifyContent: "center",
                  borderRadius: 25,
                  width: 40,
                  height: 45,
                  alignItems: "center",
                  backgroundColor: "#F4F5F7",
                  position: "absolute",
                  left: this.props.Language == "ar" ? 15 : null,
                  right: this.props.Language == "en" ? 15 : null,
                }}
              >
                <FontAwesome name="file" size={14} color="#606060" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this._pickImage()}
                style={{
                  justifyContent: "center",
                  borderRadius: 25,
                  width: 40,
                  height: 45,
                  alignItems: "center",
                  backgroundColor: "#F4F5F7",
                  position: "absolute",
                  left: this.props.Language == "ar" ? 45 : null,
                  right: this.props.Language == "en" ? 45 : null,
                }}
              >
                <FontAwesome name="image" size={15} color="#606060" />
              </TouchableOpacity>
            </View>
          </View>
        ) : // </KeyboardAvoidingView>
        null}
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
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  item: {
    marginVertical: 7,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    marginLeft: 0,
    marginRight: 0,
  },
  balloon: {
    maxWidth: 250,
    padding: 10,
    borderRadius: 12,
  },
});

const mapStateToProps = (state) => {
  return {
    data: state.GetOrderChat.data,
    msg: state.GetOrderChat.msg,
    loading: state.GetOrderChat.loading,

    loading_complete: state.CompleteOrder.loading,
    data_complete: state.CompleteOrder.data,

    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, {
  GetOrderChat,
  StoreChat,
  CompleteOrder,
  GetMyOrder,
})(MyOrderDetailsProvider);
