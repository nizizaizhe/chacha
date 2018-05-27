import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert } from 'react-native'
import { Toast } from 'native-base'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect()
class ResetPass extends Component {
  static navigationOptions = {
    title: '重置密码',
  }
  constructor(props) {
    super(props)
    this.state = {
        passwordone: '',
        passwordtwo:'',
    }
    console.log(this.props)
  }

  componentDidMount(){
    
  }

  onNext = () => {
    const _this = this
    if(this.state.passwordone.length===0 || this.state.passwordtwo.length===0){
      Toast.show({
        text: "请输入密码",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    if(this.state.passwordone === this.state.passwordtwo){
        const url = `${puburl}chacha-web/chacha/user/forget/`
        let params = {'username':_this.props.navigation.state.params.username,'password':this.state.passwordone,'token':_this.props.navigation.state.params.token}
        NetUtil.post(url,params,'',function(set){
            if(set.status === 200){
                _this.props.dispatch(NavigationActions.back({key: _this.props.navigation.state.params.returnKey}))         
            }else{
                Toast.show({
                    text: set.message,
                    textStyle: { color: "yellow",textAlign:'center' },
                    position:'top'
                })   
            }
        })
    }else{
        Toast.show({
            text: `您两次输入的密码不一致`,
            textStyle: { color: "yellow",textAlign:'center' },
            position:'top'
        })     
    }
  }

  render() {
    const widths = Dimensions.get('window').width
    return (
      <View style={styles.container}>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>重置密码：</Text>
            <TextInput
              secureTextEntry = 'true'
              style={{height: 40,width:300}}
              placeholder="请输入密码"
              onChangeText={(passwordone) => this.setState({passwordone})}/>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>再次输入：</Text>
            <TextInput
              secureTextEntry = 'true'
              style={{height: 40,width:300}}
              placeholder="请再次输入密码"
              onChangeText={(passwordtwo) => this.setState({passwordtwo})}/>
          </View>
          
          <View style={{alignItems:'center',justifyContent:'center',marginTop:120,}} width={widths}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}>
                <Text style={{color:'#037aff'}} onPress={this.onNext}>重置密码</Text>
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

export default ResetPass
