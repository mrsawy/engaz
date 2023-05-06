import { AsyncStorage } from "react-native";
import { API_URI } from "../constants";
export const SignUpAuthFun = (
  type,
  name,
  mobile,
  email,
  password,
  city,
  governorate,
  photo,
  cover,
  Interests,
  approved_login
) => {
  return (dispatch) => {
    dispatch({ type: "SignUpHandle" });

    const formData = new FormData();
    formData.append("type", type);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("city", city);
    formData.append("governorate", governorate);
    formData.append("approved_login", approved_login);
    if (Interests) {
      formData.append("Interests", JSON.stringify(Interests));
    }

    if (photo) {
      const uriPart = photo.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("photo", {
        uri: photo,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    if (cover) {
      const uriPart = cover.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("cover", {
        uri: cover,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    fetch(API_URI + "/api/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          if (responseJson.data.approved_login == "yes") {
            AsyncStorage.setItem("token", responseJson.token);
            AsyncStorage.setItem("id_user", responseJson.data.id.toString());
            AsyncStorage.setItem("type", responseJson.data.type.toString());
            AsyncStorage.setItem("name", responseJson.data.name.toString());
            if (responseJson.data.photo) {
              AsyncStorage.setItem("photo", responseJson.data.photo.toString());
            }
            if (responseJson.data.cover) {
              AsyncStorage.setItem("cover", responseJson.data.cover.toString());
            }
            AsyncStorage.setItem("mobile", responseJson.data.mobile.toString());
            AsyncStorage.setItem("email", responseJson.data.email.toString());
            AsyncStorage.setItem("city", responseJson.data.city.toString());
            AsyncStorage.setItem(
              "governorate",
              responseJson.data.governorate.toString()
            );

            dispatch({
              type: "SignUpSuccess",
              data: responseJson.data,
              token: responseJson.token,
            });
          } else {
            dispatch({ type: "SignUpSuccess", data: responseJson.data });
          }
        } else {
          dispatch({
            type: "SignUpFaild",
            false_name: responseJson.false_name,
            false_phone: responseJson.false_phone,
            false_password: responseJson.false_password,
            false_city: responseJson.false_city,
            false_governorate: responseJson.false_governorate,
            false_email: responseJson.false_email,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "SignUpFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const EditProfileAuth = (
  id,
  name,
  photo,
  cover,
  mobile,
  email,
  city,
  governorate,
  image_upload,
  cover_upload
) => {
  return (dispatch) => {
    dispatch({ type: "EditProfileHandle" });

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("city", city);
    formData.append("governorate", governorate);

    if (image_upload) {
      if (photo) {
        const uriPart = photo.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("photo", {
          uri: photo,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }
    }

    if (cover_upload) {
      if (cover) {
        const uriPart = cover.split(".");
        const fileExtension = uriPart[uriPart.length - 1];

        formData.append("cover", {
          uri: cover,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        });
      }
    }

    fetch(API_URI + "/api/edit_profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          AsyncStorage.setItem("id_user", responseJson.data.id.toString());
          AsyncStorage.setItem("type", responseJson.data.type.toString());
          AsyncStorage.setItem("name", responseJson.data.name.toString());
          if (responseJson.data.photo) {
            AsyncStorage.setItem("photo", responseJson.data.photo.toString());
          }
          if (responseJson.data.cover) {
            AsyncStorage.setItem("cover", responseJson.data.cover.toString());
          }
          AsyncStorage.setItem("mobile", responseJson.data.mobile.toString());
          AsyncStorage.setItem("email", responseJson.data.email.toString());
          AsyncStorage.setItem("city", responseJson.data.city.toString());
          AsyncStorage.setItem(
            "governorate",
            responseJson.data.governorate.toString()
          ).then(() => {
            dispatch({ type: "EditProfileSuccess", data: responseJson.data });
          });
        } else {
          dispatch({
            type: "EditProfileFaild",
            false_name: responseJson.false_name,
            false_email: responseJson.false_email,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "EditProfileFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
