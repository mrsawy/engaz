const INISIAL_STATE = {loading:false,user:null,token:null,error:null,data_ban:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'LoginAuthHandle':
            return {loading:true}
        case 'LoginAuthSuccess':
            return {loading:false,user:action.user,token:action.token,}
        case 'LoginAuthFaild':
            return {loading:false,error:action.error}
        case 'LoginAuthFaildBan':
            return {loading:false,data_ban:action.data_ban}
            
        default:
            return state;
    }
}