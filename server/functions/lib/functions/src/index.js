"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("module-alias/register");
const functions = require('firebase-functions');
const admin = __importStar(require("firebase-admin"));
const express_app_1 = require("../../src/express-app");
const db_service_1 = require("../../src/controller/db.service");
const api_url_constant_1 = require("@server/constants/api-url.constant");
admin.initializeApp();
express_app_1.app.get('/echo', (req, res) => {
    functions.logger.log('/echo api call ');
    res.send(JSON.stringify(db_service_1.dbService, null, 2));
});
express_app_1.app.get('/', (req, res) => {
    res.send('API_URL = ' + JSON.stringify(api_url_constant_1.API_URL, null, 2));
});
// Define your Express routes here
exports.app = functions.https.onRequest(express_app_1.app);
//# sourceMappingURL=index.js.map