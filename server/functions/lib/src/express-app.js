"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const bodyParser = require('body-parser');
const cors = require('cors');
// app.use(bodyParser.text({ type: '*/*' }));
exports.app.use(bodyParser.json());
exports.app.use(cors());
if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    morgan.token('body', (req, res) => {
        return JSON.stringify(req.body);
    });
    exports.app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
}
//# sourceMappingURL=express-app.js.map