import * as Yup from 'yup';
import { withFormik } from 'formik';
import { withAuth, withUser } from '../../../bridge';

Yup.setLocale({
	mixed: {
		required: 'Esse campo é obrigatório',
	},
	string: {
		min: 'Número insuficiente de caracteres',
		max: 'Número de caracteres excedido',
		length: 'Número de caracteres insuficiente',
		matches: 'Formato inválido',
		email: 'Email inválido',
	},
});

export function withForm(type) {
	const getInitialValues = () => {
		const base = {
			_name: '',
			_password: '',
		};
		return type === 'signIn' ? base : { ...base, _rfid: '' };
	};

	const getValidation = () => {
		const baseShape = {
			// _name: Yup.string().min(2).required(),
			// _password: Yup.string().min(6).required(),
		};
		return type === 'signIn'
			? baseShape
			: {
					...baseShape,
					_rfid: Yup.string().oneOf(['Sim', 'Não']).required(),
				};
	};

	const auth = withAuth();
	const user = withUser();

	return withFormik({
		mapPropsToValues: () => getInitialValues(type),
		validationSchema: Yup.object().shape(getValidation(type)),
		handleSubmit: (values, formikProps) => {
			const props = formikProps.props;
			console.error(window.location.pathname);
			if (window.location.pathname === '/login') {
				auth.login(
					values._name,
					values._password,
					() => {
						props.redirect('/');
					},
					e => {
						props.updateGlobalError(e && e.message);
					}
				);
			} else {
				user.create(
					{
						name: values._name,
						password: values._password,
						rfid: values._rfid,
					},
					() => {
						props.redirect('/');
					},
					e => {
						props.updateGlobalError(e && e.message);
					}
				);
			}
		},
	});
}

export const withSignIn = Component => {
	console.log(Object.keys(Component));
	return withForm('signIn')(Component);
};
export const withSignUp = Component => {
	console.log(Component);
	return withForm('signUp')(Component);
};

export default withFormik({
	mapPropsToValues: () => ({ name: '' }),

	// Custom sync validation
	validate: values => {
		const errors = {};

		if (!values.name) {
			errors.name = 'Required';
		}

		return errors;
	},

	handleSubmit: (values, { setSubmitting }) => {
		setTimeout(() => {
			alert(JSON.stringify(values, null, 2));
			setSubmitting(false);
		}, 1000);
	},

	displayName: 'BasicForm',
});
