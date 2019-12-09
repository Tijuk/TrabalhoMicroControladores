import initAPI from './apiService'
import {
	User
} from '../model'

const debuging = true

const print = debuging ? console.log : (...args) => {}

export const withAuth = () => {
	const api = initAPI({
		baseRoute: 'auth'
	})

	const login = async (name, password, onSuccess, onFailure) => {
		const successWrapp = (response) => {
			localStorage.setItem('token', response.token)
			localStorage.setItem('user', JSON.stringify(response.data))
			onSuccess(response)
		}
		await api.post("login", {
			name,
			password
		}, successWrapp, onFailure)
	}
	const logout = async (onSuccess, onFailure) => {
		const successWrapp = (response) => {
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
	const api = initAPI({
		baseRoute: 'user'
	})

	return {
		create: async (userData, onSuccess, onFailure) => {
			await api.post('create', userData, user => onSuccess(User(user)), onFailure)
		},
		delete: async (userUuid, onSuccess, onFailure) => {
			await api.delete(`delete/${userUuid}`, user => onSuccess(User(user)), onFailure)
		}
	}
}