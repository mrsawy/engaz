const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'AddOffersHandle':
            return {loading:true}
        case 'AddOffersSuccess':
            return {data:action.data,loading:false,}
        case 'AddOffersFaild':
            return {loading:false}
        default:
            return state;
    }
}