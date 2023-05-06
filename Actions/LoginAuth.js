import { AsyncStorage } from "react-native";
import { API_URI } from "../constants";
export const LoginAuth = (email, password) => {
  return (dispatch) => {
    dispatch({ type: "LoginAuthHandle" });

    fetch(API_URI + "/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          AsyncStorage.setItem("token", responseJson.token);
          AsyncStorage.setItem("id_user", responseJson.user.id.toString());
          AsyncStorage.setItem("type", responseJson.user.type.toString());
          AsyncStorage.setItem("name", responseJson.user.name.toString());
          if (responseJson.user.photo) {
            AsyncStorage.setItem("photo", responseJson.user.photo.toString());
          }
          if (responseJson.user.cover) {
            AsyncStorage.setItem("cover", responseJson.user.cover.toString());
          }
          AsyncStorage.setItem("mobile", responseJson.user.mobile.toString());
          AsyncStorage.setItem("email", responseJson.user.email.toString());
          AsyncStorage.setItem("city", responseJson.user.city.toString());
          AsyncStorage.setItem(
            "governorate",
            responseJson.user.governorate.toString()
          ).then(() => {
            dispatch({
              type: "LoginAuthSuccess",
              user: responseJson.user,
              token: responseJson.token,
            });
          });
        } else if (responseJson.status == "false_pending") {
          dispatch({ type: "LoginAuthFaildBan", data_ban: "العضوية محظورة" });
        } else {
          dispatch({ type: "LoginAuthFaild", error: responseJson.error });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LoginAuthFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const ChangeNumberFun = (id, mobile) => {
  return (dispatch) => {
    dispatch({ type: "ChangeNumberHandle" });

    fetch("http://coigroup.net/api/change_number", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        mobile: mobile,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          AsyncStorage.setItem(
            "mobile_user",
            responseJson.data.mobile.toString()
          ).then(() => {
            dispatch({ type: "ChangeNumberSuccess", data: responseJson.data });
          });
        } else {
          dispatch({ type: "ChangeNumberFaild", error: "الكود خاطئ" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "ChangeNumberFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const SendCode = (id, mobile) => {
  return (dispatch) => {
    dispatch({ type: "SendCodeHandle" });

    var code = Math.floor(1000 + Math.random() * 9000);

    fetch("http://coigroup.net/api/send_code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: id,
        customer_code_active: code,
        mobile: mobile,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({ type: "SendCodeSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "SendCodeFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "SendCodeFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const CheckCode = (mobile, code) => {
  return (dispatch) => {
    dispatch({ type: "CheckCodeHandle" });

    fetch("http://coigroup.net/api/check_code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: mobile,
        customer_code_active: code,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          AsyncStorage.setItem("id_user", responseJson.user.id.toString());
          AsyncStorage.setItem("name", responseJson.user.name.toString());
          AsyncStorage.setItem("type", responseJson.user.type.toString());

          if (responseJson.user.photo) {
            AsyncStorage.setItem("photo", responseJson.user.photo.toString());
          }
          if (responseJson.user.cover) {
            AsyncStorage.setItem("cover", responseJson.user.cover.toString());
          }
          AsyncStorage.setItem("mobile", responseJson.user.mobile.toString());
          AsyncStorage.setItem("email", responseJson.user.email.toString());
          AsyncStorage.setItem("city", responseJson.user.city.toString());
          AsyncStorage.setItem(
            "governorate",
            responseJson.user.governorate.toString()
          ).then(() => {
            dispatch({
              type: "CheckCodeSuccess",
              user: responseJson.user,
              token: responseJson.token,
            });
          });
        } else {
          dispatch({ type: "CheckCodeFaild", error: "الكود خاطئ" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "CheckCodeFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
