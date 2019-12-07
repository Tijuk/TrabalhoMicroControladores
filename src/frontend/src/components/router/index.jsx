import React from 'react';
import styled from 'styled-components';

const Body = styled.div`
	width: 100%;
	height: 100%;
	max-height: calc(100vh - 48px);
`;

export default function Router(props) {
	const { routes, provider } = props;

	const defaultTo = routes.home.Component;

	console.log(routes);

	let ToRender = defaultTo;
	Object.entries(routes).forEach(([key, routeData]) => {
		if (window.location.pathname === routeData.path) {
			// console.clear()
			console.log(`Rendering: ${key}`, routeData);
			ToRender = routeData.Component;
		}
	});

	return (
		<Body>
			<ToRender {...provider} />
		</Body>
	);

	// return <div>{routes.map(RouteData => {
	// 	return (
	// 		<Route key={`app_route_09581928_${RouteData.path}`} path={RouteData.path}>
	// 			<RouteData.Component {...provider}/>
	// 		</Route>
	// 	)
	// })}</div>
}
