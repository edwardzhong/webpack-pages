import axios from 'axios';

//全局配置
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 20000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

//request拦截器
axios.interceptors.request.use(config => {
	const params = config.method == 'get' ? config.params || {} : config.data || {};
	let token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = token;
	}
	params._t = Math.random();
	return config;
});

//response拦截器
axios.interceptors.response.use(res => {
	if (res.status === 200) {
		if (res.headers.authorization) {
			localStorage.setItem('token', res.headers.authorization);
		}
		if (res.config.url.search(/\/logout/i) > -1) {
			localStorage.removeItem('token');
		}
	}
	return res.data;
});

export const form = (url, data) => {
	return axios({
		headers: { 'Content-Type': 'multipart/form-data;chartset=UTF-8' },
		method: 'post',
		url,
		data,
	});
};
export const get = (url, param) => axios.get(url, param);
export const post = (url, param) => axios.post(url, param);
