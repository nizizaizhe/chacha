import { DeviceEventEmitter} from 'react-native'
import { createAction, NavigationActions, Storage } from '../utils'
import * as authService from '../services/auth'
import { Toast} from 'native-base'
export default {
  namespace: 'app',
  state: {
    login: false,
    loading: false,
    fetching: false,
    userid:'',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *loadStorage(action, { call, put }) {
      console.log(action)
      const login = yield call(Storage.get, 'login', false)
      yield put(createAction('updateState')({ login, loading: false }))
      console.log(login)
       DeviceEventEmitter.emit('ChangeUi',{})
    },
    *login({ payload }, { call, put }) {
      console.log(payload)
      yield put(createAction('updateState')({ fetching: true }))
      const login = yield call(authService.login, payload)
      console.log(login)
      if (login) {
        // yield put(
        //   // NavigationActions.reset can't use at react-navigation 2.0.1
        //   // should use StackActions, but now is ineffective
        //   NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'HomeNavigator'})],
        //   })
        // )
        // yield NavigationActions.setParams({
        //   params: undefined
        // })
        // Toast.show({
        //   text: "登录成功",
        //   textStyle: { color: "yellow",textAlign:'center' },
        //   position:'top'
        // })
        if(payload.reg === 'true'){
           const {returnKey} = payload
           yield put(NavigationActions.back({
              key: returnKey
          }))
        }else{
          yield put(NavigationActions.back({
            
          }))
        }
       
      }else{
        Toast.show({
          text: "登录失败，请重新登录",
          textStyle: { color: "yellow",textAlign:'center' },
          position:'top'
        })
      }
      yield put(createAction('updateState')({ login, fetching: false }))
      Storage.set('login', login)
    },
    *logout(action, { call, put }) {
      yield call(Storage.set, 'login', false)
      yield put(createAction('updateState')({ login: false }))
      yield put(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'HomeNavigator'})],
        })
      )
    },
    *userid({ payload }, { put }) {
      yield put(createAction('updateState')({ userid: payload.userid }))
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
