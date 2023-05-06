import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AsyncStorage,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, ListItem, BottomSheet } from "react-native-elements";
import i18n from "../Language";
import { connect } from "react-redux";
import { CheckLanguage } from "../Actions";
import RBSheet from "react-native-raw-bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";

class LanguageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      isVisible: false,
      lang: "اللغة العربية",
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
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  changeLang(lang) {
    this.RBSheet.close();
    this.setState({ lang: lang });
  }

  Go() {
    if (this.state.lang == "اللغة العربية") {
      AsyncStorage.setItem("Language", "ar");
    } else {
      AsyncStorage.setItem("Language", "en");
    }
    this.props.navigation.navigate("SettingApp");
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={"transparent"}
        />
        {/* <ScrollView> */}

        <View style={{ flex: 1, padding: 30, flexDirection: "row" }}>
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 30,
            }}
          >
            <Image
              style={{ width: 40, height: 230 }}
              source={require("../assets/rightsideintro.png")}
            />
          </View>
          <View
            style={{
              flex: 1,
              height: 250,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 220, height: 220, marginHorizontal: 25 }}
              source={require("../assets/logo.png")}
            />
          </View>
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 40, height: 170 }}
              source={require("../assets/leftsideintro.png")}
            />
          </View>
        </View>
        <View style={{ flex: 1, padding: 30 }}>
          <Text
            style={{
              fontFamily: "BOLD",
              textAlign: "center",
              fontSize: 25,
              color: "#2A2A2A",
            }}
          >
            اختر اللغة المناسبة لك
          </Text>
          <Text
            style={{
              paddingRight: 25,
              paddingLeft: 25,
              fontFamily: "Medium",
              textAlign: "center",
              fontSize: 15,
              color: "#464748",
              marginTop: 5,
              lineHeight: 20,
            }}
          >
            تطبيق انجاز للخدمات الحكومية
          </Text>

          <TouchableOpacity
            onPress={() => this.RBSheet.open()}
            style={{
              marginTop: 30,
              flexDirection: "row-reverse",
              backgroundColor: "#F4F5F7",
              borderRadius: 15,
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
              width: 200,
              alignSelf: "center",
            }}
          >
            <View
              style={{
                width: 30,
                borderLeftColor: "#2a2a2a",
                borderLeftWidth: 1,
                paddingLeft: 5,
              }}
            >
              <MaterialIcons name="language" size={24} color="#2a2a2a" />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                color: "#2a2a2a",
                fontFamily: "Medium",
                textAlign: "right",
                marginTop: 4,
                marginRight: 8,
              }}
            >
              {this.state.lang}
            </Text>
            <MaterialIcons
              style={{ width: 40 }}
              name="keyboard-arrow-down"
              size={24}
              color="#2a2a2a"
            />
          </TouchableOpacity>

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

          <TouchableOpacity onPress={() => this.Go()} style={[styles.btn]}>
            <Text
              style={{
                fontSize: 18,
                color: "#fff",
                fontFamily: "Medium",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              لنبدأ
            </Text>
          </TouchableOpacity>
        </View>

        {/* </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default connect(mapStateToProps, { CheckLanguage })(LanguageScreen);
