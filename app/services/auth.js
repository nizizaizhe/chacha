import { delay } from '../utils'
import NetUtil from './../utils/NetUtil'

export const puburl = 'http://192.168.0.108:8080/'
export const login = async (param) => {
  try {
    const value1 = await fetch(`${puburl}chacha-web/chacha/user/login/`,{
      method: 'POST',
      headers:'',
      body:JSON.stringify(param)
     })
     const value2 = await value1.json()
     value2 = value2.status == 200 ? value2 : false
     console.log(value2)
    return value2
  } catch(e) {
    console.log(e)
    return false
  }
}
