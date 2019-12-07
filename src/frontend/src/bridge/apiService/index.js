import ax from 'axios'

const debugging = true

const print = debugging ? console.log : ((a, b = "") => {})

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

const base_axios = ax.create({
	baseURL: 'localhost:8000/api/',
	headers: {
		Authorization: {
			toString() {
				return `Bearer ${localStorage.getItem('token')}`
			}
		},
		'Content-Type': 'application/json'
	}
})

const mock_axios = {
	post: async (route, args) => {
		print(`mocking post on route ${route} with args: `, args);
		return await wait(500, {
			token: 'ijio2n2junf12uinf13',
			user: {
				name: "Joao",
				uuid: "ohdauhda",
				type: "admin"
			}
		})
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

const axios = debugging ? mock_axios : base_axios

const __nothing__ = (...args) => {}

const _ = {
	parse: (response, callback) => {
		if (debugging) {
			callback(response ? response.data : response)
		} else {
			callback(response.data)
		}
	},
	dispatchCallback: (response, onSuccess, onError) => {
		console.log('dispatch', response)
		try {
			if ([500, 501].includes(response.data.status)) {
				console.warn('Calling on success')
				console.log(onSuccess)
				onSuccess(response.data.data)
			} else {
				console.error(response)
				onError(response.data.data)
			}
		} catch (e) {
			console.error(`Catched...`, response)
			console.log('-='.repeat(20) + "-")
			console.error(e)
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
		} catch {
			_.parse(null, onError)
		}
	}

	const get = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling get on route: ${route}`)
			const response = await axios.post(`${baseRoute}${route}`)

			_.dispatchCallback(response, onSuccess, onError)

		} catch {
			_.parse(null, onError)
		}
	}

	const put = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling put on route: ${route}`)
			const response = await axios.put(`${baseRoute}${route}`)

			_.dispatchCallback(response, onSuccess, onError)

		} catch {
			_.parse(null, onError)
		}
	}

	const del = async (route, onSuccess, onError = __nothing__) => {
		try {
			print(`Calling delete on route: ${route}`)
			const response = await axios.delete(`${baseRoute}${route}`)

			_.dispatchCallback(response, onSuccess, onError)

		} catch {
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