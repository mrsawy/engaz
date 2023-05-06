const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'LastOrderProviderHandle':
            return {loading:true}
        case 'LastOrderProviderSuccess':
            return {data:action.data,loading:false,}
        case 'LastOrderProviderFaild':
            return {loading:false}
        default:
            return state;
    }
}