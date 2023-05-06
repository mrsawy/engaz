import { AsyncStorage } from "react-native";
import { Updates } from "expo";

export const CheckUserLogin = () => {
  return async (dispatch) => {
    dispatch({ type: "CheckUserLoginHandle" });

    var id_user = await AsyncStorage.getItem("id_user");
    var name = await AsyncStorage.getItem("name");
    var photo = await AsyncStorage.getItem("photo");
    var cover = await AsyncStorage.getItem("cover");
    var mobile = await AsyncStorage.getItem("mobile");
    var email = await AsyncStorage.getItem("email");
    var city = await AsyncStorage.getItem("city");
    var governorate = await AsyncStorage.getItem("governorate");
    var Language = await AsyncStorage.getItem("Language");
    var type = await AsyncStorage.getItem("type");

    if (id_user) {
      dispatch({
        type: "CheckUserLoginSucsses",
        is_login: true,
        name: name,
        image: photo,
        cover: cover,
        mobile: mobile,
        email: email,
        city: city,
        governorate: governorate,
        Language: Language,
      });
    } else {
      dispatch({
        type: "CheckUserLoginails",
        is_login: false,
        Language: Language,
      });
    }
  };
};

export const CheckLanguage = () => {
  return async (dispatch) => {
    dispatch({ type: "CheckLanguageHandle" });
    var Language = await AsyncStorage.getItem("Language");
    if (Language == "ar") {
      dispatch({ type: "CheckLanguageAR", Language: "ar" });
    } else {
      dispatch({ type: "CheckLanguagEN", Language: "en" });
    }
  };
};

// export const ChangeLanguage = () => {
//     return async (dispatch) => {
//         dispatch({type : 'ChangeLanguageHandle'});
//         var Language = await AsyncStorage.getItem('Language');
//         if(Language == 'en'){
//             await AsyncStorage.setItem('Language', 'ar')
//
//             Updates.reload();
//         }else{
//             AsyncStorage.setItem('Language', 'en')
//
//             Updates.reload();
//         }
//     }
// }

// export const CheckUserBlock = (id) => {

//     return (dispatch) => {
//         dispatch({type : 'CheckUserBlockHandle'});

//         fetch('http://coigroup.net/api/check_user_block', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             id: id,
//         })

//         })
//         .then((response) => response.json())
//         .then((responseJson) => {
//
//             if(responseJson.success == 'true'){
//                     dispatch({type : 'CheckUserBlockSuccess',data:'العضويةغير محظورة' });
//             }else{
//                 dispatch({type : 'CheckUserBlockFaild',data_false:'العضوية محظورة'})
//             }

//         })
//         .catch((error) => {
//             dispatch({type : 'CheckUserBlockFaildServer',errorServer:'مشكلة بالاتصال , جاري العمل على حل المشكلة'})
//         });

//     }
// }
