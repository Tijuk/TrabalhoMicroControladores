import React from 'react';
import styled from 'styled-components';
import { color } from '../../assets';

const buttonPresets = {
	nav: {
		bgColor: color.gray.dark,
		color: 'white',
		hoverBgColor: color.gray.light,
		height: '24px',
		padding: '2px 8px',
		margin: '2px',
	},
	login: {
		bgColor: 'red',
		hoverBgColor: 'lightred',
	},
	default: {
		bgColor: 'blue',
		color: 'white',
		hoverBgColor: 'cyan',
		height: '16px',
		padding: '5px',
		borderRadius: '5px',
		margin: '0',
	},
};

const scale = (fs, scaleAmount, defaultTo = '') => {
	if (fs === undefined) {
		return undefined;
	}
	const clean = fs.replace(/px|rem|em|pt/g, '');
	const values = clean.split(/\s/).map(Number).filter(a => !Number.isNaN(a));
	const value = Math.max(...values);

	const dimension = fs.replace(/\d|\./g, '').split(/\s/)[0];
	return `${value * scaleAmount}${dimension}`;
};
const Style = styled.div`
	${props => {
		const style = { ...buttonPresets.default, ...props };

		const fontSize = scale(style.height, 0.875);

		return `
		display: inline-block;
		width: auto;
		color: ${style.color};
		background-color: ${style.bgColor};
		border-radius: ${style.borderRadius};
		font-size: ${fontSize};
		line-height: ${fontSize};
		padding: ${style.padding};
		height: ${style.height};
		margin: ${style.margin};

			&:hover {
				background-color: ${style.hoverBgColor};
				cursor: pointer;
			}
	
		`;
	}} &:focus {
		outline: none;
	}

	&:active {
		outline: none;
	}

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`;

export default function Button(props) {
	const { preset, ...regularProps } = props;

	const type = preset || props.type;

	const styleProps = buttonPresets[type] || buttonPresets.nav;

	return (
		<Style {...styleProps} {...props}>
			{props.content}
		</Style>
	);
}
