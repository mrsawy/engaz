const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetCategoriesRandomHandle':
            return {loading:true}
        case 'GetCategoriesRandomSuccess':
            return {data:action.data,loading:false,}
        case 'GetCategoriesRandomFaild':
            return {loading:false}
        default:
            return state;
    }
}