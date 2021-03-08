class NBObject {
	constructor() { }

	public __repr__() {
		return this.constructor.name;
	}

	public __str__() {
		return this.__repr__();
	}

	public toString() {
		return this.__str__();
	}

	public __eq__(other: NBObject): boolean {
		return this.__bool__() === other.__bool__();
	}

	public __bool__() {
		return true;
	}

	[Deno.customInspect](): string {
		return this.__repr__();
	}
}

class NBObjectIterable<T> implements Iterable<T> {
	private _counter_iterable = 0;

	public __repr__() {
		return `${this.constructor.name} ${this.__iter__}`;
	}
	public __str__() {
		return this.__repr__();
	}

	public toString() {
		return this.__str__();
	}

	public __eq__(other: NBObject): boolean {
		return this.__bool__() === other.__bool__();
	}

	public __bool__() {
		return true;
	}

	[Deno.customInspect](): string {
		return this.__repr__();
	}

	get __iter__(): T[] {
		return [];
	}

	get length(): number {
		return this.__iter__.length;
	}

	public _pre_done_iterable(): void { }

	public _done_iterable(): boolean {
		const done = this._counter_iterable === this.length;
		if (done) {
			this._counter_iterable = 0;
		}
		return done;
	}

	public __next__(): T {
		const v = this.__iter__[this._counter_iterable];
		this._counter_iterable++;
		return v || this.__iter__[this.length - 1];
	}

	private _next_iterable() {
		return () => {
			this._pre_done_iterable();
			return {
				done: this._done_iterable(),
				value: this.__next__(),
			};
		};
	}

	public [Symbol.iterator]() {
		return {
			next: this._next_iterable(),
		};
	}

	public map(funct: (e: T, i?: number) => T): T[] {
		const els: T[] = [];
		let i = 0;
		for (const e of this) {
			els.push(funct(e, i));
			i++;
		}
		return els;
	}
}

class Exception extends Error {
	constructor(m: string) {
		super(m);
	}

	public __repr__() {
		return this.constructor.name;
	}

	public __str__() {
		return this.__repr__();
	}

	public toString() {
		return this.__str__();
	}

	[Deno.customInspect](): string {
		return this.__repr__();
	}
}

declare global {
	function printf(...data: any[]): void;
	function list<T>(data: NBObjectIterable<T>): T[];
	function len(data: any): number;
	class NBObject {
		__repr__(): void;
		__str__(): void;
		__eq__(other: NBObject): void;
		__bool__(): void;
	}
	class NBObjectIterable<T> {
		length(): number;
		_done_iterable(): boolean;
		__next__(): T;
		[Symbol.iterator](): {
			next(): {
				done: boolean;
				value: T;
			};
		};
		map(funct: (e: T, i?: number) => T): T[];
	}
	class Exception {
		__repr__(): void;
		__str__(): void;
	}
	interface String {
		count(s: string, a?: number, b?: number): number;
		rfind(s: string, a?: number, b?: number): number;
	}
	interface Window {
		printf: any;
		list: any;
		len: any;
		NBObject: any;
		NBObjectIterable: any;
		Exception: any;
	}
}

function printf(...data: any[]): void {
	console.log(...data);
}

function list<T>(data: NBObjectIterable<T>): T[] {
	return data.map((i) => i) as T[];
}

function len(data: any): number {
	return data.length;
}

String.prototype.count = function (s: string, a?: number, b?: number): number {
	a = a || 0;
	b = typeof b === "number" ? b : this.length;
	return (this.slice(a, b).match(new RegExp(s, "g")) || []).length;
};

String.prototype.rfind = function (s: string, a?: number, b?: number): number {
	a = a || 0;
	b = typeof b === "number" ? b : this.length;
	return this.slice(a, b).lastIndexOf(s);
};

window.printf = printf;
window.list = list;
window.len = len;
window.NBObject = NBObject;
window.NBObjectIterable = NBObjectIterable;
window.Exception = Exception;

export { Exception, len, list, NBObject, NBObjectIterable, printf };
