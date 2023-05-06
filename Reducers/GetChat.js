const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetChatHandle':
            return {loading:true}
        case 'GetChatSuccess':
            return {data:action.data,loading:false,}
        case 'GetChatFaild':
            return {loading:false}
        default:
            return state;
    }
}