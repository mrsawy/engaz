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
  KeyboardAvoidingView,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import {} from "../../Actions";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

import StarRating from "react-native-star-rating";

class SuccessOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      payment: "cash",
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

  selectPayment(val) {
    this.setState({ payment: val });
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
        <View style={{ margin: 15, height: 370 }}>
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            <Image
              source={require("../../assets/success.png")}
              style={{ height: 100, width: 180 }}
            />
          </View>

          <Text
            style={{
              fontSize: 20,
              color: "#457045",
              fontFamily: "BOLD",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {i18n.t("thanks")}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#2a2a2a",
              fontFamily: "BOLD",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {i18n.t("thanks_des")}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#606060",
              fontFamily: "Medium",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {i18n.t("order_num")} : {this.props.route.params.id}
          </Text>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("MyOrderDetails", {
                item: this.props.route.params.item,
              })
            }
            style={[
              styles.btn,
              {
                height: 55,
                backgroundColor: "#2a2a2a",
                justifyContent: "center",
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
              {i18n.t("details_order")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
            style={[
              styles.btn,
              {
                height: 55,
                backgroundColor: "#fff",
                justifyContent: "center",
                marginBottom: 40,
                marginTop: 0,
                borderColor: "#2a2a2a",
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#2a2a2a",
                fontFamily: "Medium",
                textAlign: "center",
                marginTop: 3,
              }}
            >
              {i18n.t("back_home")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    height: 40,
    justifyContent: "center",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    data_count_notification: state.CountNotification.data,

    data_count_msg: state.CountGetMsgNotRead.data,

    Language: state.ChecLanguage.Language,
  };
};

export default connect(mapStateToProps, {})(SuccessOrder);
