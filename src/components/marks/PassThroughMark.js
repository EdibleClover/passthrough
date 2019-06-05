import React from 'react';
import { Tooltip } from 'reactstrap';

export default class PassThroughMark extends React.Component {
	constructor(...props) {
		super(...props)
	}
	render(...props) {
		return (
				<span className="ptMark" style={{ backgroundColor: '#ffb3b3' }}>
					{this.props.children}
				</span>
		)
	}
}

