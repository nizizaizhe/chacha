import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    Platform,
    AsyncStorage
} from 'react-native'
 
class NetUtil extends React.Component{
    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url,params,callback){
        if (params) {
            let paramsArray = []
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        //fetch请求
        fetch(url,{
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            callback(responseJSON)
        }) .done()
    }
    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url,params,headers,callback){
        //fetch请求
        fetch(url,{
            method: 'POST',
            headers:headers,
            body:JSON.stringify(params)
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                callback(responseJSON)
            }) .done()
    }
}
export const imgurl = 'http://192.168.0.101:9327/img/'
export const uploadimgurl = 'http://192.168.0.101:9127/upload/img/'
export const puburl = 'http://192.168.0.108:8080/'  
export  default NetUtil