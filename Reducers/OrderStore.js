const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'OrderStoreHandle':
            return {loading:true}
        case 'OrderStoreSuccess':
            return {data:action.data,loading:false,}
        case 'OrderStoreFaild':
            return {loading:false}
        default:
            return state;
    }
}