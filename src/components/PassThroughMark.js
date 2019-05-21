import React from 'react';
const PassThroughMark = props => (
	<span  style={{ backgroundColor: '#ffb3b3' }}>
		{props.children}
	</span>
);


export default PassThroughMark;