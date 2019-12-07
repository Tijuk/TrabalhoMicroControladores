import React from 'react'


export default function CondRender(props) {
	const { user } = props

	if(props.admin && user.type === 'admin') {
		return props.children
	}

	if(props.regular && user.type === "regular") {
		return props.children
	}

	return null

} 


