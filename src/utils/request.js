import axios from 'axios';
import store from '../store';
import env from '../config/env';
// import { getToken } from './auth'

const ajaxUrl = env === 'development' ?
    'http://' + location.hostname + ':' + '8888' + '/zhyxcs/api':
    env === 'production' ?
        'http://' + location.host + '/zhyxcs/api' :
        'https://debug.url.com';

// create an axios instance
const service = axios.create({
    // baseURL: 'http://' + location.host + '/api', // api的base_url
    baseURL: ajaxUrl, // api的base_url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //     config.headers['X-Token'] = getToken(); // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
})

// respone interceptor
service.interceptors.response.use(
  response => {
      /**
       * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
       * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
       */
      const res = response.data;
      console.log('type:' + typeof (res));
      if (res.code && res.code !== 20000) {
          // Message({
          //   message: res.message,
          //   type: 'error',
          //   duration: 5 * 1000
          // });
          // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
          if (res.code === 8848) {
              // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              //   confirmButtonText: '重新登录',
              //   cancelButtonText: '取消',
              //   type: 'warning'
              // }).then(() => {
              //   store.dispatch('FedLogOut').then(() => {
              //     location.reload();// 为了重新实例化vue-router对象 避免bug
              //   });
              // });

              store.commit('CLEAR_INFO');

              location.reload();

          }
          return Promise.reject('error');
      } else {
          return response;
      }
  },
  error => {
      console.log('err' + error); // for debug
      // Message({
      //     message: error.message,
      //     type: 'error',
      //     duration: 5 * 1000
      // });

      return Promise.reject(error);
  }
);

export default service;
