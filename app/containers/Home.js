import React, { Component } from 'react'
import { StyleSheet,View, Image,Text,ScrollView,FlatList,TouchableOpacity,ImageBackground ,TouchableHighlight,Modal,TextInput,DeviceEventEmitter,Dimensions,Clipboard} from 'react-native'
import { ListItem,Toast,Button,Icon} from 'native-base'
import ChinaRegionWheelPicker from './lib/index'
import { connect } from 'react-redux'
import { createAction,NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'
//import SplashScreen from "rn-splash-screen"

let Ids = ''
@connect(({ app }) => ({ ...app }))
class Home extends Component {
  static navigationOptions = (navigation) =>({
    title: '全部',
    tabBarLabel: '全部',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/all_icon_home_press.png')}
      />
    ),
    // headerRight:(
    //   <Text onPress={navigation.navigation.state.params?navigation.navigation.state.params.navigatePressRight:null}>
    //       <Button transparent>
    //         <Icon name='menu' />
    //       </Button>
    //   </Text>
    // ),
    headerLeft:(
      <Text onPress={navigation.navigation.state.params?navigation.navigation.state.params.navigatePressLeft:null} style={{marginLeft:10}}>
          {navigation.navigation.state.params?navigation.navigation.state.params.region:'请选择城市'}
      </Text>
    ),
  })
  constructor(props) {
    super(props)
    this.state = {
      list:'',
      pageNo:1,
      pageSize:10,
      modalVisible:false,
      wechat:'',
      immomo:'',
      showToast: false,
      isPickerVisible: false,
      provinceCode:'110000',
      cityCode: '110100',
      ref:false
    }
    console.log(this.props)
  }
  componentWillMount(){
    
  }
  componentDidMount(){
    // setTimeout(() => {  
    //   SplashScreen.hide()
    // }, 2000)//延时2秒消失  
    DeviceEventEmitter.addListener('ChangeUi',(dic)=>{
      this.loadData()
    })
    this.props.navigation.setParams({
      // title:'自定义Header',
      region:'北京.北京',
      right:'right',
      navigatePressLeft:this.navigatePressLeft,
      navigatePressRight:this.navigatePressRight,
    })
    
  }

  navigatePressLeft = () => {
    this._onPress2Show()
  }
  navigatePressRight = () => {
    
  }
  loadData(provincecode,citycode){
      let _this = this
      this.setState({
        pageNo:1
      },() => {
        const {login} = this.props
        const url = login ? `${puburl}chacha-web/chacha/user/find/` : `${puburl}chacha-web/chacha/user/find/notlogin/`
        let params = login ? ({'id':this.props.login.data.id,'pageNo':this.state.pageNo,'pageSize':this.state.pageSize,'province':this.state.provinceCode,'city':this.state.cityCode}) 
                     : ({'pageNo':this.state.pageNo,'pageSize':this.state.pageSize})
                  
        NetUtil.post(url,params,'',function(set){
          if(set.data&&set.data.list&&set.data.list.length>0){
            _this.setState({
              list:set.data.list,
            })
          }
        })
      })
  }
  getModalMess(){
    let _this = this
    const url =`${puburl}chacha-web/chacha/user/userInfo/`
    let params = {'Id': Ids }
    NetUtil.get(url,params,function (set) {
      _this.setState({
        wechat:set.data.wechat,
        immomo:set.data.immomo,
      })
    })
  }
  copy(text){
      const {login} = this.props
      if(login){
        this.addFriend(text)
      }else{
        this.setModalVisible(false)
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
      }
  }

  addFriend(text){
    let _this = this
    const url =`${puburl}chacha-web/chacha/user/friend/add/`
    let params = {'id': this.props.login.data.id, 'friendId':Ids}
    Clipboard.setString(text)
    NetUtil.post(url,params,'',function (set) {
      if(set.status === 200){
        // DeviceEventEmitter.emit('ChangeFriend',{
            
        // })
        _this.setModalVisible(false)
        Toast.show({
          text: "新增朋友成功",
          textStyle: { color: "yellow",textAlign:'center' },
        })
      }else{
        _this.setModalVisible(false)
        Toast.show({
          text: "复制成功",
          textStyle: { color: "yellow",textAlign:'center' },
        })
      }
    })
  }

  gotoDetail = (id) => {
      const {login} = this.props
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' ,params: { userid: id }}))
  }
  
  extraUniqueKey (item,index){
    return index+item
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  setModalVisibles(visible,id) {
    Ids = id
    this.setState({modalVisible: visible})
  }

  _onPress2Show() {
    this.setState({ isPickerVisible: true })
  }
  _onPressCancel() {
    this.setState({ isPickerVisible: false })
  }
  _onPressSubmit(params) {
    var _this = this
    this.setState({ isPickerVisible: false,provinceCode:params.area.provinceCode,cityCode: params.area.cityCode})
    this.props.navigation.setParams({
      region: `${params.province}.${params.city}`,
      right:'right',
    })
    _this.loadData()
  }

  _onRefresh = () => {
    this.setState({
      ref:true
    },() => {this.loadData()})

    var t = setTimeout(() => {
      this.setState({
        ref:false
      })
      clearTimeout(t)
    }, 1000);
  };

  loadmore = () => {
      let _this = this
      this.setState({
        pageNo:this.state.pageNo+1
      },() => {
          const {login} = this.props
          const url = login ? `${puburl}chacha-web/chacha/user/find/` : `${puburl}chacha-web/chacha/user/find/notlogin/`
          let params = login ? ({'id':this.props.login.data.id,'pageNo':this.state.pageNo,'pageSize':this.state.pageSize,'province':this.state.provinceCode,'city':this.state.cityCode}) 
                      : ({'pageNo':this.state.pageNo,'pageSize':this.state.pageSize})
                      console.log(params)
          NetUtil.post(url,params,'',function(set){
            if(set.data&&set.data.list&&set.data.list.length>0){
              _this.setState({
                list:[..._this.state.list,...set.data.list]
              })
            } 
          })
      })
  };

  render() {
    const {login} = this.props
    const height = Dimensions.get('window').height
    const nodata = () => {
      return <View style={[styles.container]} height={height-100}><Text style={{textAlign:'center'}}>请您下拉刷新数据...</Text></View>
    }
    return (
      <View style={{backgroundColor:'#fff'}}>
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
          onShow = {() =>{this.getModalMess()}}
          onRequestClose={() => {console.log("Modal has been closed.")}
        }>
         <TouchableOpacity style={{flex:1}} onPress={() => {this.setModalVisible(false)}} activeOpacity={1}>
         <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity activeOpacity={1} onPress={() => {this.setModalVisible(true)}} style={{backgroundColor:'#fff',margin:30,height:130,width:260,padding:10,borderRadius:3}}>
                  <View style={{flex:1,height:130,justifyContent:'space-between'}}>
                      <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',marginTop:10,justifyContent:'space-between',alignItems:'center',paddingBottom:10}}>
                          <Text>微信：<Text>{this.state.wechat}</Text></Text>     
                          <Text style={{color:'blue',marginLeft:6}} onPress={() => {this.copy(this.state.wechat)}}>复制</Text>
                      </View>
                      <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',justifyContent:'space-between',alignItems:'center',paddingBottom:10}}>
                          <Text>陌陌：<Text>{this.state.immomo}</Text></Text>   
                          <Text style={{color:'blue',marginLeft:6}} onPress={() => {this.copy(this.state.immomo)}}>复制</Text>
                      </View>
                      <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={() => {this.setModalVisible(false)}}>
                          <Text style={{fontWeight:'900',justifyContent:'center',alignItems:'center',fontSize:16}}>取&nbsp;&nbsp;消</Text>
                      </TouchableOpacity>
                    </View>
              </TouchableOpacity>
         </View>
         </TouchableOpacity>
        </Modal>
        
        <ChinaRegionWheelPicker
          isVisible={this.state.isPickerVisible}
          navBtnColor={'blue'}
          selectedProvince={'北京市'}
          selectedCity={'市辖区'}
          transparent
          animationType={'none'}
          onSubmit={this._onPressSubmit.bind(this)}
          onCancel={this._onPressCancel.bind(this)}
        />

        <FlatList
        style={{backgroundColor:'#fff'}}
        ListEmptyComponent={nodata}
        onRefresh={this._onRefresh}
        refreshing={this.state.ref}
        onEndReachedThreshold={0.1}
            onEndReached={this.loadmore}
            keyExtractor = {this.extraUniqueKey}
          data={this.state.list}
          renderItem={({item,i}) =>
            <TouchableOpacity activeOpacity={1} key={i} style={{backgroundColor:'#fff'}}>
             <ListItem onPress={()=>this.gotoDetail(item.id)} style={{backgroundColor:'#fff',marginLeft:0}}>
            <View style={styles.item} >
                {
                  !item.imgUrl ? <Image style={styles.img}
                    source={require('../images/txicon@2.png')}/> :
                    (<Image style={styles.img} source={{uri:`${imgurl}${item.imgUrl}`}}/>)
                }
              <View style={{flexDirection:'column',alignItems:'flex-start',flex:1}}>
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
                  <View style={{flexDirection:'row',alignItems:'flex-start',position:'relative',margin:6}}>
                      <Text style={{fontSize:12,color:'gray'}} numberOfLines={2} ellipsizeMode='tail'>
                          {item.signature}
                      </Text>
                  </View>
              </View>
               <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:44}}>
                    {item.sex === '女' ? <TouchableOpacity onPress={() => {this.setModalVisibles(true,item.id)}} >
                        <ImageBackground source={require('../images/all_btn_addgirl.png')} style={{width:50,height:20}} ></ImageBackground> </TouchableOpacity>
                       : 
                       <TouchableOpacity onPress={() => {this.setModalVisibles(true,item.id)}} >
                           <ImageBackground source={require('../images/all_btn_addboy.png')} style={{width:50,height:20}}></ImageBackground>
                      </TouchableOpacity>
                    }
              </View>
            </View>
            </ListItem>
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
  },
  containers: {
    flex: 1,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    padding: 10,
    height: 70,
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'#fff',
    justifyContent:'space-between',
  },
  countText: {
    color: '#FF00FF',
  },
  img:{
    width:50,
    height:50,
  }
})

export default Home
