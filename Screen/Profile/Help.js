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
import { GetHelp } from "../../Actions";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      title: "",
      des: "",
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

  async sendRequest() {
    const { title, des } = this.state;
    var id = await AsyncStorage.getItem("id_user");

    if (title.trim() !== "" && des.trim() !== "") {
      this.props.GetHelp(id, title, des);
    } else {
      showMessage({
        message: i18n.t("errorr"),
        description: i18n.t("check_field"),
        type: "error",
        backgroundColor: "red",
      });
    }
  }

  UNSAFE_componentWillReceiveProps(NextProps) {
    if (NextProps.data) {
      showMessage({
        message: i18n.t("send_done"),
        description: i18n.t("send_done_des"),
        type: "success",
        backgroundColor: "green",
      });

      setTimeout(() => {
        this.props.navigation.goBack();
      }, 2000);
    }
  }

  renderLoginBtn() {
    if (this.props.loading) {
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
          onPress={() => this.sendRequest()}
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
            {i18n.t("send")}
          </Text>
        </TouchableOpacity>
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
                {i18n.t("help")}
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
                {i18n.t("help")}
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
            <Input
              inputStyle={{
                textAlign: this.props.Language == "ar" ? "right" : "left",
                fontFamily: "Medium",
                fontSize: 15,
                paddingRight: this.props.Language == "ar" ? 10 : 0,
                paddingLeft: this.props.Language == "en" ? 10 : 0,
              }}
              placeholder={i18n.t("title")}
              returnKeyType="done"
              autoCapitalize="none"
              placeholderTextColor={"#606060"}
              inputContainerStyle={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={(title) => this.setState({ title })}
            />

            <TextInput
              style={[
                styles.input,
                {
                  textAlignVertical: "top",
                  height: 150,
                  paddingLeft: 20,
                  marginRight: 10,
                  marginLeft: 10,
                  textAlign: this.props.Language == "ar" ? "right" : "left",
                  paddingTop: 15,
                  fontFamily: "Medium",
                },
              ]}
              underlineColorAndroid="transparent"
              placeholder={i18n.t("description")}
              placeholderTextColor={"#606060"}
              numberOfLines={5}
              multiline
              returnKeyType="done"
              ref={(note) => (this.note = note)}
              onChangeText={(des) => this.setState({ des })}
            />

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
    data_count_notification: state.CountNotification.data,

    Language: state.ChecLanguage.Language,
    data: state.GetHelp.data,
    loading: state.GetHelp.loading,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { GetHelp })(Help);
