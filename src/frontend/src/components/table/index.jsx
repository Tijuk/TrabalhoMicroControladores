import React, { useState } from 'react';
import { color } from '../../assets';
import styled, { css } from 'styled-components';

const setAreas = u => ({
	gridTemplateAreas: u ? "'a b c d'" : "'a b c'",
	gridTemplateColumns: u ? '0.1fr 1fr 0.1fr 0.1fr' : '0.1fr 1fr 0.1fr 0.1fr',
});
const setCellArea = x => ({ gridArea: x });

// grid-template-areas: ${props => "'" + new Array(props.cols).fill(0).map((_, i) => `area_${i + 1}`) + "'"};

const baseRowStyles = {
	wrap: styled.div`
		display: grid;
		grid-template-areas: ${props => "'" + props.sizing.map((_, i) => `area_${i}`).join(' ') + "'"};
		grid-template-columns: ${props => props.sizing.join(' ')};
	`,
	cell: styled.div`
		padding: 5px 20px;
		text-align: center;
		min-width: 160px;
		margin: auto;
		text-overflow: ellipsis;
		grid-area: ${props => 'area_' + props.area};

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
			wrap: styled(baseRowStyles.wrap)`
				transition: all 0.3s ease 0s;
				border-radius: 10px;

				&:hover {
					background-color: ${color.gray.regular};
				}
			`,
			cell: styled(baseRowStyles.cell)`
				font-size: 16px;
			`,
		},
		body: styled.div`
			overflow-y: auto;
			max-height: calc(calc(100vh - 141px) - ${props => props.offset || '0px'});
		`,
		header: {
			wrap: styled(baseRowStyles.wrap)`
				text-transform: uppercase;
			`,
			cell: styled(baseRowStyles.cell)`
				border-collapse: collapse;
			`,
		},
	},
};

export default function Table({ headers, matrix, sizing, offset }) {
	const nRows = matrix.length;
	const nCols = headers.length;

	sizing = sizing || new Array(nCols).fill('1fr');

	function Header() {
		return (
			<_.table.header.wrap sizing={sizing}>
				{headers.map((h, index) =>
					<_.table.header.cell area={index}>
						{h}
					</_.table.header.cell>
				)}
			</_.table.header.wrap>
		);
	}

	function Row(entry, index) {
		const base_key = `tableRowCell_${JSON.stringify(entry.filter(a => typeof a === 'string'))}_${index}`;
		if (entry.length > nCols) {
			entry.push(...new Array(entry.length - nCols).fill(' '));
		}
		return (
			<_.table.rows.wrap sizing={sizing}>
				{entry.map((cell, cell_index) =>
					<_.table.rows.cell area={cell_index} key={`${base_key}_${cell_index}`}>
						{cell}
					</_.table.rows.cell>
				)}
			</_.table.rows.wrap>
		);
	}

	return (
		<_.container>
			<_.table.wrap>
				{Header()}
				<_.table.body offset={offset}>
					{matrix.map((a, i) => Row(Object.values(a), i))}
				</_.table.body>
			</_.table.wrap>
		</_.container>
	);
}
