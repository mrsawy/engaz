const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'StoreChatHandle':
            return {loading:true}
        case 'StoreChatSuccess':
            return {data:action.data,loading:false,}
        case 'StoreChatFaild':
            return {loading:false}
        default:
            return state;
    }
}