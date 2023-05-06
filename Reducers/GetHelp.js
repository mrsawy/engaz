const INISIAL_STATE = {loading:false,data:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'HelpHandle':
            return {loading:true}
        case 'HelpSuccess':
            return {data:action.data,loading:false,}
        case 'HelpFaild':
            return {loading:false}
        default:
            return state;
    }
}