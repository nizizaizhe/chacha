import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing,YellowBox } from 'react-native'
// import SplashScreen from "rn-splash-screen"
import {  Storage } from './utils'
import { Root } from "native-base"
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions,
} from 'react-navigation'
import {
  initializeListeners,
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'

import Loading from './containers/Loading'
import Login from './containers/Login'
import Home from './containers/Home'
import Friend from './containers/Friend'
import Account from './containers/Account'
import Detail from './containers/Detail'
import Set from './containers/Set'
import Reg from './containers/Reg'
import Regpass from './containers/Regpass'
import Wanshan from './containers/Wanshan'
import ForgetPass from './containers/ForgetPass'
import ResetPass from './containers/ResetPass'
import Xieyi from './containers/Xieyi'


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])
const HomeNavigator = TabNavigator(
  {
    Home: { screen: Home },
    Friend:{screen:Friend},
    Account: { screen: Account },
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: false,
    indicatorStyle:{
      opacity:0,
      height:0
    },
    tabStyle:{
      padding:0
    }
  }
)

const MainNavigator = StackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    Detail: { screen: Detail },
    Set:{screen: Set },
    Login: { screen: Login },
    Reg: {screen: Reg},
    Regpass: {screen: Regpass },
    Wanshan:{screen: Wanshan },
    ForgetPass:{screen:ForgetPass},
    ResetPass:{screen:ResetPass},
    Xieyi:{screen:Xieyi},
  },
  {
    headerMode: 'float',
    // initialRouteParams: {initPara: '初始页面参数'},
  }
)

const AppNavigator = StackNavigator(
  {
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)
const addListener = createReduxBoundAddListener('root')

@connect(({ app, router }) => ({ app, router }))
class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentDidMount() {
    console.disableYellowBox = true
    console.warn('YellowBox is disabled.')
    initializeListeners('root', this.props.router)
    // SplashScreen.hide()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const { dispatch, app, router } = this.props
    if (app.loading) return <Loading />
   
    const navigation = {
      dispatch,
      state: router,
      addListener,
    }
    console.log(Storage.get('login'))
    console.log(app)
    return <Root><AppNavigator navigation={navigation} screenProps={{login:app.login}}/> </Root>
  }
}

export function routerReducer(state, action = {}) {
  
  return AppNavigator.router.getStateForAction(action, state)
}
// const defaultGetStateForAction = FirstApp.router.getStateForAction;  
  
// FirstApp.router.getStateForAction = (action, state) => {  
//     //页面是MeScreen并且 global.user.loginState = false || ''（未登录）  
//     if (action.routeName ==='MeScreen'&& !global.user.loginState) {  
//         this.routes = [  
//             ...state.routes,  
//             {key: 'id-'+Date.now(), routeName: 'Login', params: { name: 'name1'}},  
//         ];  
//         return {  
//             ...state,  
//             routes,  
//             index: this.routes.length - 1,  
//         };  
//     }  
//     return defaultGetStateForAction(action, state);  
// };  

export default Router
