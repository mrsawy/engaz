const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetOffersOrderHandle':
            return {loading:true}
        case 'GetOffersOrderSuccess':
            return {data:action.data,loading:false,}
        case 'GetOffersOrderFaild':
            return {loading:false}
        default:
            return state;
    }
}