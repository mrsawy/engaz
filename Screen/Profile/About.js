import React from 'react';
import { StyleSheet, Text,Image, View ,ScrollView ,TextInput,AsyncStorage,ActivityIndicator,TouchableOpacity,Linking,StatusBar,Alert,KeyboardAvoidingView} from 'react-native';
import * as Font from 'expo-font';
import { Icon ,Input,Header,Divider } from 'react-native-elements';
import i18n from '../../Language';
import { connect } from 'react-redux';
import {GetAbout} from '../../Actions';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome } from '@expo/vector-icons'; 

 class About extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false,
          refreshing:false,
        
        };
        
      }

      async UNSAFE_componentWillMount(){

        AsyncStorage.getItem('Language').then((Language) => {
          i18n.locale = Language;
          this.setState({ localLang: Language });
        });

        


      }

      async LoadFontAsync() {
        await Font.loadAsync({
          'BOLD': require('../../Fonts/NeoSansArabicBold.ttf'),
          'Medium': require('../../Fonts/NeoSansArabic.ttf'),
        });
    
        this.setState({ fontLoaded: true });
      }



      componentDidMount() {
        this.LoadFontAsync();
      }

      render() {

        return(
          <View style={styles.container}>
           
            <StatusBar translucent={true}  barStyle="light-content" backgroundColor={'#2A2A2A'} />

            {this.props.Language == 'ar' ? 
            <Header backgroundColor={'#2A2A2A'} containerStyle={{borderBottomWidth:0}}>
             <View style={{flexDirection:'row'}}>
             <TouchableOpacity onPress={()=> this.props.navigation.navigate('Notification')} style={{width:40,}}>
                <Icon name='bell' type='font-awesome' size={17} color={'#D3A257'} />
                {this.props.data_count_notification > 0 ?
                          <View style={{position:'absolute',left:20 ,justifyContent:'center',
                                top:-3, width:12,height:12,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                          </View> : null }
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Messages')} style={{width:35,marginLeft:5}}>
                <MaterialCommunityIcons name="comment" size={20} color="#D3A257" />
                {this.props.data_count_msg > 0 ?
                          <View style={{position:'absolute',left:17 ,justifyContent:'center',
                                top:-3, width:12,height:12,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                          </View> : null }
            </TouchableOpacity>
             </View>
            <View style={{justifyContent:'center',flex:1,}}>
              <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('about')}</Text>
            </View>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{marginLeft:10}}>
          <MaterialCommunityIcons name={this.props.Language == 'ar' ? "arrow-right":'arrow-left'} size={22} color="#fff" />
          </TouchableOpacity>
          </Header> 
          : 
          <Header backgroundColor={'#2A2A2A'} containerStyle={{borderBottomWidth:0}}>
          
          
          <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{marginLeft:10}}>
          <MaterialCommunityIcons name={this.props.Language == 'ar' ? "arrow-right":'arrow-left'} size={22} color="#fff" />
          </TouchableOpacity>

          <View style={{justifyContent:'center',flex:1,}}>
          <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('about')}</Text>
          </View>
          
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Notification')} style={{width:40,}}>
            <Icon name='bell' type='font-awesome' size={17} color={'#D3A257'} />
            {this.props.data_count_notification > 0 ?
                          <View style={{position:'absolute',left:20 ,justifyContent:'center',
                                top:-3, width:12,height:12,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                          </View> : null }
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Messages')} style={{width:35,marginLeft:5}}>
            <MaterialCommunityIcons name="comment" size={20} color="#D3A257" />
            {/* <View style={{position:'absolute',left:17 ,justifyContent:'center',
                top:-3, width:10,height:10,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
            </View> */}
          </TouchableOpacity>
          </View>

          </Header>
          }


            <ScrollView>

                <View style={{margin:15}}>

                <View style={{width:100,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:15,backgroundColor:'#fff',height:100,borderColor:'#ccc',borderWidth:1,borderRadius:16,}}>
                    <Image source={require('../../assets/logo.png')}  style={{overflow:'hidden',width:80,height:80,}} />
                </View>

                <Text style={{textAlign:'center',fontFamily: 'BOLD',fontSize:25,color:'#2a2a2a',marginTop:20}}>خدمة . com</Text>

                {this.props.data ? 
                <Text style={{textAlign:'center',fontFamily: 'REGULAR',fontSize:16,color:'#2a2a2a',marginTop:10,marginLeft:30,marginRight:30}}>
                    {this.props.Language == 'ar' ? this.props.data.abouts_description_ar:this.props.data.abouts_description_en}
                </Text> 
                : 
                <ActivityIndicator size="small" color="#454545" />
                  }
                
                {this.props.socail ? 
                <View style={{flexDirection:'row',marginRight:50,marginLeft:50,marginTop:20,marginBottom:30,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=> Linking.openURL(this.props.socail.facebook)} style={{height:35,width:35,backgroundColor:'#2a2a2a',borderRadius:20,justifyContent:'center',alignItems:'center',}}>
                        <FontAwesome name="facebook" size={17} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> Linking.openURL(this.props.socail.instagram)} style={{height:35,width:35,backgroundColor:'#2a2a2a',borderRadius:20,justifyContent:'center',alignItems:'center',marginLeft:5}}>
                        <FontAwesome name="instagram" size={17} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> Linking.openURL(this.props.socail.youtube)} style={{height:35,width:35,backgroundColor:'#2a2a2a',borderRadius:20,justifyContent:'center',alignItems:'center',marginLeft:5}}>
                        <FontAwesome5 name="youtube" size={17} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> Linking.openURL(this.props.socail.twitter)} style={{height:35,width:35,backgroundColor:'#2a2a2a',borderRadius:20,justifyContent:'center',alignItems:'center',marginLeft:5}}>
                        <FontAwesome name="twitter" size={17} color="#fff" />
                    </TouchableOpacity>
                </View>
                  : 
                  null
                    }
              
                    
                </View>



            </ScrollView>



     

          </View>
        );

      }
    }



const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input:{
        marginBottom:10,
        marginLeft:0,
        marginRight:0,
        padding:8,
        paddingRight:20,
        borderRadius:10,
        borderBottomWidth:0,
        backgroundColor:'#eee'
    },
    btn:{
      borderRadius:30,
      height:55,
      justifyContent:'center',
      marginLeft:5,
      marginRight:5,
      marginBottom:10,
      backgroundColor:'#2A2A2A',
      marginTop:15,
      flex:1
    
    }
   
  });


  
  const mapStateToProps = (state) => {
    return {

        
        Language: state.ChecLanguage.Language,
        data_count_notification: state.CountNotification.data,

        loading: state.GetAbout.loading,
        data: state.GetAbout.data,
        socail: state.GetAbout.socail,

        data_count_msg: state.CountGetMsgNotRead.data,

      }
  };



export default connect(mapStateToProps, {GetAbout})(About);