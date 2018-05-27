import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert } from 'react-native'
import {Toast} from 'native-base'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'

@connect()
class Regpass extends Component {
  static navigationOptions = {
    title: '设置密码',
  }
  constructor(props) {
    super(props)
    this.state = {
        passwordone: '',
        passwordtwo:'',
    }
    console.log(this.props)
  }

  onNext = () => {
      let _this = this
      if(this.state.passwordone.length ===0 ||this.state.passwordtwo.length === 0){
        Toast.show({
          text: `请输入密码`,
          textStyle: { color: "yellow",textAlign:'center' },
          position:'top'
        })
        return false
      }
      this.state.passwordone === this.state.passwordtwo ? _this.props.dispatch(NavigationActions.navigate({ routeName: 'Wanshan' ,params: { username: _this.props.navigation.state.params.username,password: _this.state.passwordone,returnKey : _this.props.navigation.state.params.returnKey }})) : Toast.show({
        text: `您两次输入的密码不一致`,
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })     
  }
  render() {
    const widths = Dimensions.get('window').width
    return (
      <View style={styles.container}>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>密码：</Text>
            <TextInput
              style={{height: 40,width:300}}
              secureTextEntry = 'true'
              placeholder="密码"
              onChangeText={(passwordone) => this.setState({passwordone})}/>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20}} width={widths-40}>
            <Text style={{lineHeight:40}}>再次输入：</Text>
            <TextInput
              secureTextEntry = 'true'
              style={{height: 40,width:300}}
              placeholder="再次输入"
              onChangeText={(passwordtwo) => this.setState({passwordtwo})}/>
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

export default Regpass
