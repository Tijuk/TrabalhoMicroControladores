import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { color } from '../../assets';

const underSize = 24;
const errorFontSize = 12;

const C = {
	container: styled.div``,
	label: styled.p`
		margin: 0px;
		margin-right: auto;
		color: ${color.gray.white};
		font-size: 20px;
		line-height: 20px;
		margin-bottom: 5px;
	`,
	input: styled.input`
		color: ${color.gray.superlight};
		background: ${color.gray.regular};
		width: 100%;
		border-style: solid;
		border-left: none;
		border-right: none;
		border-top: none;
		font-size: 24px;
		line-height: 16px;
		padding: 5px;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box; /* Opera/IE 8+ */
		transition: all 0.3s ease 0s;

		border-color: ${color.gray.light};
		border-width: 2px;
		margin-bottom: 2px;

		&:focus {
			outline: none;

			color: ${color.gray.white};
			border-color: ${color.gray.white};
			border-width: 4px;
			margin-bottom: 0px;
		}
	`,
	error: styled.p`
		margin: 0px;
		margin-top: 4px;
		margin-bottom: ${underSize - errorFontSize - 4}px;
		color: ${color.red.error};
		font-size: ${errorFontSize}px;
		line-height: ${errorFontSize}px;
	`,
	empty: styled.div`
		height: ${underSize}px;
		width: 5px;
	`,
};

export default function Input(props) {
	const { label, error, ...inputProps } = props;

	const pick = (obj, keys) => {
		const out = {};
		Object.entries(obj).forEach(([key, value]) => {
			if (keys.includes(key)) {
				out[key] = value;
			}
		});
		return out;
	};

	const finalInputProps = pick(inputProps, ['value', 'onBlur', 'onChange', 'name', 'type']);

	return (
		<C.container>
			<C.label>
				{label}
			</C.label>
			<C.input {...finalInputProps} />
			{error
				? <C.error>
						{error}
					</C.error>
				: <C.empty />}
		</C.container>
	);
}
