const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetAddressHandle':
            return {loading:true}
        case 'GetAddressSuccess':
            return {data:action.data,loading:false,}
        case 'GetAddressFaild':
            return {loading:false}
        default:
            return state;
    }
}