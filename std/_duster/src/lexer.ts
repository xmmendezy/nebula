import { LexingError } from "./errors.ts";
import { SourcePosition, Token } from "./token.ts";
import { Match, Rule } from "./lexergenerator.ts";

class Lexer extends NBObject {
	constructor(rules: Rule[], ignore_rules: Rule[]) {
		super();
		this.rules = rules;
		this.ignore_rules = ignore_rules;
	}

	public rules: Rule[];
	public ignore_rules: Rule[];

	public lex(s: string) {
		return new LexerStream(this, s);
	}
}

class LexerStream extends NBObjectIterable<Token> {
	constructor(lexer: Lexer, s: string) {
		super();
		this.lexer = lexer;
		this.s = s;
		this.idx = 0;
		this.lineno = 1;
		this.colno = 1;
	}

	private next_token: Token = new Token("", "", new SourcePosition(-1, -1, -1));
	private values_token: Token[] = [];

	get __iter__(): Token[] {
		return this.values_token;
	}

	private lexer: Lexer;
	private s: string;
	private idx: number;
	private lineno: number;
	private colno: number;

	public _update_pos(match: Match) {
		this.idx = match.end;
		this.lineno += this.s.count("\n", match.start, match.end);
		const last_nl: number = this.s.rfind("\n", 0, match.start);
		if (last_nl < 0) {
			return match.start + 1;
		} else {
			return match.start - last_nl;
		}
	}

	public match(rule: Rule, col_new: boolean = false): Match {
		const match: Match = rule.matches(this.s, this.idx);
		if (match.start >= 0) {
			const colno = this._update_pos(match);
			if (col_new) {
				this.colno = colno;
			}
		}
		return match;
	}

	public _done_iterable(): boolean {
		return this.next_token.source_pos.idx < 0;
	}

	public next() {
		let rule_ig = !!this.lexer.ignore_rules.length;
		while (rule_ig) {
			for (const rule of this.lexer.ignore_rules) {
				const match = this.match(rule, true);
				if (match.start < 0) {
					rule_ig = false;
					break;
				}
			}
		}

		for (const rule of this.lexer.rules) {
			const match = this.match(rule, true);
			if (match.start >= 0) {
				const value = this.s.slice(match.start, match.end);
				const source_pos = new SourcePosition(
					match.start,
					value === "\n" ? this.lineno - 1 : this.lineno,
					this.colno,
				);
				this.next_token = new Token(rule.name, value, source_pos);
				break;
			}
		}
		if (this.next_token.source_pos.idx >= 0) {
			this.values_token.push(this.next_token);
		} else {
			if (this.idx < len(this.s)) {
				throw new LexingError(
					"",
					new SourcePosition(this.idx, this.lineno, this.colno),
				);
			}
		}
		return this.next_token;
	}

	public _pre_done_iterable() {
		this.next();
	}

	public __next__() {
		return this.next_token;
	}
}

export { Lexer, LexerStream };
