const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetGovernorateHandle':
            return {loading:true}
        case 'GetGovernorateSuccess':
            return {data:action.data,loading:false,}
        case 'GetGovernorateFaild':
            return {loading:false}
        default:
            return state;
    }
}