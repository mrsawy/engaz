import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  AsyncStorage,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Image } from "react-native-elements";
import i18n from "../../Language";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import { GetCategories } from "../../Actions";

class SelectCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      select: null,
      selecetdNewSpare: [],
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

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.props.GetCategories();
    this.setState({ refreshing: false });
  };

  advertiser() {
    this.setState({ select: "advertiser" });
  }

  user() {
    this.setState({ select: "user" });
  }

  renderBtn() {
    if (this.state.selecetdNewSpare.length > 0) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("SignUp", {
              TypeAccount: this.props.route.params["TypeAccount"],
              Interests: this.state.selecetdNewSpare,
            })
          }
          style={[styles.btn, { backgroundColor: "#2A2A2A" }]}
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
            {i18n.t("Next")}{" "}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.btn, { backgroundColor: "#606060" }]}>
          <Text
            style={{
              fontSize: 15,
              color: "#fff",
              fontFamily: "Medium",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            {i18n.t("Next")}{" "}
          </Text>
        </View>
      );
    }
  }

  selecetdNewSpare = (item) => {
    const { selecetdNewSpare } = this.state;
    let isSelected =
      selecetdNewSpare.filter((o) => {
        return o === item.id;
      }).length > 0
        ? true
        : false;

    return (
      <TouchableOpacity
        onPress={() => this.SelectNewSpare(item.id)}
        style={{
          flexDirection: "row-reverse",
          flex: 1,
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isSelected ? "#2a2a2a" : "#c9c9c9",
          marginRight: 5,
          marginLeft: 5,
          backgroundColor: isSelected ? "#2a2a2a" : "#fff",
          marginBottom: 10,
        }}
      >
        {/* <MaterialCommunityIcons name="account-check" size={24} style={{marginLeft:10}} color="#D3A257" /> */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: "BOLD",
            color: isSelected ? "#D3A257" : "#000",
            textAlign: "center",
            marginTop: 3,
          }}
        >
          {this.props.Language == "ar" ? item.name_ar : item.name_en}
        </Text>
      </TouchableOpacity>
    );
  };

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
          numColumns={2}
          renderItem={({ item }) =>
            // <TouchableOpacity onPress={()=> this.SelectNewSpare(item.id)} style={{flexDirection:'row-reverse',flex:1,padding:15,alignItems:'center',justifyContent:'center',borderRadius:8,borderWidth:1,borderColor:'#c9c9c9',marginRight:5,marginLeft:5}}>
            // {/* <MaterialCommunityIcons name="account-check" size={24} style={{marginLeft:10}} color="#D3A257" /> */}
            // <Text style={{fontSize:14,fontFamily:'BOLD',color:'#000',textAlign:'center'}}>
            //     {this.props.Language == 'ar' ?item.name_ar:item.name_en}
            // </Text>
            // </TouchableOpacity>
            this.selecetdNewSpare(item)
          }
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

  SelectNewSpare(id) {
    let selecetdNewSpare = this.state.selecetdNewSpare;
    var index = this.state.selecetdNewSpare.indexOf(id);
    if (index > -1) {
      this.state.selecetdNewSpare.splice(index, 1);
    } else {
      this.state.selecetdNewSpare.push(id);
    }
    this.setState({ selecetdNewSpare });
  }

  componentDidMount() {
    this.LoadFontAsync();
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
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
            {i18n.t("service_type")}
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
            {i18n.t("service_type_des")}
          </Text>

          <View style={{ marginLeft: 15, marginRight: 15 }}>
            {this.GetData()}
          </View>

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
    loading: state.GetCategories.loading,
    data: state.GetCategories.data,
  };
};

export default connect(mapStateToProps, { GetCategories })(SelectCategories);
