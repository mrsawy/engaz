import { API_URI } from "../constants";
export const OrderStore = (
  user_id,
  maincategories_id,
  subcategories_id,
  address_id,
  title,
  description,
  date,
  time,
  image1,
  image2,
  image3
) => {
  return (dispatch) => {
    dispatch({ type: "OrderStoreHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("maincategories_id", maincategories_id);
    formData.append("subcategories_id", subcategories_id);
    formData.append("address_id", address_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);

    if (image1) {
      const uriPart = image1.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("image1", {
        uri: image1,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    if (image2) {
      const uriPart = image2.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("image2", {
        uri: image2,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    if (image3) {
      const uriPart = image3.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("image3", {
        uri: image3,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    fetch(API_URI + "/api/order_store", {
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
          dispatch({ type: "OrderStoreSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "OrderStoreFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "OrderStoreFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetMyOrder = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "GetMyOrderHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);

    fetch(API_URI + "/api/get_my_orders", {
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
          dispatch({ type: "GetMyOrderSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetMyOrderFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetMyOrderFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetOffersOrder = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetOffersOrderHandle" });
    const formData = new FormData();

    formData.append("order_id", id);

    fetch(API_URI + "/api/get_offers_orders", {
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
          dispatch({ type: "GetOffersOrderSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetOffersOrderFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetOffersOrderFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const AcceptOrders = (
  order_id,
  user_id_offers,
  price,
  type,
  name_cart,
  name_number,
  expire,
  payment_id
) => {
  return (dispatch) => {
    dispatch({ type: "AcceptOrdersHandle" });
    const formData = new FormData();

    formData.append("order_id", order_id);
    formData.append("user_id_offers", user_id_offers);
    formData.append("price", price);
    formData.append("payment_type", type);
    formData.append("name_card", name_cart);
    formData.append("card_number", name_number);
    formData.append("expiry_date", expire);
    formData.append("payment_id", payment_id);

    fetch(API_URI + "/api/accept_offers", {
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
          dispatch({ type: "AcceptOrdersSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "AcceptOrdersFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "AcceptOrdersFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetOrderChat = (id_order) => {
  return (dispatch) => {
    dispatch({ type: "GetOrderChatHandle" });
    const formData = new FormData();

    formData.append("id_order", id_order);

    fetch(API_URI + "/api/get_order_chat", {
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
          dispatch({
            type: "GetOrderChatSuccess",
            data: responseJson.data,
            msg: responseJson.msg,
          });
        } else {
          dispatch({ type: "GetOrderChatFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetOrderChatFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const StoreChat = (
  sender_id,
  recived_id,
  message_id,
  text_message,
  image,
  file
) => {
  return (dispatch) => {
    dispatch({ type: "StoreChatHandle" });
    const formData = new FormData();

    formData.append("sender_id", sender_id);
    formData.append("recived_id", recived_id);
    formData.append("message_id", message_id);
    formData.append("text_message", text_message);

    if (image) {
      const uriPart = image.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("image", {
        uri: image,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    if (file) {
      const uriPart = file.split(".");
      const fileExtension = uriPart[uriPart.length - 1];

      formData.append("file", {
        uri: file,
        name: `photo.${fileExtension}`,
        type: `image/${fileExtension}`,
      });
    }

    fetch(API_URI + "/api/store_chat", {
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
          dispatch({ type: "StoreChatSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "StoreChatFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "StoreChatFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const CompleteOrder = (id_order, rating) => {
  return (dispatch) => {
    dispatch({ type: "CompleteOrderHandle" });
    const formData = new FormData();

    formData.append("id_order", id_order);
    formData.append("rating", rating);

    fetch(API_URI + "/api/complete_orders", {
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
          dispatch({ type: "CompleteOrderSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "CompleteOrderFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "CompleteOrderFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const LastOrderProvider = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "LastOrderProviderHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);

    fetch(API_URI + "/api/last_order_provider", {
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
          dispatch({
            type: "LastOrderProviderSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "LastOrderProviderFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LastOrderProviderFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const AddOffer = (user_id, order_id, price) => {
  return (dispatch) => {
    dispatch({ type: "AddOffersHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("order_id", order_id);
    formData.append("price", price);

    fetch(API_URI + "/api/add_offers", {
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
          dispatch({ type: "AddOffersSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "AddOffersFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "AddOffersFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const MyOffersProvider = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "MyOffersProviderHandle" });
    const formData = new FormData();

    formData.append("user_id", user_id);

    fetch(API_URI + "/api/my_offers", {
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
          dispatch({
            type: "MyOffersProviderSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "MyOffersProviderFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "MyOffersProviderFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
