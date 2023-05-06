const INISIAL_STATE = {loading:false,data:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'CountNotificationHandle':
            return {loading:true}
        case 'CountNotificationSuccess':
            return { loading:false , data:action.data }
        case 'CountNotificationFaild':
            return { loading:false , data:0 }
        default:
            return state;
    }
}