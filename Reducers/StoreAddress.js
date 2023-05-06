const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'StoreAddressHandle':
            return {loading:true}
        case 'StoreAddressSuccess':
            return {data:action.data,loading:false,}
        case 'StoreAddressFaild':
            return {loading:false}
        default:
            return state;
    }
}