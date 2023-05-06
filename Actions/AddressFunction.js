import { API_URI } from "../constants";
export const GetAddress = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetAddressHandle" });
    const formData = new FormData();
    formData.append("id", id);

    fetch(API_URI + "/api/get_address", {
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
          dispatch({ type: "GetAddressSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetAddressFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetAddressFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const StoreAddress = (
  user_id,
  type,
  city,
  governorate,
  description,
  longitude,
  latitude
) => {
  return (dispatch) => {
    dispatch({ type: "StoreAddressHandle" });
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("type", type);
    formData.append("city", city);
    formData.append("governorate", governorate);
    formData.append("description", description);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);

    fetch(API_URI + "/api/store_address", {
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
          dispatch({ type: "StoreAddressSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "StoreAddressFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "StoreAddressFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
