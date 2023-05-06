import React from 'react';
import { StyleSheet, Text,AppState, View ,ScrollView ,Vibration,AsyncStorage,ImageBackground ,FlatList,TouchableOpacity,SafeAreaView,StatusBar, ActivityIndicator,Dimensions,Platform, Alert } from 'react-native';
import * as Font from 'expo-font';
import { Icon ,Image ,Header,Divider,Input } from 'react-native-elements';
import {Notifications} from 'expo';
import { connect } from 'react-redux';
import {CheckUserLogin,Privacy,Term} from '../../Actions';
import i18n from '../../Language';
import { FontAwesome ,MaterialCommunityIcons ,Fontisto,Entypo ,FontAwesome5,Feather,MaterialIcons,Ionicons} from '@expo/vector-icons'; 

 class TermAndPrivecy extends React.Component {
      
      constructor(props) {
        super(props);
        
        this.state = {
          fontLoaded: false,
          selected:'TermAndConditions'
         
  
        };

        
      }

      
    
      async LoadFontAsync() {
        await Font.loadAsync({
            'BOLD': require('../../Fonts/NeoSansArabicBold.ttf'),
            'Medium': require('../../Fonts/NeoSansArabic.ttf'),
          });
    
        this.setState({ fontLoaded: true });
      }

   
     
      async UNSAFE_componentWillMount(){
        AsyncStorage.getItem('Language').then((Language) => {
          i18n.locale = Language;
          this.setState({ localLang: Language });
        });

        const id_user = await AsyncStorage.getItem('id_user');
      }



      

      componentDidMount() {
        this.LoadFontAsync();
        this.props.Term()
        this.props.Privacy()
       

      }

      ChangeState(val){
        this.setState({ selected: val });
      }


   


      Trem(){
        if(this.props.loading){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25}}>
                  <ActivityIndicator size="small" color="#454545" />
            </View>
          )
        }
  
        if(this.props.data){
          return(
            <View>
            <Text style={{textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily: 'BOLD',fontSize:16,color:'#2a2a2a',marginTop:0}}>{this.props.Language == 'ar' ? this.props.data.title_ar:this.props.data.title_en}</Text>
            <Text style={{textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily: 'Medium',fontSize:15,color:'#2a2a2a',marginTop:8,lineHeight:20}}>
              {this.props.Language == 'ar' ? this.props.data.description_ar:this.props.data.description_en}
            </Text>
            </View>
          )
        }
  
        if(!this.props.data){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25}}>
                <Icon name='exclamation-circle' type='font-awesome' size={60} color={'#cfcfcf'} iconStyle={{marginBottom:5}} />
                <Text style={{fontFamily:'BOLD',fontSize:18,color:'#969696'}}>{i18n.t('no_order')}</Text>
            </View>
          )
        }
      }



      Privacy(){
        if(this.props.loading_p){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25}}>
                  <ActivityIndicator size="small" color="#454545" />
            </View>
          )
        }
  
        if(this.props.data_p){
          return(
            <View>
            <Text style={{textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily: 'BOLD',fontSize:16,color:'#2a2a2a',marginTop:0}}>{this.props.Language == 'ar' ? this.props.data_p.title_ar:this.props.data_p.title_en}</Text>
            <Text style={{textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily: 'Medium',fontSize:15,color:'#2a2a2a',marginTop:8,lineHeight:20}}>
            {this.props.Language == 'ar' ? this.props.data_p.description_ar:this.props.data_p.description_en}
            </Text>
            </View>
          )
        }
  
        if(!this.props.data_p){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25}}>
                <Icon name='exclamation-circle' type='font-awesome' size={60} color={'#cfcfcf'} iconStyle={{marginBottom:5}} />
                <Text style={{fontFamily:'BOLD',fontSize:18,color:'#969696'}}>{i18n.t('no_order')}</Text>
            </View>
          )
        }
      }
      

      render() {


        if(!this.state.fontLoaded){
          return (
              <View />
          );  
          }


        return (
            <View style={[styles.container]}>
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
              <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:13,color:'#fff',marginTop:2}}>{i18n.t('user_policy')}</Text>
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
          <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:13,color:'#fff',marginTop:2}}>{i18n.t('user_policy')}</Text>
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

                <View style={{margin:15,borderColor:'#ccc',borderWidth:1,flexDirection:'row-reverse',borderRadius:10}}>
                  <TouchableOpacity style={{flex:1,padding:12,borderTopRightRadius:10,borderBottomRightRadius:10,backgroundColor:this.state.selected == 'TermAndConditions' ? '#2a2a2a':'#eee'}} onPress={()=>this.ChangeState('TermAndConditions')}>
                  <Text style={{textAlign:'center',fontFamily: this.state.selected == 'TermAndConditions' ? 'BOLD':'Medium',fontSize:13,color:this.state.selected == 'TermAndConditions' ? '#fff':'#2a2a2a',marginTop:4}}>{i18n.t('conditions')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={{flex:1,padding:12,borderBottomLeftRadius:10,borderTopLeftRadius:10,backgroundColor:this.state.selected == 'PrivacyPolicy' ? '#2a2a2a':'#eee'}} onPress={()=>this.ChangeState('PrivacyPolicy')}>
                  <Text style={{textAlign:'center',fontFamily: this.state.selected == 'PrivacyPolicy' ? 'BOLD':'Medium',fontSize:13,color:this.state.selected == 'PrivacyPolicy' ? '#fff':'#2a2a2a',marginTop:4}}>{i18n.t('user_policyy')}</Text>
                  </TouchableOpacity>
                </View>


                {this.state.selected == 'TermAndConditions' ? 

                <View style={{margin:20}}>
                {this.Trem()}
                </View>

                :

                <View style={{margin:20}}>
                {this.Privacy()}
                </View>

                }

                </ScrollView>



                  

            </View>

        );
      }
    }



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    input:{
      marginBottom:10,
      marginLeft:10,
      marginRight:10,
      height:50,
      paddingRight:20,
      borderRadius:30,
      borderColor:'#d8d8d8',
      borderWidth:1,
      backgroundColor:'#fff'
    },
    btn:{
      borderRadius:30,
      height:50,
      justifyContent:'center',
      marginTop:0,
      marginLeft:10,
      marginRight:10,
    
    },
    header:{
        flex:1,
        borderBottomWidth:1,
        borderBottomColor:'#e1e1e1',
        paddingBottom:10,
        marginRight:15,
        marginLeft:15,
        padding:5,
        flexDirection:'row'
    },
    headerText:{
        textAlign:'left',
        fontFamily:'BOLD',
        fontSize:16,
    },
    contentText:{
        textAlign:'left',
        fontFamily:'Medium',
        fontSize:15,
    },
    content:{
        flex:1,
        backgroundColor:'#fff',
        padding:10,
        marginRight:15,
        marginLeft:15,
        marginBottom:10,
    }
   
  });


  const mapStateToProps = (state) => {
    return {
      data:state.Term.data,
      loading:state.Term.loading,

      data_p:state.Privacy.data,
      loading_p:state.Privacy.loading,

      data_count_notification: state.CountNotification.data,
      data_count_msg: state.CountGetMsgNotRead.data,

      Language: state.ChecLanguage.Language,

    }
  };



export default connect(mapStateToProps, {CheckUserLogin,Privacy,Term})(TermAndPrivecy);