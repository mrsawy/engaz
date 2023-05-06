const INISIAL_STATE = {loading:false,Language:null,}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'CheckLanguageHandle':
            return {loading:true}
        case 'CheckLanguageAR':
            return {Language:action.Language,loading:false,}
        case 'CheckLanguagEN':
            return {Language:action.Language,loading:false}
        default:
            return state;
    }
}