"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPromise = void 0;
async function toPromise(callback) {
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
exports.toPromise = toPromise;
//# sourceMappingURL=to-promise.util.js.map