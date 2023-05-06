const INISIAL_STATE = {loading:false,data:null,errorServer:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetNotificationHandle':
            return {loading:true}
        case 'GetNotificationSuccess':
            return { loading:false , data:action.data }
        case 'GetNotificationFaild':
            return { loading:false }
        case 'GetNotificationFaildServer':
            return { loading:false  }
        default:
            return state;
    }
}