import React from 'react';
import {  Text, View ,TouchableOpacity} from 'react-native';
import { Icon  } from 'react-native-elements';
import { connect } from 'react-redux';

 class CartIcon extends React.Component {

    
      render() {

        return (
          <View style={{ position: 'absolute',backgroundColor:'#D3A257',borderColor:'#2A2A2A',borderWidth:5,
          bottom: 0,height:60,width:60,borderRadius:60/2}}>
                <View 
                style={{height:'100%',overflow:'hidden',borderRadius:60/2,paddingTop:9}}  >
                    <Icon name='plus' type='feather' size={30} color={'#fff'} />
                </View>
          </View>
        );
      }
    }


    const mapStateToProps = (state) => {
      return {

      }
    };
  
  export default connect(mapStateToProps, {})(CartIcon);

