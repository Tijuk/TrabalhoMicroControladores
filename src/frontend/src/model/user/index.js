export default function User(userData) {

	function isAuthenticated() {
		return Boolean(localStorage.getItem('token'))
	}

	return {
		name: userData.name,
		uuid: userData.uuid,
		type: userData.type,
		isAuthenticated
	}
}