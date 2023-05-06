const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetCityHandle':
            return {loading:true}
        case 'GetCitySuccess':
            return {data:action.data,loading:false,}
        case 'GetCityFaild':
            return {loading:false}
        default:
            return state;
    }
}