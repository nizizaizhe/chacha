import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert } from 'react-native'
import {Toast} from 'native-base'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect()
class ForgetPass extends Component {
  static navigationOptions = {
    title: '忘记密码',
  }
  constructor(props) {
    super(props)
    this.state = {
        username: '',
        bindAccount:'',
    }
    console.log(this.props)
  }

  componentDidMount(){

  }

  onNext = () => {
    const _this = this
    if(this.state.username.length === 0 || this.state.bindAccount.length === 0){
      Toast.show({
        text: "请输入正确的账号",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    if(this.state.bindAccount.length === 0){
      Toast.show({
        text: "请输入正确的绑定号",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    const url = `${puburl}chacha-web/chacha/user/forget/check/`
    let params = {'username':this.state.username,'bindAccount':this.state.bindAccount}

    NetUtil.post(url,params,'',function(set){
      set.status === 200 ? _this.props.dispatch(NavigationActions.navigate({ routeName: 'ResetPass' ,params: { username: _this.state.username, token:set.token, returnKey : _this.props.navigation.state.key}})) 
      : Toast.show({
        text: "账号或绑定校验有误",
        textStyle: { color: "yellow",textAlign:'center' },
      })
    })    
  }

  render() {
    const widths = Dimensions.get('window').width
    return (
      <View style={styles.container}>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>账号：</Text>
            <TextInput
              style={{height: 40,width:300}}
              placeholder="请输入账号"
              onChangeText={(username) => this.setState({username})}/>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>绑定校验：</Text>
            <TextInput
              style={{height: 40,width:300}}
              placeholder="请输入绑定的微信号或陌陌号"
              onChangeText={(bindAccount) => this.setState({bindAccount})}/>
          </View>
          
          <View style={{alignItems:'center',justifyContent:'center',marginTop:120,}} width={widths}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}>
                <Text style={{color:'#037aff'}} onPress={this.onNext}>下一步</Text>
            </View>
          </View>
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

export default ForgetPass
