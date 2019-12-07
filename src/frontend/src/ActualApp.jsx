import React, { useState, useEffect } from 'react';
import * as Style from './appStyle';
import routes from './scenes/routes';

import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';

import { Header, Router } from './components';

function App() {
	const [state, setState] = useState({});
	const [globalError, setGlobalError] = useState();

	const provider = {
		redirect: to => {
			if (state.redirect === undefined && window.location.pathname !== to) {
				console.log(`Redirecting to: ${to}`);

				setState(state => ({ ...state, redirect: to }));
			}
		},
		location: window.location.pathname,
		globalError: state.globalError,
		updateGlobalError: ge => setState(state => ({ ...state, globalError: ge })),
	};

	useEffect(
		() => {
			if (state.redirect) {
				setState({ ...state, redirect: undefined });
			}
		},
		[state.redirect]
	);

	useEffect(
		() => {
			if (window.location.pathname === '/') {
				provider.redirect('/home');
			}
		},
		[window.location.pathname]
	);

	return (
		<Style.app>
			<BrowserRouter>
				<Header {...provider} />
				<Style.body>
					<Router provider={provider} routes={routes} />
				</Style.body>
				{state.redirect ? <Redirect to={state.redirect} /> : null}
			</BrowserRouter>
		</Style.app>
	);
}

export default App;
