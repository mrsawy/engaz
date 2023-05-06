import React from 'react';
import { StyleSheet, Text,Image, View ,ScrollView ,Linking,AsyncStorage,ActivityIndicator,TouchableOpacity,FlatList,StatusBar,Alert,RefreshControl} from 'react-native';
import * as Font from 'expo-font';
import { Icon ,Input,Header,Divider } from 'react-native-elements';
import i18n from '../../Language';
import { connect } from 'react-redux';
import {GetCategories,GetAddress} from '../../Actions';
import { MaterialCommunityIcons , Entypo } from '@expo/vector-icons'; 



 class Services extends React.Component {

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

        var id_user = await AsyncStorage.getItem('id_user');
        this.props.GetAddress(id_user);


      }


      _onRefresh = async () => {
        this.setState({refreshing: true});
         this.props.GetCategories();
        this.setState({refreshing: false});
      }


      async LoadFontAsync() {
        await Font.loadAsync({
          'BOLD': require('../../Fonts/NeoSansArabicBold.ttf'),
          'Medium': require('../../Fonts/NeoSansArabic.ttf'),
        });
    
        this.setState({ fontLoaded: true });
      }


      GetData(){
        if(this.props.loading){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25}}>
                  <ActivityIndicator size="small" color="#454545" />
            </View>
          )
        }
  
        if(this.props.data){
          return(
            <FlatList 
            showsHorizontalScrollIndicator={false} 
            data={this.props.data}
            numColumns={2}
            renderItem={({item}) => 
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('ServicesSub',{main_cat:this.props.Language == 'ar' ?item.name_ar:item.name_en,id:item.id,maincategories_id:item.id})} style={{flexDirection:'row-reverse',flex:1,padding:15,alignItems:'center',justifyContent:'center',borderRadius:8,borderWidth:1,borderColor:'#c9c9c9',marginRight:5,marginLeft:5,marginBottom:10}}>
              <Text style={{fontSize:14,fontFamily:'BOLD',color:'#000',textAlign:'center'}}>
                  {this.props.Language == 'ar' ?item.name_ar:item.name_en}
              </Text>
              </TouchableOpacity>
            } 
            keyExtractor={({id}, index) => id}
          />
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
  



      componentDidMount() {
        this.LoadFontAsync();
      }

      render() {

         if(!this.props.is_login){
          return (
            <View style={[styles.container,{backgroundColor:'#fff'}]}>
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
                    <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('services')}</Text>
                  </View>
                  <View></View>
                </Header> 
                : 
                <Header backgroundColor={'#2A2A2A'} containerStyle={{borderBottomWidth:0}}>


                <View></View>

                <View style={{justifyContent:'center',flex:1,}}>
                <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('services')}</Text>
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


                <View style={{flex:1,justifyContent:'center',alignItems: "center",paddingTop:25,paddingBottom:25,}}>
                    <Icon name='exclamation-circle' type='font-awesome' size={60} color={'#cfcfcf'} iconStyle={{marginBottom:5}} />
                    <Text style={{fontFamily:'BOLD',fontSize:16,color:'#969696',marginRight:30,marginLeft:30,textAlign:'center',lineHeight:20}}>{i18n.t('login_s')}</Text>

                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('Login')} style={[styles.btn,{width:150,backgroundColor:'#2A2A2A',marginBottom:5}]}>
                        <Text style={{fontSize:15,color:'#fff',fontFamily:'Medium',textAlign:'center',marginTop:4}}>{i18n.t('login')}</Text>
                    </TouchableOpacity>

                </View>
        </View>

          );  
        }

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
                {/* <View style={{position:'absolute',left:17 ,justifyContent:'center',
                    top:-3, width:10,height:10,backgroundColor:'#454545',borderRadius:6,borderWidth:1,borderColor:'#fff'}}>
                </View> */}
            </TouchableOpacity>
             </View>
            <View style={{justifyContent:'center',flex:1,}}>
              <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('services')}</Text>
            </View>
            <View></View>
          </Header> 
          : 
          <Header backgroundColor={'#2A2A2A'} containerStyle={{borderBottomWidth:0}}>
          
          
          <View></View>

          <View style={{justifyContent:'center',flex:1,}}>
          <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('services')}</Text>
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


              <ScrollView 
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                    >
                   

                <View style={{margin:15}}>
                    <Text style={{textAlign:this.props.Language == 'ar' ? 'right':'left',fontFamily: 'BOLD',fontSize:15,color:'#2a2a2a',marginTop:2}}>{i18n.t('services_des')} </Text>



                    <View style={{marginTop:10}}>
                      {this.GetData()}
                    </View>


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
      marginLeft:20,
      marginRight:20,
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
      marginLeft:50,
      marginRight:50,
      marginBottom:15,
      backgroundColor:'#2A2A2A',
      marginTop:20
    
    }
   
  });


  
  const mapStateToProps = (state) => {
    return {
      data_count_notification: state.CountNotification.data,

      is_login: state.CheckUserLogin.is_login,


        loading:state.GetCategories.loading,
        data:state.GetCategories.data,
        Language: state.ChecLanguage.Language,
        data_count_msg: state.CountGetMsgNotRead.data,

      }
  };



export default connect(mapStateToProps, {GetCategories,GetAddress})(Services);