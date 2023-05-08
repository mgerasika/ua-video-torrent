"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toQuery = void 0;
async function toQuery(callback) {
	let data = undefined;
	let error;
	try {
		data = (await callback());
	}
	catch (ex) {
		error = ex;
	}
	finally {
	}
	return [data, error];
}
exports.toQuery = toQuery;
//# sourceMappingURL=to-promise.util.js.map