const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'TermHandle':
            return {loading:true}
        case 'TermSuccess':
            return {data:action.data,loading:false,}
        case 'TermFaild':
            return {loading:false}
        default:
            return state;
    }
}