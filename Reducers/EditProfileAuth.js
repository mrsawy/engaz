const INISIAL_STATE = {data : null, loading : false, token :null , 
    false_name:null,false_phone:null,false_email:null,false_image:null

}

export default (state = INISIAL_STATE , action) => {
    switch(action.type){
        case 'EditProfileHandle':
            return {loading:true}
        case 'EditProfileSuccess':
                    return { loading:false , data:action.data , token:action.token }
        case 'EditProfileFaild':
            return { loading:false , 
                false_name:action.false_name,false_phone:action.false_phone,
                false_email:action.false_email,false_password:action.false_password,
                false_image:action.false_image
            }
        default:
            return state;
    }
}