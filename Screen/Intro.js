import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, CheckBox, SearchBar } from "react-native-elements";
import AppIntroSlider from "react-native-app-intro-slider";
import { connect } from "react-redux";
import {} from "../Actions";

const slides = [
  {
    description: "تطبيق انجاز لإتمام جميع الخدمات الحكومية",
    backgroundColor: "#fff",
    image: (
      <Image
        style={{ width: 220, height: 220 }}
        source={require("../assets/intro1.png")}
      />
    ),
    title: "تطبيق انجاز",
  },
  {
    description: "انجاز تطبيق سهل ويسير لانهاء كافة معاملاتك الحكومية",
    backgroundColor: "#fff",
    image: (
      <Image
        style={{ width: 220, height: 220 }}
        source={require("../assets/intro2.png")}
      />
    ),
    title: "تطبيق انجاز",
  },
  {
    description:
      "انجاز”  تطبيق  يقدّم خدمات حكومية و خدمات أخرى تحت الضمان ، في الوقت المحدد من قبل العميل بأعلى مستويات الجودة",
    backgroundColor: "#fff",
    image: (
      <Image
        style={{ width: 220, height: 220 }}
        source={require("../assets/intro3.png")}
      />
    ),
    title: "تطبيق انجاز",
    done: true,
  },
];

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      showRealApp: false,
      hidePagination: true,
    };
  }

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  GoTo() {
    // AsyncStorage.setItem('FirstLunch','true').then(() => {
    this.props.navigation.navigate("LanguageScreen");
    // })
  }

  async UNSAFE_componentWillMount() {
    this.LoadFontAsync();
  }

  _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: "#fff" }]}>
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
            {item.image}
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
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "BOLD",
              textAlign: "center",
              fontSize: 25,
              color: "#2A2A2A",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              paddingRight: 30,
              paddingLeft: 30,
              fontFamily: "Medium",
              textAlign: "center",
              fontSize: 15,
              color: "#464748",
              marginTop: 5,
              lineHeight: 20,
            }}
          >
            {item.description}
          </Text>

          {item.done ? (
            <TouchableOpacity onPress={() => this.GoTo()} style={[styles.btn]}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#fff",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                تم
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  render() {
    if (slides) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent={true}
            barStyle="dark-content"
            backgroundColor={"transparent"}
          />

          <AppIntroSlider
            renderItem={this._renderItem}
            slides={slides}
            buttonTextStyle={{ color: "#fff", fontFamily: "Medium" }}
            showNextButton={false}
            dotStyle={{
              backgroundColor: "#cacaca",
              width: 12,
              height: 12,
              borderRadius: 7.5,
              marginTop: -100,
            }}
            activeDotStyle={{
              backgroundColor: "#2A2A2A",
              width: 12,
              height: 12,
              borderRadius: 7.5,
              marginTop: -100,
            }}
          />
        </View>
      );
    } else {
      return (
        // this.props.navigation.navigate('Login')
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/splash2.png")}
            style={{ width: "100%", height: "100%", zIndex: 1 }}
          >
            <View
              style={{
                zIndex: 99,
                justifyContent: "center",
                height: "100%",
                marginTop: 130,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color="#fff" />
            </View>
          </ImageBackground>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leftIcon: {
    position: "absolute",
  },
  slide: {
    flex: 1,
  },
  btn: {
    borderRadius: 30,
    height: 55,
    justifyContent: "center",
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 15,
    backgroundColor: "#2A2A2A",
    marginTop: 15,
  },
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(Intro);
