import React, { useState } from 'react';

import styled from 'styled-components';
import { withAuth, withLog, withUser } from '../../bridge';
import { Button, Table, Input } from '../../components';


export default function Home(props) {
	const auth = withAuth();
	const users = withUser();

	const [state, setState] = useState({
		users: new Array(25).fill(0).map((_, index) => ({
			uuid: `uuid_${Math.random().toFixed(6).replace(/\D/g, '')}`,
			name: `name_${Math.random().toFixed(index + 1).replace(/\D/g, '')}`,
		})),
		user: auth.getUser()
	});

	if (state.user.type !== 'admin') {
		props.redirect('/')
	}

	const headers = ['UUID', 'Nome', ' '];
	let matrix = state.users.map(_user => [_user.uuid, _user.name, <Button
		onClick={() => {
			users.delete(_user.uuid, () => {
				setState(state => ({ ...state, users: state.users.filter(__user => __user.uuid !== _user.uuid) }));
			});
		}}
		content="Deletar"
	/>]);
	// let sizing = ['0.1fr', '2fr', '0.1fr'];

	return <>
		<Table headers={headers} matrix={matrix}/>
	</>;
}
