import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Header, Image } from "react-native-elements";
import i18n from "../../Language";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import { GetCategories, GetStatistic } from "../../Actions";
import Loading from "react-native-whc-loading";
import { showMessage, hideMessage } from "react-native-flash-message";
import { API_URI } from "../../constants";
class EditCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      select: null,
      selecetdNewSpare: [],
      loading: false,
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

    this.GetCategoriesUser();
  }

  renderBtn() {
    if (!this.state.loading) {
      return (
        <TouchableOpacity
          onPress={() => this.Save()}
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
            {i18n.t("save")}{" "}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.btn, { backgroundColor: "#2A2A2A" }]}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );
    }
  }

  async GetCategoriesUser() {
    const id = await AsyncStorage.getItem("id_user");
    this.refs.loading.show();
    fetch(API_URI + "/api/get_cat_user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refs.loading.show(false);
        if (responseJson.status == "true") {
          var service = JSON.parse(responseJson.data.service);
          service.map((prop) => {
            this.SelectNewSpare(prop);
          });
        } else {
        }
      })
      .catch((error) => {});
  }

  async Save() {
    const id = await AsyncStorage.getItem("id_user");
    this.setState({ loading: true });

    fetch(API_URI + "/api/save_cat_user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        service: this.state.selecetdNewSpare,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({ loading: false });
        if (responseJson.status == "true") {
          showMessage({
            message: i18n.t("save_done"),
            description: i18n.t("save_done_des"),
            type: "success",
            backgroundColor: "green",
          });

          var id_user = await AsyncStorage.getItem("id_user");
          this.props.GetStatistic(id_user);

          setTimeout(async () => {
            this.props.navigation.goBack();
          }, 1500);
        } else {
          showMessage({
            message: i18n.t("errorr"),
            description: i18n.t("errorr"),
            type: "error",
            backgroundColor: "red",
          });
        }
      })
      .catch((error) => {});
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
      <ScrollView style={styles.container}>
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
                {i18n.t("edit_cat")}
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
                {i18n.t("edit_cat")}
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

        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
          {this.GetData()}
        </View>

        {this.renderBtn()}

        <Loading ref="loading" easing={Loading.EasingType.linear} />
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
    data_count_notification: state.CountNotification.data,
    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { GetCategories, GetStatistic })(
  EditCategories
);
