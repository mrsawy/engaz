const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'CompleteOrderHandle':
            return {loading:true}
        case 'CompleteOrderSuccess':
            return {data:action.data,loading:false,}
        case 'CompleteOrderFaild':
            return {loading:false}
        default:
            return state;
    }
}