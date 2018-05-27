import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,TextInput,Alert,TouchableOpacity,Modal,TouchableHighlight } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import {Toast,CheckBox} from 'native-base'
import { connect } from 'react-redux'
import { createAction, NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl}from '../utils/NetUtil'

@connect()
class Wanshan extends Component {
  static navigationOptions = {
    title: '完善信息',
  }
  constructor(props) {
    super(props)
    this.state = {
        username: this.props.navigation.state.params.username,
        password:this.props.navigation.state.params.password,
        sex:'',
        nickname:'',
        wechat:'',
        immomo:'',
        imgUrl:'',
        isDateTimePickerVisible: false,
        date: new Date(),
        timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
        birthday:'请选择您的生日',
        cbirthday:'',
        modalVisible:false,
        isfemale:true,
        sex:'女',
        fcolor:'grey',
        tcolor:'grey'
    }
    console.log(this.props)
    console.log(this.state)
  }

  onComplete = () => {
    console.log(this.state)
    let _this = this
    if(this.state.fcolor==='grey'){
      Toast.show({
        text: "请选择性别",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    
    if(this.state.nickname===''){
      Toast.show({
        text: "请填写昵称",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    if(this.state.tcolor==='grey'){
      Toast.show({
        text: "请选择生日",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    if(this.state.immomo.length === 0 && this.state.wechat.length === 0){
      Toast.show({
        text: "请填写微信号或陌陌号",
        textStyle: { color: "yellow",textAlign:'center' },
        position:'top'
      })
      return false
    }
    const url = `${puburl}chacha-web/chacha/user/regist/`
    let params = {'username':this.state.username,'password':this.state.password,'sex':this.state.isfemale ? 0 :1,'nickname':this.state.nickname,'birthday':this.state.cbirthday,'wechat':this.state.wechat,'immomo':this.state.immomo,'imgUrl':this.state.imgUrl}
   console.log(params)
    NetUtil.post(url,params,'',function(set){
       console.log(set)
       if(set.status == 200){
          const param = {username:_this.state.username,password:_this.state.password,reg:'true',returnKey : _this.props.navigation.state.params.returnKey}
          console.log(param)
          _this.props.dispatch(createAction('app/login')(param))
       }else{
        Toast.show({
          text: `未能注册成功`,
          textStyle: { color: "yellow",textAlign:'center' },
        })     
       }
    })  
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    //Date 对象,日期字符串  
// console.log(date.toDateString());  
// //Date 对象,时间字符串  
// console.log(date.toTimeString());  
// //Date 对象,日期+时间字符串  
// console.log(date.toString());  
  
// //日期字符串,根据本地时间格式  
// console.log(date.toLocaleDateString());  
// //时间字符串,根据本地时间格式  
// console.log(date.toLocaleTimeString());  
// //日期+时间字符串,根据本地时间格式  
    console.log(date.toLocaleString());  
    date = date.toLocaleDateString()
    this.setState({birthday:date,cbirthday:date,isDateTimePickerVisible: false,tcolor:'#000'})
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }

  ok(){
    // console.log(this.state.text)
    // const datas = this.state.data
    // datas.birthday = this.state.text
    // console.log(datas)
    this.setState({
       sex: this.state.isfemale ? '女' :'男',
       fcolor:'#000'
    })
     this.setModalVisible(false)
  }
  cancel(){
    this.setModalVisible(false)
  }
  changesex(){
    console.log(this.state)
    this.setState({
      isfemale : !this.state.isfemale
    })
    console.log(this.state)
  }

  render() {
    const widths = Dimensions.get('window').width
    return (
      <View style={styles.container}>
          
          <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
          // onShow = {() =>{this.show()}}
          onRequestClose={() => {console.log("Modal has been closed.")}
        }>
         <TouchableOpacity style={{flex:1}} onPress={() => {this.setModalVisible(false)}}>
         <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
              {
              <TouchableHighlight onPress={() => {this.setModalVisible(true)}} style={{backgroundColor:'#fff',margin:30,minHeight:130,width:260,padding:10,borderRadius:3}}>
                    <View style={{justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',marginTop:10,justifyContent:'center',alignItems:'center',paddingBottom:10}}>
                            <Text style={{color:'blue',marginLeft:6,fontWeight:'bold',fontSize:18}} >请选择性别</Text>
                        </View>
                        <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',justifyContent:'center',alignItems:'center',paddingBottom:10,paddingTop:8}}>
                            
                              <View style={{flexDirection:'row'}}>
                              <CheckBox checked={!this.state.isfemale} onPress = {this.changesex.bind(this)}/><Text style={{marginLeft:8}}>&nbsp;&nbsp;男</Text>
                              <CheckBox checked={this.state.isfemale} style={{marginLeft:20}} onPress = {this.changesex.bind(this)}/>
                              <Text style={{marginLeft:8}}>&nbsp;&nbsp;女</Text></View>                                                        
                            
                        </View>
                        <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:16}} onPress={() => {this.setModalVisible(false)}}>
                            <Text style={{fontWeight:'900',fontSize:16,justifyContent:'center',alignItems:'center'}} onPress= {()=>{this.ok()}}>确定</Text>
                            <Text style={{fontWeight:'900',fontSize:16,justifyContent:'center',alignItems:'center'}} onPress= {()=>{this.cancel()}}>取消</Text>
                        </TouchableOpacity>
                      </View>
                </TouchableHighlight>
              }
         </View>
         </TouchableOpacity>
        </Modal>

          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20,paddingVertical:10}} width={widths-40}>
            <Text style={{lineHeight:40}}>性别：</Text>
            <TouchableOpacity onPress={() => {this.setModalVisible(true)}} style={{height: 40,width:300}}>
                <Text style={{lineHeight:40,color:this.state.fcolor}}>{this.state.sex}</Text>
              </TouchableOpacity>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20,paddingVertical:10}} width={widths-40}>
            <Text style={{lineHeight:40}}>昵称：</Text>
            <TextInput
              style={{height: 40,width:300}}
              placeholder="请输入昵称"
              onChangeText={(nickname) => this.setState({nickname})}/>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20,paddingVertical:10}} width={widths-40}>
            <Text style={{lineHeight:40}}>生日：</Text>
            
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={this._showDateTimePicker} style={{height: 40,width:300}}>
                <Text style={{lineHeight:40,color:this.state.tcolor}}>{this.state.birthday}</Text>
              </TouchableOpacity>
              <DateTimePicker
              titleIOS="请选择日期"
               cancelTextIOS='取消'
               confirmTextIOS='确定'
               maximumDate={new Date()}
               mode="date"
               timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
              />
            </View>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20,paddingVertical:10}} width={widths-40}>
            <Text style={{lineHeight:40}}>微信号：</Text>
            <TextInput
              style={{height: 40,width:300}}
              placeholder="微信号"
              onChangeText={(wechat) => this.setState({wechat})}/>
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#c0c0c0',flexDirection:'row',marginLeft:20,marginRight:20,paddingVertical:10}} width={widths-40}>
            <Text style={{lineHeight:40}}>陌陌号：</Text>
            <TextInput
              style={{height: 40,width:300}}
              placeholder="陌陌号"
              onChangeText={(immomo) => this.setState({immomo})}/>
          </View>
          
          <View style={{alignItems:'center',justifyContent:'center',marginTop:120,}} width={widths}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#037aff'}}>
                <Text style={{color:'#037aff'}} onPress={this.onComplete}>完成</Text>
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
  }
})

export default Wanshan
