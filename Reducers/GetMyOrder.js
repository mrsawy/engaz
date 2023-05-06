const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetMyOrderHandle':
            return {loading:true}
        case 'GetMyOrderSuccess':
            return {data:action.data,loading:false,}
        case 'GetMyOrderFaild':
            return {loading:false}
        default:
            return state;
    }
}