import { SourcePosition } from "./token.ts";

class ParserGeneratorError extends Exception {
	constructor() {
		super();
	}
}

class LexingError extends Exception {
	constructor(message: string, source_pos: SourcePosition) {
		super();
		this.message = message;
		this.source_pos = source_pos;
	}

	public message!: string;
	public source_pos!: SourcePosition;

	public __repr__() {
		return `${super.__repr__()}(${this.message || "''"}, ${this.source_pos})`;
	}
}

class ParsingError extends Exception {
	constructor(message: string, source_pos: SourcePosition) {
		super();
		this.message = message;
		this.source_pos = source_pos;
	}

	private message!: string;
	private source_pos!: SourcePosition;

	public getsourcepos() {
		return this.source_pos;
	}

	public __repr__() {
		return `${super.__repr__()}(${this.message}, ${this.source_pos})`;
	}
}

class ParserGeneratorWarning extends Exception {
	constructor() {
		super();
	}
}

export {
	LexingError,
	ParserGeneratorError,
	ParserGeneratorWarning,
	ParsingError,
};
