const INISIAL_STATE = {loading:false,is_login:null,name:null,image:null,cover:null,mobile:null,email:null,city:null,governorate:null,Language:null,type:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'CheckUserLoginHandle':
            return {loading:true}
        case 'CheckUserLoginSucsses':
            return {is_login:true,loading:false,name:action.name,image:action.image,cover:action.cover,mobile:action.mobile,email:action.email,city:action.city,governorate:action.governorate,Language:action.Language,type:action.type}
        case 'CheckUserLoginails':
            return {is_login:false,loading:false}
        default:
            return state;
    }
}