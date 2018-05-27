
//const REGION_URL = 'https://raw.githubusercontent.com/beefe/react-native-picker/master/example/PickerTest/area.json'
const REGION_URL = 'http://192.168.0.108:8080/chacha-web/chacha/user/province/getProvince/'

const webRegionAPI = () => {
  return new Promise((resolve, reject) => {
    fetch(REGION_URL)
      .then((response) => response.json())
      .then((area) => {
        resolve(area)
      }).catch(err => reject(err))
  })
}
export default webRegionAPI;
