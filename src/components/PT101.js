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
		valid: '',
		sig: 'contrary,,,-50,,,simply,,,-50,,,roots,,,-25,,,classical',
		error: '',
		dropDown: true,
		decorations: {}
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
		this.setState(
			{ sig: event.target.value },
			(event) => this.passMarks(event)
		);
	}
	editorOnChange = ({ value }) => {
		this.setState({ value: value })
	}

	/**
	 * On input change, update the decorations.
	 *
	 * @param {Event} event
	 */
	passMarks = (event) => {
		const sig = this.state.sig
		const editor = this.ref.current
		const value = editor.value  //Top level object of slate
		const texts = value.document.getTexts() ///Object of every node
		const decorations = []
		const myPass = new PassThrough(sig)
		//Begin Loops
		const Regex = myPass.toRegex();
		///Unfortunately, the search is not GLOBAL, 
		texts.forEach(node => {
			const { key, text } = node
			let regexMatch = text.match(Regex);
			//If theres a match render some marks
			if (regexMatch != null) {
				/**
				 * check for an exact match. ie, no passthroughs, only the highlight mark 
				 */
				if (regexMatch.length === 2) {  //This is an exact match, there are no other matches in the array
					let anchor = regexMatch.index;
					let focus = anchor + regexMatch[0].length
					decorations.push({
						anchor: { key, offset: anchor },
						focus: { key, offset: focus },
						mark: { type: 'highlight' },
					})
				}
				else {
					//Pass RegexMatch to generate coordinates for highlight
					let Coordinates = myPass.GenerateCoordinates(regexMatch)
					Coordinates.passThroughs.forEach((c) => {
						decorations.push({
							anchor: { key, offset: c.start },
							focus: { key, offset: c.end },
							mark: { type: 'Passthrough' },
						})
					})
					Coordinates.verbose.forEach((c) => {
						decorations.push({
							anchor: { key, offset: c.start },
							focus: { key, offset: c.end },
							mark: { type: 'highlight' },
						})
					})
				}
			}
			this.setState(
				{ decorations: decorations },
				(event) => 
			
			editor.withoutSaving(() => {
				editor.setDecorations(decorations)
			})
			);
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
						/>
					</Col>
				</Row>
			</Container>
		)
	}
}


