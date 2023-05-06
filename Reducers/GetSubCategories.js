const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetSubCategoriesHandle':
            return {loading:true}
        case 'GetSubCategoriesSuccess':
            return {data:action.data,loading:false,}
        case 'GetSubCategoriesFaild':
            return {loading:false}
        default:
            return state;
    }
}