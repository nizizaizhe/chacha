import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Text,Modal,TouchableWithoutFeedback,Keyboard,TextInput,ImageBackground,NativeModules,DeviceEventEmitter,FlatList,Dimensions,ScrollView} from 'react-native'
import {  Toast,CheckBox } from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import ChinaRegionWheelPicker from './lib/index'
import { connect } from 'react-redux'
import { NavigationActions } from '../utils'
import NetUtil ,{puburl,imgurl,uploadimgurl}from '../utils/NetUtil'

var ImagePicker = NativeModules.ImageCropPicker
let titles = ''
@connect(({ app }) => ({ ...app }))
class Set extends Component {
  static navigationOptions = (navigation) =>({
    title: '个人信息',
    headerRight:(
      <Text onPress={navigation.navigation.state.params?navigation.navigation.state.params.navigatePress:null} style={{padding:10}}>
          保存
      </Text>
    ),
  })
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
          data: {
               
          },
          date: new Date(),
          timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
          isDateTimePickerVisible: false,
          modalVisible:false,
          text:'',
          isfemale:true,
          isPickerVisible: false,
          imgUrls:''
    }
    console.log(this.state)
  }
  componentWillMount(){
    this.loadData()
  }
  componentDidMount() {
    this.props.navigation.setParams({
      // title:'自定义Header',
      navigatePress:this.navigatePress
    })
  }
  navigatePress = () => {
   let _this = this
      const url =`${puburl}chacha-web/chacha/user/info/update/`
      console.log(url)
      let params = {'id': this.state.data.id,
                    'wechat': this.state.data.wechat,
                    'immomo': this.state.data.immomo,
                    'sex': this.state.data.sex==='女' ? 0 : 1,
                    'nickname': this.state.data.nickname,
                    'signature': this.state.data.signature,
                    'birthday': this.state.data.birthday,
                    'province': this.state.data.province,
                    'city': this.state.data.city,
                    'imgUrl': this.state.data.imgUrl
                  }
                  console.log('保存开始')
      console.log(params)
      NetUtil.post(url,params,'',function (set) {
        console.log(set)

        if(set.status === 200){
          DeviceEventEmitter.emit('ChangeAccount',{
            
          })
          _this.setState({
            data:set.data
          })
          _this.props.dispatch(NavigationActions.back())
        }
    })
  }
  
  
  loadData(){
      let _this = this
      const url =`${puburl}chacha-web/chacha/user/userInfo/`
      let params = {'Id': this.props.login.data.id}
      NetUtil.get(url,params,function (set) {
        const isfemales = set.data.sex === '女' ? true : false
        _this.setState({
          data:set.data,
          isfemale:isfemales,
        })
    })
  }

  goBack = () => {
    this.props.dispatch(NavigationActions.back({ routeName: 'Account' }))
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  setModalVisibles(visible,title) {
    titles = title
    this.setState({modalVisible: visible,text:''})
  }
  onChanegeTextKeyword(text){
    this.setState({text:text})
  }

  cancel(){
    this.setModalVisible(false)
  }

  ok(){
    console.log(this.state.text)
    const datas = this.state.data
    if(titles === '昵称'){
      this.state.text=='' ? null : datas.nickname = this.state.text
    }else if(titles === '性别'){
      console.log(this.state.isfemale)
      const sexs = this.state.isfemale ? '女' :'男'
      datas.sex = sexs
    }else if(titles === '个性签名'){
      this.state.text=='' ? null : datas.signature = this.state.text
    }else if(titles === '微信账号'){
      this.state.text=='' ? null : datas.wechat = this.state.text
    }else if(titles === '陌陌账号'){
      this.state.text=='' ? null : datas.immomo = this.state.text
    }
    console.log(datas)
    this.setState({
       data:datas
    })
    this.setModalVisible(false)
  }
  
  changesex(){
    console.log(this.state)
    this.setState({
      isfemale : !this.state.isfemale
    })
    console.log(this.state)
  }

  _onPress2Show() {
    this.setState({ isPickerVisible: true })
  }
  _onPressCancel() {
    this.setState({ isPickerVisible: false })
    console.log('cancel')
  }
  _onPressSubmit(params) {
    this.setState({ isPickerVisible: false })
    const datas = this.state.data
    datas.provinceName = params.province
    datas.cityName = params.city
    datas.province = params.area.provinceCode
    datas.city = params.area.cityCode
    console.log(datas)
    this.setState({
       data:datas
    })
    console.log(this.state)
  }

  pickSingleWithCamera(cropping) {
    const _this = this
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
    }).then(image => {
      console.log('pickSingleWithCamera received image', image)
      _this.setModalVisible(false)
      _this.setState({
        imgUrls:image.path
      })
      _this.uploadImage(image)
    }).catch(e => {
      _this.setModalVisible(false)
    })
  }

  pickSingle(cropit, circular=true) {
    const _this = this
    console.log(cropit)
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      console.log('received image', image)
      _this.setModalVisible(false)
      _this.setState({
        imgUrls:image.path
      },() =>{
        _this.uploadImage(image)
      })
    }).catch(e => {
        _this.setModalVisible(false)
    })
  }

  uploadImage(imgUrl) {
     let _this = this
     let url = uploadimgurl; //图片服务器
     let formData = new FormData()// 把图片放入formData中,采用formData来实现
     let file = { uri:  imgUrl.path, type: 'multipart/form-data', name: imgUrl.filename }// 这里的key(uri和type和name)不能改变,此处type也有可能是'application/octet-stream',看后台配置
        
     formData.append('file', file)// 有可能是file 也有可能是images 看后台的配置
       return fetch(url, {
          method: 'POST',
          body: formData,
       })
      .then((response) => response.json())
      .then((responseData) => {
         console.log('responseData', responseData)
         if(responseData.url.length>0){
             const datas = _this.state.data
             datas.imgUrl = responseData.url
            _this.setState({
              data:datas
            })
         }else{
          Toast.show({
            text: `上传图片失败`,
            textStyle: { color: "yellow",textAlign:'center' },
            position:'bottom'
          })
         }
      })
      .catch((error) => {
          // Toast.show({
          //   text: `${error}`,
          //   textStyle: { color: "yellow",textAlign:'center' },
          //   position:'bottom'
          // })
     })
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
   
    _handleDatePicked = (date) => {
      console.log(date.toLocaleString())
      let _this = this
      date = date.toLocaleDateString()
      const datas = _this.state.data
      datas.birthday = date
      _this.setState({
        data:datas,
        isDateTimePickerVisible: false
      })
    }
  
  render() {
    const item = this.state.data
    const widths = Dimensions.get('window').width
    const height = Dimensions.get('window').height
    const nodata = () => {
      return <View style={{ flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }} height={height}><Text style={{textAlign:'center'}}>暂无数据</Text></View>
    }
    console.log(item)
    return (
      <ScrollView contentContainerStyle={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor:'#fff',
        width:'100%'}}>
      <View style={{flex:1,width:'100%'}}>
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
           onShow = {() =>{console.log('modal show')}}
           onDismiss = {() =>{console.log('modal Close')}}
          onRequestClose={() => {console.log("Modal has been closed.")}
        }>
         <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={() => {this.setModalVisible(false)}} >
         <View style={{flex:1,backgroundColor:'rgba(0,0,0,.5)',justifyContent:'center',alignItems:'center'}} >
              {
                titles === '头像' ? 
                    <View  style={{margin:30,minHeight:130,width:'90%',padding:10}}>
                        <TouchableOpacity activeOpacity={1} style={{justifyContent:'center',backgroundColor:'#fff',borderRadius:6}} >
                            <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',marginTop:20,justifyContent:'center',alignItems:'center',paddingBottom:20}}>
                                <Text style={{marginLeft:6,fontWeight:'bold',fontSize:18}} >请选择照片</Text>
                            </View>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.pickSingleWithCamera(true)} style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',justifyContent:'center',alignItems:'center',paddingBottom:20,paddingTop:16}}>
                                <Text style={{marginLeft:6,fontWeight:'bold',fontSize:16}} >拍&nbsp;&nbsp;照</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.pickSingle(true)} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingBottom:20,paddingTop:16}}>
                                <Text style={{marginLeft:6,fontWeight:'bold',fontSize:16}} >选择相册</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:16,padding:20,borderRadius:6,backgroundColor:'#fff',}} onPress={() => {this.setModalVisible(false)}}>                             
                               <Text style={{fontWeight:'bold',fontSize:16,justifyContent:'center',alignItems:'center'}}>取&nbsp;&nbsp;消</Text>
                        </TouchableOpacity>
                    </View> :

                    <TouchableOpacity activeOpacity={1} onPress={() => {this.setModalVisible(true)}} style={{backgroundColor:'#fff',minHeight:130,width:'90%',borderRadius:3}}>
                        <View style={{justifyContent:'space-between'}}>
                          <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',marginTop:16,justifyContent:'center',alignItems:'center',paddingBottom:20}}>
                            <Text style={{marginLeft:6,fontWeight:'bold',fontSize:18}} >{titles}</Text>
                          </TouchableOpacity>
                         
                            {
                              titles==='性别' ?
                                <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',justifyContent:'space-around',alignItems:'center',paddingLeft:10,paddingBottom:20,paddingTop:16}}>
                                   <View style={{flexDirection:'row'}}><CheckBox checked={!this.state.isfemale} onPress = {this.changesex.bind(this)}/><Text style={{marginLeft:8}}>&nbsp;&nbsp;男</Text></View>
                                   <View style={{flexDirection:'row'}}><CheckBox checked={this.state.isfemale} style={{marginLeft:20}} onPress = {this.changesex.bind(this)}/><Text style={{marginLeft:8}}>&nbsp;&nbsp;女</Text></View>
                               </View>
                                :
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                  <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#c0c0c0',justifyContent:'flex-start',alignItems:'center',paddingLeft:10,paddingBottom:20,paddingTop:16}}>
                                  {titles==='个性签名' ?<TextInput keyboardType={'default'} autoCorrect={false} multiline = {true} numberOfLines = {3} placeholder={`请输入${titles}...`} onChangeText={this.onChanegeTextKeyword.bind(this)}  style={{width:'90%',minHeight:50}}/> 
                                   :
                                  <TextInput placeholder={`请输入${titles}...`} ref="textInput1" onChangeText={this.onChanegeTextKeyword.bind(this)}  style={{width:'90%'}}/>  
                                   }
                                  </View>
                              </TouchableWithoutFeedback>
                            }
                         
                         <TouchableOpacity activeOpacity={1} style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:16,paddingBottom:20}}>
                            <Text activeOpacity={1} style={{fontWeight:'900',fontSize:16,justifyContent:'center',alignItems:'center',paddingHorizontal:20}} onPress= {()=>{this.ok()}}>确定</Text>
                            <Text style={{fontWeight:'900',fontSize:16,justifyContent:'center',alignItems:'center',paddingHorizontal:20}} onPress= {()=>{this.cancel()}}>取消</Text>
                         </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
              }
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
        <TouchableOpacity activeOpacity={.8} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'头像')}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
                  <Text>
                    头像
                  </Text>
                 <View style={{flexDirection: 'row',alignItems:'center'}}>
                    {
                      this.state.imgUrls === "" ? (
                      !item.imgUrl ? <Image style={[styles.img,{marginRight:8}]}source={require('../images/txicon@2.png')}/> :
                        <Image style={[styles.img,{marginRight:8}]} source={{uri:`${imgurl}${item.imgUrl}`}}/>
                      ):(
                        <Image style={[styles.img,{marginRight:8}]} source={{uri:this.state.imgUrls}}/>
                      )
                    }
                    <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
                  
                  
                 </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'昵称')}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              昵称
            </Text>
            <View style={{flexDirection: 'row',marginLeft:8,alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
                {item.nickname}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8}  style={{height:60,flexDirection:'row'}} >
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              查查号
            </Text>
            <View style={{flexDirection: 'row',}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
              {item.username}
              </Text>
              <Text style={{fontSize:20,height:60,lineHeight:60,width:10}}>
                &nbsp;
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this._onPress2Show()}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              地区
            </Text>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
              {item.provinceName}.{item.cityName}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'性别')}}>
          <View style={{padding: 20,height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              性别
            </Text>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
              {item.sex}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8}  style={{height:60,flexDirection:'row'}} >
          <View style={{padding: 20,height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              出生日期
            </Text>
            <View style={{flexDirection: 'row',alignItems:'center',flex:1}}>
              {/* <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
              {item.birthday}
              </Text> */}
                 
                    <TouchableOpacity onPress={this._showDateTimePicker} style={{height: 40,flex:1}}>
                      <Text style={{lineHeight:40,color:'grey',textAlign:'right',marginRight:10}}>{item.birthday}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                    titleIOS="请选择日期"
                    cancelTextIOS='取消'
                    confirmTextIOS='确定'
                   // date={this.state.date}
                    mode="date"
                    maximumDate={new Date()}
                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                      isVisible={this.state.isDateTimePickerVisible}
                      onConfirm={this._handleDatePicked}
                      onCancel={this._hideDateTimePicker}
                    />
                  
                  <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
           
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'个性签名')}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text style={{flex:1}}>
              个性签名
            </Text>
            <View style={{flexDirection: 'row',flex:1,marginLeft:8,justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}} numberOfLines={1} ellipsizeMode='tail'>
                  {item.signature}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'微信账号')}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              微信账号
            </Text>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
                {item.wechat}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} onPress={this.gotoDetail} style={{height:60,flexDirection:'row'}} onPress={() => {this.setModalVisibles(true,'陌陌账号')}}>
          <View style={{padding: 20, height: 60, flex: 1, flexDirection: 'row', justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,
            borderColor:'#c0c0c0',}} >
            <Text>
              陌陌账号
            </Text>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              <Text style={{marginRight:8,height:60,lineHeight:60,color:'gray'}}>
                {item.immomo}
              </Text>
              <ImageBackground source={require('../images/all_icon_arrownext2.png')} style={{width:10,height:20}}>
                    </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
      // }/>
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
      backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
      padding: 10,
      height: 60,
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
      width:30,
      height:30,
    }
  })

 export default Set
