import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const host = window.location.host;
const ishttps = document.location.protocol;
const contextPath = 'admin';
const urls =
	process.env.NODE_ENV !== 'development' ?
		// `${ishttps}//${host}/${contextPath}` :
		`http://117.72.33.74/nblog` :
		'http://localhost:8090/nblog';
// `http://117.72.33.74/nblog`
const request = axios.create({
	baseURL: urls,
	timeout: 10000,
})


// 请求拦截
request.interceptors.request.use(
	config => {
		NProgress.start()
		const identification = window.localStorage.getItem('identification')
		//identification存在，且是基于baseURL的请求
		console.log(identification && !(config.url.startsWith('http://') || config.url.startsWith('https://')), "identification && !(config.url.startsWith('http://') || config.url.startsWith('https://'))")
		if (identification && !(config.url.startsWith('http://') || config.url.startsWith('https://'))) {
			config.headers.identification = identification
		}
		return config
	}
)

// 响应拦截
request.interceptors.response.use(
	config => {
		NProgress.done()
		const identification = config.headers.identification
		if (identification) {
			//保存身份标识到localStorage
			window.localStorage.setItem('identification', identification)
		}
		return config.data
	}
)

export default request