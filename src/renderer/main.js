import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import https from 'https'
import qs from 'querystring'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false


// const param = qs.stringify({
//   'grant_type': 'client_credentials',
//   'client_id': 'MEmamWlWBsfOI9qENpdczxTw',
//   'client_secret': 'H3skvIYrTm9t1V8Rxhc767sy5a1Qw8BB'
// });
//
// https.get(
//   {
//     hostname: 'aip.baidubce.com',
//     path: '/oauth/2.0/token?' + param,
//     agent: false
//   }, (res) => {
//     // 在标准输出中查看运行结果
//     res.pipe(process.stdout)
//     res.on('data', (data) => {
//       window.info = JSON.parse(data.toString())
//     })
//   }
// )

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
