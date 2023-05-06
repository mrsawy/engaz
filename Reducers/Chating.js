const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'ChatingHandle':
            return {loading:true}
        case 'ChatingSuccess':
            return {data:action.data,loading:false,}
        case 'ChatingFaild':
            return {loading:false}
        default:
            return state;
    }
}