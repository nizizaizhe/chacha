import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert ,WebView} from 'react-native'

class Xieyi extends Component {
  static navigationOptions = {
    title: '用户协议',
  }
  constructor(props) {
    super(props)
    this.state = {
      url: 'http://192.168.0.108:8080/chacha-web/'
    }
  }
  render() {
    return (
      <WebView
      source={{uri:'http://192.168.0.108:8080/chacha-web/'}}
      style={{width:'100%',height:'100%'}}
  />)}
}

export default Xieyi
