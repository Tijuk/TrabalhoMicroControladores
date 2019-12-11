import initAPI from './apiService'
import {
	User
} from '../model'

const debuging = true

const print = debuging ? console.log : (...args) => { }

export const withAuth = () => {
	const api = initAPI({
		baseRoute: 'auth'
	})

	const login = async (name, password, onSuccess, onFailure) => {
		const successWrapp = (response) => {
			console.error("__Token: ", response.token)
			console.error("__Data: ", response.data)
			localStorage.setItem('token', response.token)
			localStorage.setItem('user', JSON.stringify(response.user))

			console.error(localStorage.getItem('user'))
			onSuccess(response)
		}
		await api.post("login", {
			name,
			password
		}, successWrapp, onFailure)
	}
	const logout = async (onSuccess, onFailure) => {

		console.warn("Token: ", localStorage.getItem('token'))
		const successWrapp = (response) => {
			console.warn(response)
			localStorage.clear()
			onSuccess(response)
		}
		await api.post(`logout`, {}, successWrapp, onFailure)
	}

	const guard = () => {
		return Boolean(localStorage.getItem('token'))
	}

	const getUser = () => {
		const localUser = localStorage.getItem('user')
		// console.log("Loaded local user = ", localUser)
		// let parsed = undefined
		// if (typeof localUser === 'string') {
		// 	parsed = JSON.parse(localUser)
		// }
		// if (localUser) {
		// 	return {
		// 		name: parsed.name,
		// 		uuid: parsed.uuid,
		// 		type: parsed.type,
		// 		isAuthenticated: true
		// 	}
		// } else {
		// 	return {
		// 		isAuthenticated: false
		// 	}
		// }
		return JSON.parse(localUser)
	}

	return {
		login,
		logout,
		guard,
		getUser
	}

}

export const withLog = () => {
	const api = initAPI({
		baseRoute: 'log'
	})


	const fetchAll = () => {

	}

	const del = async (log_uuid, onSuccess, onFailure) => {
		await api.delete(`remove/${log_uuid}`, onSuccess, onFailure)
	}

	return {
		fetchAll,
		delete: del
	}

}

export const withUser = () => {
	const auth = withAuth();

	const api = initAPI({
		baseRoute: 'users'
	})

	return {
		create: async (parsed, onSuccess, onFailure) => {
			const successWrap = (user) => {
				console.warn('Usuário criado')
				auth.login(parsed.name, parsed.password, () => onSuccess(User(user)), onFailure)
			}
			await api.post('create', parsed, successWrap, onFailure)
		},
		delete: async (userUuid, onSuccess, onFailure) => {
			await api.delete(`delete/${userUuid}`, user => onSuccess(User(user)), onFailure)
		}
	}
}