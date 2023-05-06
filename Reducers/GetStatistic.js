const INISIAL_STATE = {loading:false,Orders:null,Offers:null,Wallet:null,MainCategories:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetStatisticHandle':
            return {loading:true}
        case 'GetStatisticSuccess':
            return {Orders:action.Orders,loading:false,Offers:action.Offers,Wallet:action.Wallet,MainCategories:action.MainCategories}
        case 'GetStatisticFaild':
            return {loading:false}
        default:
            return state;
    }
}