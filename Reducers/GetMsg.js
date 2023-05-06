const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetMsgHandle':
            return {loading:true}
        case 'GetMsgSuccess':
            return {data:action.data,loading:false,}
        case 'GetMsgFaild':
            return {loading:false}
        default:
            return state;
    }
}