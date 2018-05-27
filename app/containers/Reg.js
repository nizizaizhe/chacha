import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert } from 'react-native'
import { Toast} from 'native-base'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'
import NetUtil ,{puburl}from '../utils/NetUtil'

@connect()
class Reg extends Component {
  static navigationOptions = {
    title: '用户注册',
  }
  constructor(props) {
    super(props)
    this.state = {
      username: ''
    }
  }

  onRegCheck = () => {
      let _this = this
      if(this.state.username === ''){
        Toast.show({
          text: "请输入账号",
          textStyle: { color: "yellow",textAlign:'center' },
          position:'top'
        })
        return false
      }
      const url =  `${puburl}chacha-web/chacha/user/regist/check/`
      let params = {'username':this.state.username}
      NetUtil.post(url,params,'',function(set){
         if(set.status == 200){
          _this.props.dispatch(NavigationActions.navigate({ routeName: 'Regpass',params:{ username: _this.state.username,returnKey : _this.props.navigation.state.params.returnKey }}))
         }else{
            Alert.alert(
                '提示',
                `该账号已经注册，您选择更换号码还是直接登录？`,
                [
                {text: '更换号码', onPress: () => console.log('Ask me later pressed')},
                {text: '直接登录', onPress: () => _this.props.dispatch(NavigationActions.back()), style: 'cancel'},
                ],
                { cancelable: false }
            )
         }
      })
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  toxieyi = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Xieyi'}))
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
          
          <View style={{alignItems:'center',justifyContent:'center',marginTop:120,}} width={widths}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}>
                <Text style={{color:'#037aff'}} onPress={this.onRegCheck}>注册</Text>
            </View>
            <View style={{marginTop:20}}>
                <Text>注册表示您确认自身满18周岁并同意<View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}><Text style={{color:'#037aff'}} onPress={this.toxieyi}>使用协议</Text></View></Text>
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

export default Reg
