const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetWalletLogHandle':
            return {loading:true}
        case 'GetWalletLogSuccess':
            return {data:action.data,loading:false,}
        case 'GetWalletLogFaild':
            return {loading:false}
        default:
            return state;
    }
}