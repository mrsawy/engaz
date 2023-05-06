const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'PrivacyHandle':
            return {loading:true}
        case 'PrivacySuccess':
            return {data:action.data,loading:false,}
        case 'PrivacyFaild':
            return {loading:false}
        default:
            return state;
    }
}