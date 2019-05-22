import React from 'react';
import { Tooltip } from 'reactstrap';

export default class PassThroughMark extends React.Component {
	constructor(...props) {
		super(...props)
		this.state= {
		tooltipOpen:false,
		toolId: ""
		}
	}
	toggle = (e) => {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		  });
	}
	componentDidMount() {
		let ran = Math.floor((Math.random() * 500) + 1);
		this.setState({
			toolId: ran
		  });
	  }	
	render(...props) {
		return (
			<span>
				<span className="ptMark" id={'tooltip-'+this.state.toolId} style={{ backgroundColor: '#ffb3b3' }}>
					{this.props.children}
					<Tooltip trigger="click" placement="right" isOpen={this.state.tooltipOpen} target={'tooltip-'+this.state.toolId} toggle={this.toggle}>
						{this.props.text.length}
					</Tooltip>
				</span>
			</span>
		)
	}
}

