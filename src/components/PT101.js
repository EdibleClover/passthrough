import React, { Component } from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { HighLightMark, PassThrough, PassThroughMark, Header } from './index.js'
import { Container, Row, Col } from 'reactstrap'
/**
 * Initial Text Editor Value
 */
const initialValue = Value.fromJSON({
	document: {
		nodes: [
			{
				object: 'block',
				type: 'paragraph',
				nodes: [
					{
						object: 'text',
						leaves: [
							{
								text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
							},
						],
					},
				],
			},
		],
	},
})

export default class PT101 extends Component {
	constructor() {
		super()
	}
	state = {
		value: initialValue,
		sig: 'contrary,,,-50,,,simply,,,-50,,,roots,,,-25,,,classical',
		regex: {},
		exactSig:''
	}
	schema = {
		marks: {
			Highlight: {
				isAtomic: true,
			},
			Passthrough: {
				isAtomic: true,
			},
		},
	}
	/**
	 * Store a reference to the `editor`.
	 *
	 * @param {Editor} editor
	 * 
	 */

	ref = React.createRef()
    /**
     * On EditorChange
     */
	renderMark = (props, editor, next) => {
		const { children, mark, attributes } = props
		switch (mark.type) {
			case 'highlight':
				return (
					<HighLightMark {...props} />
				)
			case 'Passthrough':
				return (
					<PassThroughMark {...props} />
				)
			default:
				return next()
		}
	}
	sigOnChange = (event, editor, next) => {
		const sig = event.target.value.toLowerCase()
		this.setState(
			{ sig: sig },
			(event) => this.passMarks(event)
		);
	}
	editorOnChange = async ({ value }) => {
		this.setState({ value: value })
	}
	passMarks = async (event) => {
		const editor = this.ref.current
		const value = editor.value  //Top level object of slate
		const text = value.document.getTexts() ///Object of every node
		const sig =  new PassThrough(this.state.sig, text)
		const decorations = sig.decorations
		const exact = (sig.decorations.length > 0) ? sig.generateExact() : "no match"
		await this.setState({exactSig:exact})   //kinda nice that setState can be a promise
		editor.withoutSaving(() => {
			editor.setDecorations(decorations)
		})
	}
	render() {
		return (
			<Container fluid={true} className="App">
				<Header
					onChange={(e) => { this.sigOnChange(e) }}
					toggle={this.state.dropDown}
					sig={this.state.sig}
					decorations={this.state.decorations}
					exactSig = {this.state.exactSig}
				/>
				<Row>
					<Col>
						<Editor
							style={{ padding: '15px' }}
							placeholder="Enter some rich text..."
							ref={this.ref}
							defaultValue={initialValue}
							schema={this.schema}
							renderMark={this.renderMark}
							onChange={this.editorOnChange}
							value={this.state.value}
						  	spellCheck={false}
						
						/>
					</Col>
				</Row>
			</Container>
		)
	}
}


