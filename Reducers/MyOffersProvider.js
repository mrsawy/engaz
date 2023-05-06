const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'MyOffersProviderHandle':
            return {loading:true}
        case 'MyOffersProviderSuccess':
            return {data:action.data,loading:false,}
        case 'MyOffersProviderFaild':
            return {loading:false}
        default:
            return state;
    }
}