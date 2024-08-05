import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
const host = window.location.host;
const ishttps = document.location.protocol;
const contextPath = 'nblog/admin';
const urls =
    process.env.NODE_ENV !== 'development' ?
    `${ishttps}//${host}/${contextPath}` :
    'http://localhost:8090/' + contextPath;
// : 'http://show160.linkdood.cn/' + contextPath;
// const urls = 'http://192.168.8.9:8090/salary';
const request = axios.create({
    // baseURL: 'http://localhost:8090/admin/',
    baseURL: urls,
    timeout: 5000
})

let CancelToken = axios.CancelToken

// 请求拦截
request.interceptors.request.use(config => {
        //对于访客模式，除GET请求外，都拦截并提示
        const userJson = window.localStorage.getItem('user') || '{}'
        const user = JSON.parse(userJson)
        if (userJson !== '{}' && user.role !== 'ROLE_admin' && config.method !== 'get') {
            config.cancelToken = new CancelToken(function executor(cancel) {
                cancel('演示模式，不允许操作')
            })
            return config
        }

        NProgress.start()
        const token = window.localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => {
        console.info(error)
        return Promise.reject(error)
    }
)

// 响应拦截
request.interceptors.response.use(response => {
        NProgress.done()
        const res = response.data
        if (res.code !== 200) {
            let msg = res.msg || 'Error'
            Message.error(msg)
            return Promise.reject(new Error(msg))
        }
        return res
    },
    error => {
        console.info(error)
        Message.error(error.message)
        return Promise.reject(error)
    }
)

export default request