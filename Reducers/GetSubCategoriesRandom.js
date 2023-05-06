const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetSubCategoriesRandomHandle':
            return {loading:true}
        case 'GetSubCategoriesRandomSuccess':
            return {data:action.data,loading:false,}
        case 'GetSubCategoriesRandomFaild':
            return {loading:false}
        default:
            return state;
    }
}