import React, { useState } from 'react';

import styled, { css } from 'styled-components';
import logo from './logo.svg';
import { withAuth, withLog, withUser } from '../../bridge';
import { color } from '../../assets';
import { Button } from '../../components';

const setAreas = u => ({
	gridTemplateAreas: u ? "'a b c d'" : "'a b c'",
	gridTemplateColumns: u ? '0.1fr 1fr 0.1fr 0.1fr' : '0.1fr 1fr 0.1fr 0.1fr',
});
const setCellArea = x => ({ gridArea: x });

const baseRowStyles = {
	wrap: css`
		display: grid;
		grid-template-columns: 255px 0.3fr;
	`,
	cell: css`
		padding: 5px;
		text-align: center;
		min-width: 160px;
		margin-top: 0px;
		margin-bottom: 0px;
		text-overflow: ellipsis;

		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box; /* Opera/IE 8+ */
	`,
};

const _ = {
	container: styled.div`
		margin-top: 50px;
		width: 80%;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	`,
	table: {
		wrap: styled.div`margin: auto;`,
		rows: {
			wrap: styled.div`${baseRowStyles.wrap};`,
			cell: styled.p`
				${baseRowStyles.cell};
				font-size: 16px;
			`,
		},
		body: styled.div`
			overflow-y: auto;
			max-height: calc(100vh - 141px);
		`,
		header: {
			wrap: styled.div`
				${baseRowStyles.wrap};
				text-transform: uppercase;
			`,
			cell: styled.p`${baseRowStyles.cell} border-collapse: collapse;`,
		},
	},
};

export default function Home(props) {
	const auth = withAuth();
	const log = withLog();
	const users = withUser();

	const [state, setState] = useState({
		log: new Array(25).fill(0).map((_, index) => ({
			timestamp: '22:00:00',
			user: `uuid_${Math.random().toFixed(index + 1).replace(/\D/g, '')}`,
			metodo: 'RFID',
			uuid: `uuid_${Math.random().toFixed(6).replace(/\D/g, '')}`,
		})),
		user: auth.getUser(),
	});

	const isAdmin = true; // state.user.type === 'admin';

	function header() {
		const blank = ' ';
		return (
			<_.table.header.wrap style={setAreas(isAdmin)}>
				<_.table.header.cell style={setCellArea('a')}>timestamp</_.table.header.cell>
				<_.table.header.cell style={setCellArea('b')}>nome</_.table.header.cell>
				<_.table.header.cell style={setCellArea('c')}>método</_.table.header.cell>
				{isAdmin &&
					<_.table.header.cell style={setCellArea('d')}>
						{blank}
					</_.table.header.cell>}
			</_.table.header.wrap>
		);
	}

	function Row(entry, index) {
		const base_key = `tableRowCell_${entry.uuid}_${index}`;
		const kkcols = [entry.timestamp, entry.user, entry.metodo];
		const areas = ['a', 'b', 'c'];
		let cols = kkcols.map((cell, cell_index) =>
			<_.table.rows.cell
				key={`${base_key}_${cell_index}`}
				style={{ ...setCellArea(areas[cell_index]), ...(cell_index === 1 ? { textAlign: 'left' } : {}) }}
			>
				{cell}
			</_.table.rows.cell>
		);
		if (isAdmin) {
			cols = cols.concat([
				<_.table.rows.cell key={`${base_key}_delete_entry`} style={setCellArea('d')}>
					<Button
						content="Deletar"
						onClick={() => {
							log.delete(
								entry.uuid,
								() => {
									setState(state => ({ ...state, log: state.log.filter((_, i) => i !== index) }));
								},
								() => console.error('fuck')
							);
						}}
					/>
				</_.table.rows.cell>,
			]);
		}
		return (
			<_.table.rows.wrap style={setAreas(isAdmin)}>
				{cols}
			</_.table.rows.wrap>
		);
	}

	return (
		<_.container>
			<_.table.wrap>
				{header()}
				<_.table.body>
					{state.log.map((a, i) => Row(a, i))}
				</_.table.body>
			</_.table.wrap>
		</_.container>
	);
}
