import { AsyncStorage } from 'react-native'

function clear() {
  return AsyncStorage.clear()
}
// function getData(key) {
//   console.log(key)
//   return new Promise((resolve, reject) => {
//       AsyncStorage.getItem(key, (error, result) => {
//           if(!error){
//               if(result){
//                   resolve(result)
//               }else{
//                   reject(null)
//               }
//           }else{
//               reject(null)
//           }
//       })
//   })
// }

function get(key, defaultValue = null) {
   console.log(key)
   console.log(defaultValue)
   console.log(AsyncStorage.getItem(key))
  return AsyncStorage.getItem(key).then(
    value => (value !== null ? JSON.parse(value) : defaultValue)
  )
}

function set(key, value) {
  console.log(key)
  console.log(value)
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

function remove(key) {
  return AsyncStorage.removeItem(key)
}

function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {}
    stores.forEach((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1])
    })
    return data
  })
}

function multiRemove(...keys) {
  return AsyncStorage.multiRemove([...keys])
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
  //getData
}
