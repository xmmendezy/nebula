class Token extends NBObject {
	constructor(name: string, value: string, source_pos: SourcePosition) {
		super();
		this.name = name;
		this.value = value;
		this.source_pos = source_pos;
	}

	public name: string;
	public value: string;
	public source_pos: SourcePosition;

	public __repr__() {
		return `Token(${this.name}, ${this.value})`;
	}

	public __eq__(other: NBObject): boolean {
		if (!(other instanceof Token)) {
			return false;
		}
		return this.name === other.name && this.value === other.value;
	}
}

class SourcePosition extends NBObject {
	constructor(idx: number, lineno: number, colno: number) {
		super();
		this.idx = idx;
		this.lineno = lineno;
		this.colno = colno;
	}

	public idx: number;
	public lineno: number;
	public colno: number;

	public __repr__() {
		return `SourcePosition(idx=${this.idx}, lineno=${this.lineno}, colno=${this.colno})`;
	}
}

export { SourcePosition, Token };
