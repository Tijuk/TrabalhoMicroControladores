import ax from 'axios'

const debugging = true

const print = debugging ? console.log : ((a, b = "") => { })

function wait(ms, callback) {
	return new Promise(res => {
		print(res);
		setTimeout(() => res({
			data: {
				data: callback || {},
				status: 501
			}
		}), ms);
	})
}

const getHeaders = () => {
	const token = localStorage.getItem('token')
	if (token) {
		return {
			Authorization: {
				toString() {
					return `Bearer ${localStorage.getItem('token')}`
				}
			}
		}
	}
	return {

	}
}

const base_axios = ax.create({
	baseURL: 'http://127.0.0.1:5000',
	headers: {
		...getHeaders(),
		"Access-Control-Allow-Origin": "http://127.0.0.1:5000",
		'Content-Type': 'application/json'
	}
})

const mock_axios = {
	post: async (route, args) => {
		print(`mocking post on route ${route} with args: `, args);
		return await wait(500
			// 	, debugging && {
			// 	token: 'ijio2n2junf12uinf13',
			// 	user: {
			// 		name: "Joao",
			// 		uuid: "ohdauhda",
			// 		type: "admin"
			// 	}
			// }
		)
	},
	get: async (route) => {
		print(`mocking get on route ${route}`);
		return await wait(500)
	},
	put: async (route) => {
		print(`mocking put on route ${route}`);
		return await wait(500)
	},
	delete: async (route) => {
		print(`mocking delete on route ${route}`);
		return await wait(500)
	}
}

const axios = base_axios // debugging ? mock_axios : base_axios

const __nothing__ = (...args) => { }

const _ = {
	parse: (response, callback) => {
		if (debugging) {
			callback(response ? response.data : response)
		} else {
			callback(response.data)
		}
	},
	dispatchCallback: (response, onSuccess, onError) => {
		const data = response.data
		console.warn('Response: ', response)
		try {
			if (data.status === 200 || data.status === 201) {
				console.warn('Calling on success')
				onSuccess(data.data)
			} else {
				console.error(data)
				onError(data.data)
			}
		} catch (error) {
			console.error(error)
			console.error(`Catched...`, data)
			console.log('-='.repeat(20) + "-")
			console.error(error)
			onSuccess({})
		}
	}
}

function init(configs) {
	const baseRoute = configs.baseRoute ? `${configs.baseRoute}/` : ""

	const post = async (route, args, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling post on route: ${route}, with args: `, args)
			const response = await axios.post(`${baseRoute}${route}`, args)

			_.dispatchCallback(response, onSuccess, onError)
		} catch (error) {
			console.error(error)
			_.parse(null, onError)
		}
	}

	const get = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling get on route: ${route}`)
			const response = await axios.post(`${baseRoute}${route}`)
			print(`Response:`, response)
			_.dispatchCallback(response, onSuccess, onError)

		} catch (error) {
			console.error(error)
			_.parse(null, onError)
		}
	}

	const put = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling put on route: ${route}`)
			const response = await axios.put(`${baseRoute}${route}`)
			print(`Response:`, response)
			_.dispatchCallback(response, onSuccess, onError)

		} catch (error) {
			console.error(error)
			_.parse(null, onError)
		}
	}

	const del = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling delete on route: ${route}`)
			const response = await axios.delete(`${baseRoute}${route}`)
			print(`Response:`, response)
			_.dispatchCallback(response, onSuccess, onError)

		} catch (error) {
			console.error(error)
			_.parse(null, onError)
		}
	}

	return {
		post,
		get,
		put,
		delete: del
	}
}

export default init