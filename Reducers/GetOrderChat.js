const INISIAL_STATE = {loading:false,data:null,msg:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetOrderChatHandle':
            return {loading:true}
        case 'GetOrderChatSuccess':
            return {data:action.data,loading:false,msg:action.msg}
        case 'GetOrderChatFaild':
            return {loading:false}
        default:
            return state;
    }
}