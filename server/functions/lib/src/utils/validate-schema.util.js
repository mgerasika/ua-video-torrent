"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
function validateSchema(schema, body) {
    const { value, error } = schema.validate(body);
    return [value, error];
}
exports.validateSchema = validateSchema;
//# sourceMappingURL=validate-schema.util.js.map