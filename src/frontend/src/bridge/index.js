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
			console.error(response.token)
			console.error(response.data)
			localStorage.setItem('token', response.token)
			localStorage.setItem('user', JSON.stringify(response.data))

			console.error(localStorage.getItem('user'))
			onSuccess(response)
		}
		await api.post("login", {
			name,
			password
		}, successWrapp, onFailure)
	}
	const logout = async (onSuccess, onFailure) => {
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
		console.log("Loaded local user = ", localUser)
		let parsed = undefined
		if (!localUser) {
			parsed = JSON.parse(localUser)
		}
		return User(parsed || {
			name: "Joao",
			uuid: "ohdauhda",
			type: "admin"
		})
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
		create: async (userData, onSuccess, onFailure) => {
			const successWrap = (user) => {
				console.warn('Usuário criado')
				auth.login(userData.name, userData.password, () => onSuccess(User(user)), onFailure)
			}
			await api.post('create', userData, successWrap, onFailure)
		},
		delete: async (userUuid, onSuccess, onFailure) => {
			await api.delete(`delete/${userUuid}`, user => onSuccess(User(user)), onFailure)
		}
	}
}