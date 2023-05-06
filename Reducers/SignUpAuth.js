const INISIAL_STATE = {data : null, loading : false, token :null , 
    false_name:null,false_phone:null,false_password:null,false_city:null,false_email:null,false_governorate:null,
}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'SignUpHandle':
            return {loading:true}
        case 'SignUpSuccess':
                    return { loading:false , data:action.data , token:action.token }
        case 'SignUpFaild':
            return { loading:false , 
                false_name:action.false_name,false_phone:action.false_phone,false_password:action.false_password
                ,false_city:action.false_city,false_email:action.false_email,false_governorate:action.false_governorate
            }
        case 'SignUpFaildServer':
            return { loading:false }
        default:
            return state;
    }
}