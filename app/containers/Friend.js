import React, { Component } from 'react'
import { StyleSheet, View, Image,TextInput,Text,ScrollView,FlatList,TouchableOpacity,ImageBackground,Dimensions,DeviceEventEmitter,TouchableHighlight} from 'react-native'
import {  SwipeRow,  Icon, Button,ListItem } from 'native-base'
import { connect } from 'react-redux'
import { NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect(({ app }) => ({ ...app }))
class Friend extends Component {
  static navigationOptions = (navigation) =>({
    title: '好友',
    tabBarLabel: '好友',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/all_icon_friend_press.png')}
      />
    ),
    tabBarOnPress: () => {
      console.log(navigation)
      !navigation.screenProps.login ? navigation.navigation.dispatch(NavigationActions.navigate({ routeName: 'Login' })) :
      navigation.navigation.dispatch(NavigationActions.navigate({ routeName: 'Friend' }))
    },
  })
  constructor(props) {
    super(props)
    this.state = {
      pageNo:1,
      pageSize:10,
      text:'',
      NumberArr:'',
      ref:false
    }
    console.log(this.props)
  }
  componentWillMount(){
   
  }
  componentDidMount() {
    const _this = this
    this.loadData('')
    DeviceEventEmitter.addListener('ChangeFriend',()=>{
      _this.loadData('')
    })
    // this.props.navigation.setParams({
    //   // title:'自定义Header',
    //   navigatePress:this.navigatePress
    // })
  }

  componentWillUpdate(){
   
  }
  
  componentDidUpdate(){
    
  }

  loadData(username){
      let _this = this
      this.setState({pageNo:1},() => {
            const url = `${puburl}chacha-web/chacha/user/friend/find/`
            let params = {id:this.props.login.data.id,userName:username,'pageNo': _this.state.pageNo,'pageSize':_this.state.pageSize}
            console.log(params)
            NetUtil.post(url,params,'',function (set) {
              console.log(set)
              if(set.status == 200 && set.data){
                if(set.data.list.length>0){
                  _this.setState({
                    NumberArr:set.data.list
                  })
                }else{
                  _this.setState({
                    NumberArr:[]
                  })
                }
              }else {
                _this.setState({
                  NumberArr:[]
                })
              }
          })
      })
  }
 
  search(){
    const _this = this
    this.loadData(_this.state.text)
  }

  gotoDetail = (id) => {
    //this.props.dispatch(createAction('app/userid')({userid:id}))
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail',params: { userid: id }}))
  }

  extraUniqueKey (item,index){
    return item.id
  }

  cancelf(id){
    let _this = this
    const url = `${puburl}chacha-web/chacha/user/friend/delAll/`
    let params = {'id':this.props.login.data.id,'friendIds':id}
    NetUtil.post(url,params,'',function (set) {
      console.log(set)
      set.status == 200 ? _this.loadData('') :null    
    })
  }

  _onRefresh = () => {
    this.setState({
      ref:true
    })
    this.loadData('')
    setTimeout(() => {
      this.setState({
        ref:false
      })
    }, 2000)
  };

  loadmore = () => {
      let _this = this
      this.setState({
        pageNo:this.state.pageNo+1
      },() => {
        const url = `${puburl}chacha-web/chacha/user/friend/find/`
        let params = {id:this.props.login.data.id,userName:'','pageNo': _this.state.pageNo,'pageSize':_this.state.pageSize}
        NetUtil.post(url,params,'',function (set) {
          if(set.status == 200 && set.data&&set.data.list&&set.data.list.length>0){
              _this.setState({
                NumberArr:[..._this.state.NumberArr,...set.data.list],
              })
          }
        })
      })
  }

  render() {
    const {login} = this.props
    const widths = Dimensions.get('window').width
    const height = Dimensions.get('window').height
    const nodata = () => {
      return <View style={[styles.container]} height={height-200}><Text style={{textAlign:'center'}}>暂无数据</Text></View>
    }

    return (
  <View style={{flex:1,backgroundColor:'#fff'}}>
      <View style={css.searchContainer}>
        <TouchableHighlight underlayColor="#99d9f4"  style={[css.textButton,css.border]} onPress={this.search.bind(this)}>
          <Text style={[css.buttonText]} style={{paddingTop:4,color:'#fff'}} >搜索</Text>
        </TouchableHighlight>
        <TextInput placeholder="请输入好友昵称" style={[css.textInput,css.border]} blurOnSubmit={true} onChangeText={(text) => this.setState({text})} clearButtonMode='always'/>
        {/* <TouchableHighlight underlayColor="#99d9f4"  style={[css.textButton,css.border]}>
          <Text style={[css.buttonText]} style={{paddingTop:10,marginLeft:3,color:'#fff'}} onPress={this.clearTxt.bind(this)}>取消</Text>
        </TouchableHighlight> */}
      </View>
      
      <FlatList
          keyExtractor = {this.extraUniqueKey}
          data={this.state.NumberArr}
          ListEmptyComponent={nodata}
          extraData={this.state}
          onRefresh={this._onRefresh}
          refreshing={this.state.ref}
            onEndReachedThreshold={0.1}
            onEndReached={this.loadmore}
          renderItem={({item}) =>
            <TouchableOpacity activeOpacity={.8}  onPress={()=>this.gotoDetail(item.id)}>
            <SwipeRow
             key={item.id}
            disableLeftSwipe = {false}
            rightOpenValue={-75}
            onPress={()=>this.gotoDetail(item.id)}
            body={
              
                <View style={styles.item} >
                {
                  !item.imgUrl ? <Image style={styles.img}
                    source={require('../images/txicon@2.png')}/> :
                    (<Image style={styles.img} source={{uri:`${imgurl}${item.imgUrl}`}}/>)
                }
                <Text onPress={()=>this.gotoDetail(item.id)} style={styles.item}>
              <View style={{flexDirection:'column',alignItems:'flex-start',flex:1}} width={widths}>
                  <View style={{marginLeft:6,flexDirection:'row'}}>
                      <Text style={{height:15,lineHeight:15,flex:1}} numberOfLines={1} ellipsizeMode='tail'>
                          {item.nickname}
                      </Text>
                     {
                        item.sex === '女' ? <ImageBackground source={require('../images/all_icon_agegirl.png')} style={{width:60,height:19,flex:1}}>
                                              <Text style={{color:'#fff',textAlign:'left',marginLeft:30,marginTop:1}}>{item.age}</Text>
                                                  </ImageBackground> : <ImageBackground source={require('../images/all_icon_ageboy.png')} style={{width:60,height:19,flex:1}}>
                                                  <Text style={{color:'#fff',textAlign:'left',marginLeft:30,marginTop:1}}>{item.age}</Text>
                                              </ImageBackground>
                      }
                  </View>
                  <View style={{flexDirection:'row',alignItems:'flex-start',position:'relative',margin:6,width:'80%'}}>
                      <Text style={{fontSize:12,color:'gray'}} numberOfLines={2} ellipsizeMode='tail'>
                          {item.signature}
                      </Text>
                  </View>
              </View>
              </Text>
            </View>
           
            }
            right={
              <Button danger onPress={() => this.cancelf(item.id)}>
                <Icon active name="trash" />
              </Button>
            }
          />
            

            </TouchableOpacity>
            }/>
      </View>
   
    )
  }
}

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
      },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width:'100%',
      flexWrap:'wrap',
      backgroundColor:'#fff',
    },
    sectionHeader: {
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 14,
      fontWeight: 'bold',
      backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
       padding: 10,
      height: 70,
      flex: 1,
      flexDirection: 'row',
      backgroundColor:'#fff',
        justifyContent:'space-between',
      // borderTopWidth:1,
      // borderColor:'#c0c0c0',
    },
    countText: {
      color: '#FF00FF',
    },
    img:{
      width:50,
      height:50,
    }
  })
  const css = StyleSheet.create({
    container: {
  
    },
    border : {
      borderWidth: 1,
      borderColor: '#c0c0c0',
      borderRadius: 8
    },
  
  
  
    searchContainer :{
      flexDirection : 'row',
      padding : 20,
      backgroundColor:'#99d9f4'
    },
    textInput :{
      flex : 6,
      marginRight : 5,
      fontSize: 16,
      padding : 5,
      color : '#48BBEC',
      backgroundColor:'#fff'
    },
  
    textButton :{
      flex : 1,
      backgroundColor: '#48BBEC',
      alignItems: 'center',
      justifyContent:'center',
      padding : 5,
      marginRight:5
      
    },
    buttonText : {
      fontSize: 18,
      marginTop:0,
      color: 'white',
     
    }
  })

export default Friend
