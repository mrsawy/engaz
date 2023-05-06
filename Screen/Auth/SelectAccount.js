import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Image } from "react-native-elements";
import i18n from "../../Language";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      select: null,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  provider() {
    this.setState({ select: "provider" });
  }

  user() {
    this.setState({ select: "user" });
  }

  renderBtn() {
    if (this.state.select) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(
              this.state.select == "user" ? "SignUpUser" : "SelectCategories",
              { TypeAccount: this.state.select }
            )
          }
          style={[styles.btn, { backgroundColor: "#2A2A2A" }]}
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
            {i18n.t("Next")}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.btn, { backgroundColor: "#606060" }]}>
          <Text
            style={{
              fontSize: 16,
              color: "#fff",
              fontFamily: "Medium",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            {i18n.t("Next")}
          </Text>
        </View>
      );
    }
  }

  selectAccount() {
    if (this.state.select == "provider") {
      return (
        <View
          style={{
            flexDirection: "row-reverse",
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => this.provider()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 10,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#2A2A2A",
              }}
            >
              <FontAwesome5 name="user-tie" size={24} color="#eee" />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#D3A257",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("provider")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.user()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 5,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#eee",
              }}
            >
              <Icon
                name="user"
                type="font-awesome"
                size={24}
                color={"#454545"}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("user")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (this.state.select == "user") {
      return (
        <View
          style={{
            flexDirection: "row-reverse",
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => this.provider()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 10,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#eee",
              }}
            >
              <FontAwesome5 name="user-tie" size={24} color="#454545" />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("provider")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.user()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 5,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#2A2A2A",
              }}
            >
              <Icon name="user" type="font-awesome" size={24} color={"#eee"} />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#D3A257",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("user")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!this.state.select) {
      return (
        <View
          style={{
            flexDirection: "row-reverse",
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => this.provider()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 10,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#eee",
              }}
            >
              <FontAwesome5 name="user-tie" size={24} color="#454545" />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("provider")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.user()}
            style={{
              backgroundColor: "#fff",
              height: 150,
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              flex: 1,
              marginTop: 10,
              margin: 5,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 35,
                width: 70,
                height: 70,
                backgroundColor: "#eee",
              }}
            >
              <Icon
                name="user"
                type="font-awesome"
                size={24}
                color={"#454545"}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "#454545",
                fontFamily: "BOLD",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              {i18n.t("user")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={"transparent"}
        />

        <View style={{ flex: 4, paddingTop: 50 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={{
              padding: 15,
              alignSelf:
                this.props.Language == "ar" ? "flex-end" : "flex-start",
              marginRight: this.props.Language == "ar" ? 10 : 0,
              marginLeft: this.props.Language == "en" ? 10 : 0,
            }}
          >
            <MaterialCommunityIcons
              name={this.props.Language == "ar" ? "arrow-right" : "arrow-left"}
              size={24}
              color="#245359"
            />
          </TouchableOpacity>

          <Text
            style={{
              marginLeft: 30,
              paddingRight: 30,
              fontSize: 24,
              fontFamily: "BOLD",
              color: "#000",
              textAlign: this.props.Language == "en" ? "left" : "right",
            }}
          >
            {i18n.t("account_type")}
          </Text>
          <Text
            style={{
              marginLeft: 30,
              paddingRight: 30,
              fontSize: 15,
              fontFamily: "Medium",
              color: "#454545",
              marginTop: 3,
              textAlign: this.props.Language == "en" ? "left" : "right",
              paddingBottom: 40,
            }}
          >
            {i18n.t("account_type_des")}
          </Text>

          {this.selectAccount()}

          {this.renderBtn()}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={{ marginTop: 15, padding: 15, marginBottom: 40 }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#a2a2a2",
                fontFamily: "Medium",
                textAlign: "center",
              }}
            >
              {i18n.t("signAlreadyAccount")}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#454545",
                fontFamily: "Medium",
                textAlign: "center",
                marginTop: 3,
              }}
            >
              {i18n.t("goLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: "#eee",
    borderColor: "#e3e3e3",
    borderWidth: 1,
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
  };
};

export default connect(mapStateToProps, {})(SelectAccount);
