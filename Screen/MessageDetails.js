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
  Vibration,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
} from "react-native";
import * as Font from "expo-font";
import { API_URI } from "../constants";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../Language";
import { connect } from "react-redux";
import { GetChat, StoreChat } from "../Actions";
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
import * as Notifications from "expo-notifications";

class MessageDetails extends React.Component {
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
      loading_image: false,
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

    this.props.GetChat(this.props.route.params.item.id);
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });

    this.setState({ refreshing: false });
  };

  _handleNotification = async (notification) => {};

  _handleNotification2 = async (notification) => {
    if (
      Platform.OS === "android"
        ? notification.request.content.data.message_id !== undefined
        : notification.request.content.data.body.message_id !== undefined
    ) {
      Vibration.vibrate();
      var id_user = await AsyncStorage.getItem("id_user");
      var item = this.props.route.params.item;

      if (
        Platform.OS === "android"
          ? notification.request.content.data.msg.text_message !== "null"
          : notification.request.content.data.body.msg.text_message !== "null"
      ) {
        var sender_id_notification =
          Platform.OS === "android"
            ? notification.request.content.data.msg.sender_id
            : notification.request.content.data.body.msg.sender_id;
        var revicedr_id_notification =
          Platform.OS === "android"
            ? notification.request.content.data.msg.recived_id
            : notification.request.content.data.body.msg.recived_id;
        var we = {
          sender_id: item.sender_user_id.id,
          recived_id:
            id_user == sender_id_notification
              ? sender_id_notification
              : revicedr_id_notification,
          message_id: this.props.route.params.item.id,
          text_message:
            Platform.OS === "android"
              ? notification.request.content.data.msg.text_message
              : notification.request.content.data.body.msg.text_message,
          noti: "true",
        };
      }

      if (
        Platform.OS === "android"
          ? notification.request.content.data.msg.image
          : notification.request.content.data.body.msg.image
      ) {
        var we = {
          sender_id: item.sender_user_id.id,
          recived_id:
            id_user == sender_id_notification
              ? sender_id_notification
              : revicedr_id_notification,
          message_id: this.props.route.params.item.id,
          text_message: null,
          image:
            Platform.OS === "android"
              ? notification.request.content.data.msg.image
              : notification.request.content.data.body.msg.image,
          noti: "true",
        };
      }

      if (
        Platform.OS === "android"
          ? notification.request.content.data.msg.file
          : notification.request.content.data.body.msg.file
      ) {
        var we = {
          sender_id: item.sender_user_id.id,
          recived_id:
            id_user == sender_id_notification
              ? sender_id_notification
              : revicedr_id_notification,
          message_id: this.props.route.params.item.id,
          text_message: null,
          file:
            Platform.OS === "android"
              ? notification.request.content.data.msg.file
              : notification.request.content.data.body.msg.file,
          noti: "true",
        };
      }

      // if(this.state.data.length == 0){
      //     this.props.GetChat(this.props.route.params.item.id)
      // }else{
      this.setState({ data: [...this.state.data, we] });
      // }
    }
  };

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.setState({ data: [...this.state.data, ...NextProps.data] });
    }

    // if(NextProps.msg  && NextProps.msg !== null && NextProps.msg !== this.props.msg){
    //   this.setState({ id_msg :  NextProps.msg.id  });
    // }

    // if(NextProps.data_complete  && NextProps.data_complete !== null && NextProps.data_complete !== this.props.data_complete){
    //   showMessage({
    //         message: i18n.t('success'),
    //         description: i18n.t('success_des'),
    //         type: "success",
    //         backgroundColor: "green",
    //       });

    //       var id_user = await AsyncStorage.getItem('id_user');
    //       this.props.GetMyOrder(id_user)
    //       setTimeout(async ()  =>  {
    //         this.props.navigation.navigate('MyOrder');
    //         }, 1500);
    // }
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
                style={{
                  color: "#fff",
                  fontFamily: "Medium",
                  fontSize: 15,
                  lineHeight: 20,
                }}
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
                style={{
                  color: "#24344D",
                  fontFamily: "Medium",
                  fontSize: 15,
                  lineHeight: 20,
                }}
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
        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            marginRight: 15,
            marginLeft: 15,
          }}
        >
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 15 }}>
                {this.state.id_user == item.sender_id && !item.noti
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

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        this._handleNotification(notification);
      }
    );

    const subscription2 = Notifications.addNotificationReceivedListener(
      (notification) => {
        this._handleNotification2(notification);
      }
    );

    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  //   componentWillUnmount () {
  //     this.keyboardDidShowListener.remove();
  //     this.keyboardDidHideListener.remove();
  //   }

  //   _keyboardDidShow = (e) => {
  //     this.setState({keyboardHeight: e.endCoordinates.height});
  //   }

  //   _keyboardDidHide = () => {
  //     this.setState({keyboardHeight: 0});
  //   }

  async sendData() {
    var id_user = await AsyncStorage.getItem("id_user");
    var item = this.props.route.params.item;

    var we = {
      created_date: new Date().getHours() + ":" + new Date().getMinutes(),
      sender_id: id_user,
      recived_id:
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id,
      message_id: this.props.route.params.item.id,
      text_message: this.state.text_messages,
    };

    if (this.state.data.length == 0) {
      this.props.StoreChat(
        id_user,
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id,
        this.props.route.params.item.id,
        this.state.text_messages,
        null,
        null
      );
      this.setState({ text_messages: "", first_return_msg: true });
      this.props.GetChat(this.props.route.params.item.id);
    } else {
      this.setState({
        data: [...this.state.data, we],
        total_num: this.state.total_num + 1,
      });
      this.props.StoreChat(
        id_user,
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id,
        this.props.route.params.item.id,
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
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id,
      message_id: this.props.route.params.item.id,
      text_message: null,
    };

    if (this.state.data.length == 0) {
      // this.props.StoreChat(id_user,id_user == item.user_id ? item.user_id_offers.id : item.user_id,this.props.route.params.item.id,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });
      // this.props.GetChat(this.props.route.params.item.id);

      const formData = new FormData();
      this.setState({ loading_image: true });

      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id
      );
      formData.append("message_id", this.props.route.params.item.id);
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
          this.setState({ loading_image: false });

          if (responseJson.status == "true") {
            this.setState({
              image: null,
              text_message: "",
              first_return_msg: true,
            });
            this.props.GetChat(this.props.route.params.item.id);
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
      // this.props.StoreChat(id_user,id_user == item.user_id ? item.user_id_offers.id : item.user_id,this.props.route.params.item.id,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });

      const formData = new FormData();
      this.setState({ loading_image: true });
      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id
      );
      formData.append("message_id", this.props.route.params.item.id);
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
          this.setState({ loading_image: false });
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
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id,
      message_id: this.props.route.params.item.id,
      text_message: null,
    };

    if (this.state.data.length == 0) {
      // this.props.StoreChat(id_user,id_user == item.user_id ? item.user_id_offers.id : item.user_id,this.props.route.params.item.id,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });
      // this.props.GetChat(this.props.route.params.item.id);

      const formData = new FormData();
      this.setState({ loading_image: true });
      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id
      );
      formData.append("message_id", this.props.route.params.item.id);
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
          this.setState({ loading_image: false });
          if (responseJson.status == "true") {
            this.setState({
              file: null,
              text_message: "",
              first_return_msg: true,
            });
            this.props.GetChat(this.props.route.params.item.id);
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
      // this.props.StoreChat(id_user,id_user == item.user_id ? item.user_id_offers.id : item.user_id,this.props.route.params.item.id,this.state.text_messages,this.state.image,null)
      // this.setState({ image:null,text_message:'',first_return_msg:true  });

      const formData = new FormData();
      this.setState({ loading_image: true });
      formData.append("sender_id", id_user);
      formData.append(
        "recived_id",
        id_user == item.sender_user_id.id
          ? item.receiver_user_id.id
          : item.sender_user_id.id
      );
      formData.append("message_id", this.props.route.params.item.id);
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
          this.setState({ loading_image: false });
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
    if (this.state.loading_image) {
      return (
        <View
          style={{
            justifyContent: "center",
            borderRadius: 25,
            width: 45,
            height: 45,
            alignItems: "center",
            backgroundColor: "#2a2a2a",
          }}
        >
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );
    } else if (this.state.image) {
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
                {i18n.t("msg")}
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
                {i18n.t("msg")}
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

        <View style={{ flex: 1 }}>
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {this.RenderContent()}
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
        >
          <View
            style={{
              flexDirection:
                this.props.Language == "ar" ? "row" : "row-reverse",
              paddingTop: 5,
              paddingLeft: 15,
              paddingRight: 15,
              marginBottom: this.state.keyboardHeight + this.state.inputHeight,
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
    data: state.GetChat.data,
    loading: state.GetChat.loading,

    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, { GetChat, StoreChat })(MessageDetails);
