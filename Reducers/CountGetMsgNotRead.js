const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'CountGetMsgNotReadHandle':
            return {loading:true}
        case 'CountGetMsgNotReadSuccess':
            return {data:action.data,loading:false,}
        case 'CountGetMsgNotReadFaild':
            return {loading:false}
        default:
            return state;
    }
}