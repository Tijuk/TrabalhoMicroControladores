import React from 'react';
import styled from 'styled-components';
import { Input, Button } from '../../components';
import { withSignIn, withSignUp } from './form';
import { withAuth } from '../../bridge';

const auth = withAuth();

const _ = {
	button: styled.div`
		margin-top: 20px;
		display: flex;
		justify-content: center;
	`,
	form: styled.form`
		width: 50%;
		margin: auto;
	`,
};

function baseForm(props) {
	if (auth.guard()) {
		props.redirect('/');
	}

	function FormInput(key, label, errorMessage) {
		return (
			<Input
				label={label}
				type={key === 'password' ? key : 'text'}
				name={key}
				onChange={props.handleChange}
				onBlur={props.handleBlur}
				value={props.values[key]}
				error={props.errors[key] && props.touched[key] ? errorMessage || props.errors[key] : undefined}
			/>
		);
	}

	function getType() {
		return window.location.pathname === 'login' ? 'signIn' : 'signUp';
	}

	return {
		FormInput,
		getType,
	};
}

const SignInForm = props => {
	const base = baseForm(props);

	return (
		<_.form onSubmit={props.handleSubmit}>
			{base.FormInput('_name', 'Nome:')}
			{base.FormInput('_password', 'Senha: ')}
			<_.button>
				<Button onClick={props.handleSubmit} type="submit" content="Enviar" />
			</_.button>
		</_.form>
	);
};

const SignUpForm = props => {
	const base = baseForm(props);

	console.log(props.values);

	return (
		<_.form onSubmit={props.handleSubmit}>
			{base.FormInput('_name', 'Nome:')}
			{base.FormInput('_password', 'Senha: ')}
			{base.FormInput('_rfid', 'RFID: ', 'RFID tem que ser um dos seguinte valores: Sim, Não')}
			<_.button>
				<Button onClick={props.handleSubmit} type="submit" content="Enviar" />
			</_.button>
		</_.form>
	);
};

export const SignIn = withSignIn(SignInForm);
export const SignUp = withSignUp(SignUpForm);
