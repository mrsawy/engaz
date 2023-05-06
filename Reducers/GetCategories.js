const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetCategoriesHandle':
            return {loading:true}
        case 'GetCategoriesSuccess':
            return {data:action.data,loading:false,}
        case 'GetCategoriesFaild':
            return {loading:false}
        default:
            return state;
    }
}