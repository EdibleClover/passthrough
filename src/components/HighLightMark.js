import React from 'react';

const HighLightMark = props => (
	<span style={{ backgroundColor: '#ffeeba' }}>
		{props.children}
	</span>
);

export default HighLightMark;