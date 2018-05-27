import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions,ImageBackground,DeviceEventEmitter} from 'react-native'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect(({ app }) => ({ ...app }))
class Account extends Component {
  static navigationOptions = (navigation) =>({
    title: '我',
    tabBarLabel: '我',
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/all_icon_myself_press.png')}
      />
    ),
    tabBarOnPress: () => {
      console.log(navigation)
      !navigation.screenProps.login ? navigation.navigation.dispatch(NavigationActions.navigate({ routeName: 'Login' })) :
      navigation.navigation.dispatch(NavigationActions.navigate({ routeName: 'Account' }))
    },
  })

  constructor(props) {
    super(props)
    this.state = {
          data: '',
    }
  }

  componentDidMount() {
    const _this = this
    DeviceEventEmitter.addListener('ChangeAccount',()=>{
      _this.loadData()
    })
    DeviceEventEmitter.addListener('ChangePing',()=>{
      _this.loadData()
    })
     this.loadData()
  }

  componentWillUnmount(){
    DeviceEventEmitter.emit('ChangeUi',{})
  }

  loadData(){
      let _this = this
      const url =`${puburl}chacha-web/chacha/user/userInfo/`
      let params = {'Id': this.props.login.data.id}
      NetUtil.get(url,params,function (set) {
        _this.setState({
          data:set.data
        })
    })
  }

  gotoSet = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Set' }))
  }
  gotoLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
  }

  logout = () => {
    console.log("qqedjjfjjjjjjhfhjjbvnfjnvjfnbvkfnbkfnbkgnib")
    this.props.dispatch(createAction('app/logout')({tuichu:'ok'}))
  }

  render() {
    const { login } = this.props
    const item = this.state.data
    const widths = Dimensions.get('window').width
    return (
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
                  {item.username}
                </Text>
              </View>
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:20}}>
              <View style={{flexDirection:'row',alignItems:'flex-start',position:'relative',marginTop:20}}>
                       <ImageBackground source={require('../images/all_icon_agegirl.png')} style={{width:60,height:19,flex:1,right:40}}>
                          <Text style={{color:'#fff',position:'absolute',left:30,top:1}}>{item.age}</Text>
                      </ImageBackground>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:80,marginLeft:40}}>
                    <ImageBackground source={require('../images/all_icon_arrownext1.png')} style={{width:14,height:27}}>
                    </ImageBackground>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View height={80}>
            <View height={80} style={{flexDirection:'row',alignItems:'center', borderBottomWidth:4,
              borderColor:'#c0c0c0',justifyContent:'space-between'}} width={widths}>
              <TouchableOpacity activeOpacity={.8} style={{marginLeft:20,flex:1}}>
                <ImageBackground source={require('../images/myself_btn_true.png')} style={{width:widths/2-30,height:(widths/2-30)/5.6,flex:1,top:25}}>
                    <Text style={{color:'#fff',position:'absolute',left:100,top:4}}>{item.trueCount}</Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.8} style={{marginRight:20,flex:1}}>
                <ImageBackground source={require('../images/myself_btn_false.png')} style={{width:widths/2-30,height:(widths/2-30)/5.6,flex:1,top:25}}>
                      <Text style={{color:'#fff',position:'absolute',left:100,top:4}}>{item.fakeCount}</Text>
                  </ImageBackground>
              </TouchableOpacity>
            </View>
        </View>
        <View style={{flexDirection:'column',paddingVertical:10,borderBottomWidth:4,
          borderColor:'#c0c0c0',}} width={widths}>
          <View style={{marginLeft:20}}>
            <Text style={{color:'#000'}}>个性签名:</Text>
          </View>
          <View style={{marginTop:10,marginLeft:20}}>
            <Text style={{color:'gray'}}>{item.signature}</Text>
          </View>
        </View>

        <View style={{flexDirection:'column',paddingVertical:10,borderBottomWidth:4,
          borderColor:'#c0c0c0',}} width={widths}>
          <View style={{marginLeft:20}}>
            <Text style={{color:'#000'}}>社交信息:</Text>
          </View>
          <View style={{marginTop:10,marginLeft:20,flexDirection:'row',}}>
            <Text style={{color:'gray'}}>微信账号：</Text><Text style={{color:'gray'}}>{item.wechat}</Text>
          </View>
          <View style={{marginTop:10,marginLeft:20,flexDirection:'row',}}>
            <Text style={{color:'gray'}}>陌陌账号：</Text><Text style={{color:'gray'}}>{item.immomo}</Text>
          </View>
        </View>

        <View style={{flexDirection:'row',paddingVertical:30,justifyContent:'center'}} width={widths}>
           {login ? (
             <TouchableOpacity activeOpacity={.8} style={{alignItems:'center',paddingHorizontal:20}} onPress={this.logout}>
             <ImageBackground source={require('../images/myself_btn_quit.png')} style={{width:116,height:30,flex:1}}>
             </ImageBackground>
            </TouchableOpacity>) : null
            }
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
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'#c0c0c0',
    flexWrap:'wrap',
  },
  itemfirst: {
    borderTopWidth:0,
  },
  countText: {
    color: '#FF00FF'
  },
  img:{
    width:60,
    height:60,
  }
})

export default Account
