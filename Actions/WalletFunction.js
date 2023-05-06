import { API_URI } from "../constants";
export const GetWallet = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "GetWalletHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);

    fetch(API_URI + "/api/get_wallet", {
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
          dispatch({ type: "GetWalletSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetWalletFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetWalletFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetWalletLog = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "GetWalletLogHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);

    fetch(API_URI + "/api/get_wallet_log", {
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
          dispatch({ type: "GetWalletLogSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetWalletLogFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetWalletLogFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
