const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'AcceptOrdersHandle':
            return {loading:true}
        case 'AcceptOrdersSuccess':
            return {data:action.data,loading:false,}
        case 'AcceptOrdersFaild':
            return {loading:false}
        default:
            return state;
    }
}