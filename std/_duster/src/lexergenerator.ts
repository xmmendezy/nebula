import { Lexer } from "./lexer.ts";

class Rule extends NBObject {
	constructor(name: string, pattern: string) {
		super();
		this.name = name;
		this.re = new RegExp(`\^${pattern}`, "g");
	}

	public name: string;
	private re: RegExp;

	public matches(s: string, pos: number): Match {
		const ms = s.slice(pos).match(this.re);
		if (ms && ms.length) {
			const ms_0 = ms[0].match(this.re);
			if (ms_0 && ms_0.length) {
				return new Match(pos, pos + ms_0[0].length);
			}
		}
		return new Match(-1, 0);
	}
}

class Match extends NBObject {
	constructor(start: number, end: number) {
		super();
		this.start = start;
		this.end = end;
	}

	public start: number;
	public end: number;
}

class LexerGenerator extends NBObject {
	constructor() {
		super();
		this.rules = [];
		this.ignore_rules = [];
	}

	private rules: Rule[];
	private ignore_rules: Rule[];

	public add(name: string, pattern: string) {
		this.rules.push(new Rule(name, pattern));
	}

	public ignore(pattern: string) {
		this.ignore_rules.push(new Rule("", pattern));
	}

	public build() {
		return new Lexer(this.rules, this.ignore_rules);
	}
}

export { LexerGenerator, Match, Rule };
