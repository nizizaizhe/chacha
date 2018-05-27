import React, { Component } from 'react'
import { StyleSheet, View,Image, TouchableOpacity, Text, Dimensions,ImageBackground,DeviceEventEmitter,Clipboard} from 'react-native'
import { Toast} from 'native-base'
import { connect } from 'react-redux'
 import { NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect(({ app }) => ({ ...app }))
class Detail extends Component {
  static navigationOptions = {
    title: '个人信息详情',
  }
  constructor(props) {
    super(props)
    this.state = {
          data: ''
    }
    console.log(this.props)
  }
  componentDidMount() {
    this.loadData()
  }

  pinglun(num){
    let _this = this
      const url =`${puburl}chacha-web/chacha/user/comment/add/`
      //let params = {'Id': this.props.userid}
      let params = {'id':_this.props.login.data.id,'targetId': _this.props.navigation.state.params.userid ,'good':num}
      NetUtil.post(url,params,'',function (set) {
        if(set.status === 200 ){
          _this.setState({
            data:set.data
          },()=>{
            DeviceEventEmitter.emit('ChangePing',{
            
            })
            Toast.show({
              text: "操作成功",
              textStyle: { color: "yellow",textAlign:'center' },
            })
          })
          

        }else{
          Toast.show({
            text: '操作失败',
            textStyle: { color: "yellow",textAlign:'center' },
          })
        }
      })
  }
  
  loadData(){
      let _this = this
      const url =`${puburl}chacha-web/chacha/user/userInfo/`
      //let params = {'Id': this.props.userid}
      let params = {'Id': this.props.navigation.state.params.userid }
      NetUtil.get(url,params,function (set) {
        _this.setState({
          data:set.data
        })
      })
  }
  copy(text){
    const _this = this
    const {login} = this.props
    login ? _this.addFriend(text) : _this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' })) 
}

  addFriend(text){
    let _this = this
    Clipboard.setString(text)
    const url =`${puburl}chacha-web/chacha/user/friend/add/`
    let params = {'id': _this.props.login.data.id, 'friendId':_this.props.navigation.state.params.userid}
    NetUtil.post(url,params,'',function (set) {
      if(set.status === 200){
        // DeviceEventEmitter.emit('ChangeFriend',{
            
        // })
        Clipboard.setString(text)
        Toast.show({
          text: "新增朋友成功",
          textStyle: { color: "yellow",textAlign:'center' },
        })
      }else{
        Toast.show({
          text: '复制成功',
          textStyle: { color: "yellow",textAlign:'center' },
        })
      }
    })
  }
  // gotoDetail = () => {
  //   this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  // }

  // goBack = () => {
  //   this.props.dispatch(NavigationActions.back({ routeName: 'Account' }))
  // }

  render() {
    const item = this.state.data
    const widths = Dimensions.get('window').width
    return (
      // <View style={styles.container}>
      //   <Button text="Goto Detail" onPress={this.gotoDetail} />
      //   <Button text="Go Back" onPress={this.goBack} />
      // </View>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoSet} style={{height:80,marginLeft:20,flexDirection:'row'}}>
          <View style={styles.item}>
            <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
                {
                  !item.imgUrl ? <Image style={styles.img}
                    source={require('../images/txicon@2.png')}/> :
                    (<Image style={styles.img} source={{uri:`${imgurl}${item.imgUrl}`}}/>)
                }
              <View style={{height:40,marginLeft:6,flex:1}}>
                <Text style={{height:20,lineHeight:20}}>
                  {item.nickname}
                </Text>
                <Text style={{height:20,lineHeight:20,fontSize:10,color:'gray'}} numberOfLines={1} ellipsizeMode='tail'>
                  {item.provinceName}.{item.cityName}
                </Text>
              </View>
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',marginRight:20}}>
              <View style={{flexDirection:'row',alignItems:'flex-start',position:'relative',marginTop:20}}>
                    {
                      item.sex === '女' ? <ImageBackground source={require('../images/all_icon_agegirl.png')} style={{width:60,height:19,flex:1,left:6}}>
                          <Text style={{color:'#fff',position:'absolute',left:30,top:1}}>{item.age}</Text>
                      </ImageBackground> : <ImageBackground source={require('../images/all_icon_ageboy.png')} style={{width:60,height:19,flex:1,left:6}}>
                          <Text style={{color:'#fff',position:'absolute',left:30,top:1}}>{item.age}</Text>
                      </ImageBackground>
                    }
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View height={60}>
            <View height={60} style={{flexDirection:'row',alignItems:'center', borderBottomWidth:4,
              borderColor:'#c0c0c0',justifyContent:'space-between'}} width={widths}>
              <TouchableOpacity activeOpacity={.8} style={{marginLeft:20}} onPress={() => this.pinglun('1')}>
                <ImageBackground source={require('../images/myself_btn_true.png')} style={{width:widths/2-30,height:(widths/2-30)/5.6,flex:1,top:10}}>
                    <Text style={{color:'#fff',position:'absolute',left:90,top:4}}>{item.trueCount}</Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.8} style={{marginRight:20}} onPress={() => this.pinglun('0')}>
                <ImageBackground source={require('../images/myself_btn_false.png')} style={{width:widths/2-30,height:(widths/2-30)/5.6,flex:1,top:10}}>
                      <Text style={{color:'#fff',position:'absolute',left:90,top:4}}>{item.fakeCount}</Text>
                  </ImageBackground>
              </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:'column',paddingVertical:10,borderBottomWidth:1,marginLeft:20,
          borderColor:'#c0c0c0',}} width={widths}>
          <View>
            <Text style={{color:'#000'}}>个性签名:</Text>
          </View>
          <View style={{marginTop:10,marginRight:20,}}>
            <Text style={{color:'gray'}}>{item.signature}</Text>
          </View>
        </View>

        <View style={{flexDirection:'column',paddingVertical:10,borderBottomWidth:1,marginLeft:20,
          borderColor:'#c0c0c0',}} width={widths}>
          <View>
            <Text style={{color:'#000'}}>社交信息:</Text>
          </View>
          <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',marginRight:40}}>
            <Text style={{color:'blue'}}>
                <Text style={{color:'gray'}}>微信账号：</Text><Text style={{color:'gray'}}>{item.wechat}</Text>
            </Text>
            <Text style={{color:'blue',paddingHorizontal:8}} onPress={() => {this.copy(item.wechat)}}>复制</Text>
          </View>
          <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',marginRight:40}}>
            <Text>
                <Text style={{color:'gray'}}>陌陌账号：</Text><Text style={{color:'gray'}}>{item.immomo}</Text>
            </Text>
            <Text style={{color:'blue',paddingHorizontal:8}} onPress={() => {this.copy(item.immomo)}}>复制</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor:'#fff',
  },
  icon: {
    width: 32,
    height: 32,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    height: 80,
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  itemfirst: {
    borderTopWidth:0,
  },
  countText: {
    color: '#FF00FF'
  },
  img:{
    width:50,
    height:50,
  }
})

export default Detail
