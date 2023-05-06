import { API_URI } from "../constants";
export const GetCategories = () => {
  return (dispatch) => {
    dispatch({ type: "GetCategoriesHandle" });

    fetch(API_URI + "/api/get_categories", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "GetCategoriesSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetCategoriesFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetCategoriesFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetCategoriesUser = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetCategoriesUserHandle" });

    const formData = new FormData();
    formData.append("id", id);

    fetch(API_URI + "/api/get_cat_user", {
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
            type: "GetCategoriesUserSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "GetCategoriesUserFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetCategoriesUserFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetCategoriesRandom = () => {
  return (dispatch) => {
    dispatch({ type: "GetCategoriesRandomHandle" });

    fetch(API_URI + "/api/get_categories_random", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({
            type: "GetCategoriesRandomSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "GetCategoriesRandomFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetCategoriesRandomFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetSubCategoriesRandom = () => {
  return (dispatch) => {
    dispatch({ type: "GetSubCategoriesRandomHandle" });

    fetch(API_URI + "/api/get_sub_categories_random", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({
            type: "GetSubCategoriesRandomSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "GetSubCategoriesRandomFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetSubCategoriesRandomFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetSubCategories = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetSubCategoriesHandle" });
    const formData = new FormData();
    formData.append("id", id);

    fetch(API_URI + "/api/get_sub_categories", {
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
            type: "GetSubCategoriesSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "GetSubCategoriesFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetSubCategoriesFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetCity = () => {
  return (dispatch) => {
    dispatch({ type: "GetCityHandle" });

    fetch(API_URI + "/api/get_city", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "GetCitySuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetCityFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetCityFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetGovernorate = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetGovernorateHandle" });

    const formData = new FormData();
    formData.append("id", id);

    fetch(API_URI + "/api/get_governorate", {
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
          dispatch({ type: "GetGovernorateSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetGovernorateFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetGovernorateFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetAds = () => {
  return (dispatch) => {
    dispatch({ type: "GetAdsHandle" });

    fetch(API_URI + "/api/get_ads", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "GetAdsSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetAdsFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetAdsFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const Term = () => {
  return (dispatch) => {
    dispatch({ type: "TermHandle" });

    fetch(API_URI + "/api/term", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "TermSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "TermFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "TermFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const Privacy = () => {
  return (dispatch) => {
    dispatch({ type: "PrivacyHandle" });

    fetch(API_URI + "/api/privacy", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "PrivacySuccess", data: responseJson.data });
        } else {
          dispatch({ type: "PrivacyFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "PrivacyFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetHelp = (id, title, description) => {
  return (dispatch) => {
    dispatch({ type: "HelpHandle" });

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("description", description);

    fetch(API_URI + "/api/help", {
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
          dispatch({ type: "HelpSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "HelpFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "HelpFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetAbout = () => {
  return (dispatch) => {
    dispatch({ type: "GetAboutHandle" });

    fetch(API_URI + "/api/about", {
      method: "Get",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({
            type: "GetAboutSuccess",
            data: responseJson.data,
            socail: responseJson.socail,
          });
        } else {
          dispatch({ type: "GetAboutFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetAboutFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetStatistic = (user_id) => {
  return (dispatch) => {
    dispatch({ type: "GetStatisticHandle" });

    const formData = new FormData();
    formData.append("user_id", user_id);

    fetch(API_URI + "/api/get_statistic", {
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
            type: "GetStatisticSuccess",
            Orders: responseJson.Orders,
            Offers: responseJson.Offers,
            Wallet: responseJson.Wallet,
            MainCategories: responseJson.MainCategories,
          });
        } else {
          dispatch({ type: "GetStatisticFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetStatisticFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetNotificationFun = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetNotificationHandle" });

    fetch(API_URI + "/api/get_notification_mobile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({ type: "GetNotificationSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetNotificationFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetNotificationFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const ReadNotificationFun = (id) => {
  return (dispatch) => {
    dispatch({ type: "ReadNotificationHandle" });

    fetch(API_URI + "/api/read_notification", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({
            type: "ReadNotificationSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "ReadNotificationFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LoginFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const CountNotificationFun = (id) => {
  return (dispatch) => {
    dispatch({ type: "CountNotificationHandle" });

    fetch(API_URI + "/api/get_notification_mobile_not_read", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({
            type: "CountNotificationSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "CountNotificationFaild", data: 0 });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LoginFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetMsg = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetMsgHandle" });

    fetch(API_URI + "/api/get_msg", {
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
        if (responseJson.status == "true") {
          dispatch({ type: "GetMsgSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetMsgFaild", data: 0 });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetMsgFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const GetChat = (id) => {
  return (dispatch) => {
    dispatch({ type: "GetChatHandle" });

    fetch(API_URI + "/api/get_chat", {
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
        if (responseJson.status == "true") {
          dispatch({ type: "GetChatSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "GetChatFaild", data: 0 });
        }
      })
      .catch((error) => {
        dispatch({
          type: "GetChatFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const Chating = (sender_user_id, receiver_user_id) => {
  return (dispatch) => {
    dispatch({ type: "ChatingHandle" });

    fetch(API_URI + "/api/chating", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_user_id: sender_user_id,
        receiver_user_id: receiver_user_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "true") {
          dispatch({ type: "ChatingSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "ChatingFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "ChatingFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const MsgToRead = (id) => {
  return (dispatch) => {
    dispatch({ type: "MsgToReadHandle" });

    fetch(API_URI + "/api/msg_to_read", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({ type: "MsgToReadSuccess", data: responseJson.data });
        } else {
          dispatch({ type: "MsgToReadFaild" });
        }
      })
      .catch((error) => {
        dispatch({
          type: "MsgToReadFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};

export const CountGetMsgNotRead = (id) => {
  return (dispatch) => {
    dispatch({ type: "CountGetMsgNotReadHandle" });

    fetch(API_URI + "/api/get_msg_not_read", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success == "true") {
          dispatch({
            type: "CountGetMsgNotReadSuccess",
            data: responseJson.data,
          });
        } else {
          dispatch({ type: "CountGetMsgNotReadFaild", data: 0 });
        }
      })
      .catch((error) => {
        dispatch({
          type: "CountGetMsgNotReadFaildServer",
          errorServer: "مشكلة بالاتصال , جاري العمل على حل المشكلة",
        });
      });
  };
};
