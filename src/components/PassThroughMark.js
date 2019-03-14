import React from 'react';
import { UncontrolledTooltip } from 'reactstrap'
const PassThroughMark = props => (

	<span  style={{ backgroundColor: '#ffb3b3' }}>

		{props.children}
	</span>
);

export default PassThroughMark;