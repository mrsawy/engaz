import React from 'react';
import {  Text, View ,Platform} from 'react-native';
import { Icon  } from 'react-native-elements';
import { connect } from 'react-redux';
import {ChangeLanguage} from '../Actions';

 class ChangeLang extends React.Component {

    UNSAFE_componentWillMount(){
        this.props.ChangeLanguage()
    }

  
      render() {

        return (
            <View style={{flex:1}}>
             
            </View>
        );
      }
    }


    const mapStateToProps = (state) => {
      return {

    }
    };
  
  export default connect(mapStateToProps, {ChangeLanguage})(ChangeLang);

