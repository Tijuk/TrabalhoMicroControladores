import {
	SignIn,
	SignUp
} from './signInUp'
import Home from './homepage'
import Users from './users'



// export default [
// 	{
// 		path: "/",
// 		Component: Home,
// 	},
// 	{
// 		path: "/home",
// 		Component: Home,
// 	},
// 	{
// 		path: "/login",
// 		Component: SignInUp
// 	},
// 	{
// 		path: "/cadastro",
// 		Component: SignInUp
// 	},
// 	,
// 	{
// 		path: "/users",
// 		Component: SignInUp
// 	}
// ]

export default {
	home: {
		path: "/home",
		Component: Home,
	},
	signIn: {
		path: "/login",
		Component: SignIn,
	},
	signUp: {
		path: "/cadastro",
		Component: SignUp,
	},
	users: {
		path: "/users",
		Component: Users,
	}
}

// [
// 	{
// 		path: "/",
// 		Component: Home,
// 	},
// 	{
// 		path: "/home",
// 		Component: Home,
// 	},
// 	{
// 		path: "/login",
// 		Component: SignInUp
// 	},
// 	{
// 		path: "/cadastro",
// 		Component: SignInUp
// 	},
// 	,
// 	{
// 		path: "/users",
// 		Component: SignInUp
// 	}
// ]