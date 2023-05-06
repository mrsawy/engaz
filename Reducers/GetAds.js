const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetAdsHandle':
            return {loading:true}
        case 'GetAdsSuccess':
            return {data:action.data,loading:false,}
        case 'GetAdsFaild':
            return {loading:false}
        default:
            return state;
    }
}