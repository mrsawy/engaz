import React from 'react';
import { StyleSheet, Text,Image, View ,ScrollView ,Linking,AsyncStorage,ActivityIndicator,TouchableOpacity,FlatList,StatusBar,Alert,RefreshControl} from 'react-native';
import * as Font from 'expo-font';
import { Icon ,Input,Header,Divider } from 'react-native-elements';
import i18n from '../../Language';
import { connect } from 'react-redux';
import {GetAddress} from '../../Actions';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome } from '@expo/vector-icons'; 
import RBSheet from "react-native-raw-bottom-sheet";

import StarRating from 'react-native-star-rating';

 class Address extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false,
          refreshing:false,
          payment:'cash'
        
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
        var id_user = await AsyncStorage.getItem('id_user');
        this.props.GetAddress(id_user);
        this.setState({refreshing: false});
      }


      async LoadFontAsync() {
        await Font.loadAsync({
          'BOLD': require('../../Fonts/NeoSansArabicBold.ttf'),
          'Medium': require('../../Fonts/NeoSansArabic.ttf'),
        });
    
        this.setState({ fontLoaded: true });
      }

      selectPayment(val){
        this.setState({ payment: val });
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
            renderItem={({item}) => 
            <View style={{flex:1,flexDirection:this.props.Language == 'ar' ? 'row-reverse':'row',marginBottom:10}}>
                <View style={{marginLeft:10,width:70,alignItems:'center',justifyContent:'center',height:55,width:55,borderRadius:10,backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc'}}>
                    <Icon name='home' type='fontawsome' size={27} color={'#454545'} />
                </View>
                <View style={{flex:1,justifyContent:'center',marginRight:5,marginLeft:5}}>
                    <Text style={{fontSize:15,color:'#454545',fontFamily:'BOLD',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3}}>{item.type} <Text style={{fontSize:11,marginRight:10,color:'#454545',fontFamily:'Medium'}}>{item.city_id.name} , {item.governorate_id.name}</Text></Text>
                    <Text style={{fontSize:13,color:'#a2a2a2',fontFamily:'Medium',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3}}>{item.description}</Text>
                </View>
            </View>
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
              <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('add_address_new')}</Text>
            </View>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{width:30}}>
              <MaterialCommunityIcons name={this.props.Language == 'ar' ? "arrow-right":'arrow-left'} size={22} color="#fff" />
            </TouchableOpacity>
          </Header> 
          : 
          <Header backgroundColor={'#2A2A2A'} containerStyle={{borderBottomWidth:0}}>
          
          
          <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{marginLeft:10}}>
          <MaterialCommunityIcons name={this.props.Language == 'ar' ? "arrow-right":'arrow-left'} size={22} color="#fff" />
          </TouchableOpacity>

          <View style={{justifyContent:'center',flex:1,}}>
          <Text style={{textAlign:'center',fontFamily: 'Medium',fontSize:15,color:'#fff',marginTop:2}}>{i18n.t('add_address_new')}</Text>
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


                <TouchableOpacity onPress={()=> this.props.navigation.navigate('AddAddress')} style={{flex:1,flexDirection:this.props.Language == 'ar' ?'row-reverse':'row'}}>
                        <View style={{marginLeft:10,width:70,alignItems:'center',justifyContent:'center',height:55,width:55,borderRadius:10,backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc'}}>
                            <Icon name='plus' type='feather' size={25} color={'#454545'} />
                        </View>
                        <View style={{flex:1,justifyContent:'center',marginLeft:5,marginRight:5}}>
                            <Text style={{fontSize:15,color:'#454545',fontFamily:'BOLD',textAlign:this.props.Language == 'ar' ?'right':'left',marginTop:3}}>{i18n.t('add_address_new')}</Text>
                        </View>
                    </TouchableOpacity>

                    <Divider style={{ backgroundColor: '#eee' , height:1 , marginTop:15,marginBottom:15 }} />


                    {this.GetData()}
      
                    
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
      height:40,
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

      data_count_notification: state.CountNotification.data,
        
        Language: state.ChecLanguage.Language,
        data:state.GetAddress.data,
        loading:state.GetAddress.loading,

        data_count_msg: state.CountGetMsgNotRead.data,

      }
  };



export default connect(mapStateToProps, {GetAddress})(Address);