const INISIAL_STATE = {loading:false,data:null,socail:null}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'GetAboutHandle':
            return {loading:true}
        case 'GetAboutSuccess':
            return {data:action.data,loading:false,socail:action.socail}
        case 'GetAboutFaild':
            return {loading:false}
        default:
            return state;
    }
}