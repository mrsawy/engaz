const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetWalletHandle':
            return {loading:true}
        case 'GetWalletSuccess':
            return {data:action.data,loading:false,}
        case 'GetWalletFaild':
            return {loading:false}
        default:
            return state;
    }
}