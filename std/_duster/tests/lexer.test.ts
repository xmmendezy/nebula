import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";

import { LexerGenerator, LexingError } from "../../duster.ts";

Deno.test("Duster lexer simple", () => {
	const lg = new LexerGenerator();

	lg.add("NUMBER", "\\d+");
	lg.add("PLUS", "\\+");

	const l = lg.build();

	const stream = l.lex("2+3");
	let t = stream.next();
	assertEquals(t.name, "NUMBER");
	assertEquals(t.value, "2");
	t = stream.next();
	assertEquals(t.name, "PLUS");
	assertEquals(t.value, "+");
	t = stream.next();
	assertEquals(t.name, "NUMBER");
	assertEquals(t.value, "3");
	assertEquals(t.source_pos.idx, 2);
});

Deno.test("Duster lexer ignore", () => {
	const lg = new LexerGenerator();

	lg.add("NUMBER", "\\d+");
	lg.add("PLUS", "\\+");
	lg.ignore("\\s+");

	const l = lg.build();

	const stream = l.lex("2 + 3");
	let t = stream.next();
	assertEquals(t.name, "NUMBER");
	assertEquals(t.value, "2");
	t = stream.next();
	assertEquals(t.name, "PLUS");
	assertEquals(t.value, "+");
	t = stream.next();
	assertEquals(t.name, "NUMBER");
	assertEquals(t.value, "3");
	assertEquals(t.source_pos.idx, 4);
});

Deno.test("Duster lexer position", () => {
	const lg = new LexerGenerator();

	lg.add("NUMBER", "\\d+");
	lg.add("PLUS", "\\+");
	lg.ignore("\\s+");

	const l = lg.build();

	let stream = l.lex("22 + 3");
	let t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 1);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 4);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 6);

	stream = l.lex("2 +\n    37");
	t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 1);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 3);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 2);
	assertEquals(t.source_pos.colno, 5);
});

Deno.test("Duster lexer new line position", () => {
	const lg = new LexerGenerator();

	lg.add("NEWLINE", "\\n");
	lg.add("SPACE", "\\ ");

	const l = lg.build();

	let stream = l.lex(" \n ");
	let t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 1);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 1);
	assertEquals(t.source_pos.colno, 2);
	t = stream.next();
	assertEquals(t.source_pos.lineno, 2);
	assertEquals(t.source_pos.colno, 1);
});

Deno.test("Duster lexer ignore recursion", () => {
	const lg = new LexerGenerator();

	lg.ignore("\\s+");

	const l = lg.build();

	const stream = l.lex(" ".repeat(2000));
	assertEquals(list(stream), []);
});

Deno.test("Duster lexer error", () => {
	const lg = new LexerGenerator();

	lg.add("NUMBER", "\\d+");
	lg.add("PLUS", "\\+");

	const l = lg.build();

	const stream = l.lex("fail");
	try {
		stream.next();
	} catch (error) {
		assertEquals(error instanceof LexingError, true);
	}
});

Deno.test("Duster lexer error new line", () => {
	const lg = new LexerGenerator();

	lg.add("NEWLINE", "\\n");

	const l = lg.build();

	const stream = l.lex("\nfail");
	stream.next();
	// Solucionar: No toma el error
	try {
		stream.next();
	} catch (error) {
		assertEquals(error instanceof LexingError, true);
		assertEquals(error.source_pos.lineno, 2);
	}
});
