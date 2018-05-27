import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,ActivityIndicator ,DeviceEventEmitter} from 'react-native'
import { Toast} from 'native-base'
import { connect } from 'react-redux'
import { Touchable } from '../components'
import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ ...app }))
class Login extends Component {
  static navigationOptions = {
    title: '用户登录',
  }
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password:'',
    }
  }
  onLogin = () => {
    if(this.state.username.length === 0 || this.state.password.length === 0){
      Toast.show({
        text: "请输入账号和密码",
        textStyle: { color: "yellow",textAlign:'center'},
        position:'top'
      })
    }else{
      const param = {username:this.state.username,password:this.state.password}
      this.props.dispatch(createAction('app/login')(param))
    }
  }

  forgetPass = () => {
    var _this = this
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ForgetPass',params:{returnKey : _this.props.navigation.state.key} }))
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }
  toReg = () => {
    var _this = this
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Reg',params:{returnKey : _this.props.navigation.state.key} }))
  }
  componentWillUnmount(){
    DeviceEventEmitter.emit('ChangeUi',{
      color:'red',
      tongzhi:'通知',
    })
  }
  // alert = () =>{
  //     Alert.alert(
  //       'Alert Title',
  //       `My Alert Msg`,
  //       [
  //         {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
  //         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //         {text: 'OK', onPress: () => console.log('OK Pressed')},
  //       ],
  //       { cancelable: false }
  //     )
  //   }
 
  render() {
    const { fetching } = this.props
    const widths = Dimensions.get('window').width
    return (
      <View style={styles.container}>
      {fetching ? (
          <ActivityIndicator  style={{flex:1,alignItems:'center',
          justifyContent:'center',
          padding:8}} size= 'large' 
          color= 'gray'/>
        ) : (
          <View>
            <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20}} width='100%'>
              <Text style={{lineHeight:40}}>账号：</Text>
              <TextInput
                style={{height: 40,width:'80%'}}
                placeholder="请输入账号"
                onChangeText={(username) => this.setState({username})}/>
            </View>
            <View style={{flexDirection:'row',marginLeft:20}} width='80%'>
              <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row'}}>
                  <Text style={{lineHeight:40}}>密码：</Text>
                  <TextInput
                    secureTextEntry = 'true'
                    style={{height: 40,width:'80%'}}
                    placeholder="请输入密码"
                    onChangeText={(password) => this.setState({password})}/>
              </View>
              <Text style={{lineHeight:40,color:'#037aff'}} onPress={this.onLogin}>登录</Text>
            </View>
            <View style={{width:'100%',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end',marginTop:60}}>
              <Text style={{color:'#037aff',}} onPress={this.forgetPass}>忘记密码？</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',marginTop:120,}} width={widths}>
              <View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}>
                  <Text style={{color:'#037aff'}} onPress={this.toReg}>新用户注册</Text>
              </View>
          </View>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop:60,
    backgroundColor:'#fff',
  },
  close: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
})

export default Login
