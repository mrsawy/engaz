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
  FlatList,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import * as Font from "expo-font";
import { Icon, Input, Header, Rating } from "react-native-elements";
import i18n from "../../Language";
import { connect } from "react-redux";
import { GetMyOrder, CompleteOrder } from "../../Actions";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import Loading from "react-native-whc-loading";

import StarRating from "react-native-star-rating";

class RatingService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      refreshing: false,
      starCount: 3,
    };
  }

  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem("Language").then((Language) => {
      i18n.locale = Language;
      this.setState({ localLang: Language });
    });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
  };

  async LoadFontAsync() {
    await Font.loadAsync({
      BOLD: require("../../Fonts/NeoSansArabicBold.ttf"),
      Medium: require("../../Fonts/NeoSansArabic.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  async UNSAFE_componentWillReceiveProps(NextProps) {
    if (
      NextProps.data &&
      NextProps.data !== null &&
      NextProps.data !== this.props.data
    ) {
      this.setState({ data: NextProps.data });
    }

    if (
      NextProps.data_chat &&
      NextProps.data_chat !== null &&
      NextProps.data_chat !== this.props.data_chat
    ) {
      this.props.navigation.navigate("MessageDetails", {
        item: NextProps.data_chat,
      });
    }

    if (
      NextProps.loading_chat &&
      NextProps.loading_chat !== null &&
      NextProps.loading_chat !== this.props.loading_chat
    ) {
      this.refs.loading.show();
    } else {
      this.refs.loading.show(false);
    }
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
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
                {i18n.t("close_rating")}
              </Text>
            </View>
            <View />
          </Header>
        ) : (
          <Header
            backgroundColor={"#2A2A2A"}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            <View />

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
                {i18n.t("close_rating")}
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
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Medium",
                fontSize: 13,
                color: "red",
                marginTop: 2,
              }}
            >
              {i18n.t("close_rating_des")}
            </Text>

            <View style={{ marginLeft: 40, marginRight: 40, marginTop: 15 }}>
              <StarRating
                maxStars={5}
                reversed
                fullStarColor={"#D3A257"}
                emptyStarColor={"#ccc"}
                starSize={30}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
            </View>

            {!this.props.loading_complete ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.CompleteOrder(
                    this.props.route.params.id,
                    this.state.starCount
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
        </ScrollView>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={300}
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
                {i18n.t("View_status")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("all")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("all")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("new")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("new")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("in_progress")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("in_progress")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("completed")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("completed")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.SelectedStuts("canceled")}
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#2a2a2a",
                  fontFamily: "Medium",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {i18n.t("canceled")}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        <Loading ref="loading" easing={Loading.EasingType.linear} />
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
});

const mapStateToProps = (state) => {
  return {
    Language: state.ChecLanguage.Language,

    data: state.GetMyOrder.data,
    loading: state.GetMyOrder.loading,
    data_count_notification: state.CountNotification.data,

    loading_complete: state.CompleteOrder.loading,
    data_complete: state.CompleteOrder.data,

    data_count_msg: state.CountGetMsgNotRead.data,
  };
};

export default connect(mapStateToProps, { GetMyOrder, CompleteOrder })(
  RatingService
);
