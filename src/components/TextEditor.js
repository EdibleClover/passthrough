import React, { Component } from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { HighLightMark, SearchBar, PassThrough, PassThroughMark } from './index.js'

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

export default class TextEditor extends Component {
	constructor() {
		super()
	}
	state = {
		value: initialValue,
		valid: '',
		error: ''
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
	 */

	ref = editor => {
		this.editor = editor
	}
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
	validate = (myPass) => {
		let validate = myPass.validate();
	}
	/**
	 * On input change, update the decorations.
	 *
	 * @param {Event} event
	 */
	onInputChange = (event) => {
		const { editor } = this
		const { value } = editor  //Top level object of slate
		const string = event.target.value   
		const texts = value.document.getTexts() ///Object of every node
		const decorations = []
		const myPass = new PassThrough(string)
		this.validate(myPass)
		//Begin Loops
		const Regex = myPass.toRegex();
		///Unfortunately, the search is not GLOBAL, 
		texts.forEach(node => {
			const { key, text } = node
			//const parts = text.split(string)
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
				/**
				 * if regexMatch is matching with passthroughs it will be an array
				 * Here where things get complicated
				 * How do we get the anchors and focusa and render different marks for each
				 * 	Unforuntaetly, there is a  bug where the first match of the regex groups will come back since it is not referncing its original position in the match
				 */
				else {
					//Pass RegexMatch to generate coordinates for highlight
					let Coordinates = myPass.GenerateCoordinates(regexMatch)
					Coordinates.passThroughs.forEach((c)=>{
						decorations.push({
							anchor: { key, offset: c.start },
							focus: { key, offset: c.end },
							mark: { type: 'Passthrough' },
						})
					})
					Coordinates.verbose.forEach((c)=>{
						decorations.push({
							anchor: { key, offset: c.start },
							focus: { key, offset: c.end },
							mark: { type: 'highlight' },
						})
					})
				}
			}
			editor.withoutSaving(() => {
				editor.setDecorations(decorations)
			})
		})
	}
	render() {
		return (
			<div>
				<SearchBar
					onChange={(e) => { this.onInputChange(e) }}
					style={{}}
				/>
				<Editor
					style={{ padding: '15px' }}
					placeholder="Enter some rich text..."
					ref={this.ref}
					defaultValue={initialValue}
					schema={this.schema}
					renderMark={this.renderMark}
				/>
			</div>
		)
	}
}