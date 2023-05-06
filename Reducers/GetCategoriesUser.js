const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetCategoriesUserHandle':
            return {loading:true}
        case 'GetCategoriesUserSuccess':
            return {data:action.data,loading:false,}
        case 'GetCategoriesUserFaild':
            return {loading:false}
        default:
            return state;
    }
}