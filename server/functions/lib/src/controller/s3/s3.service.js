"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.S3_BUCKED_NAME = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
exports.S3_BUCKED_NAME = 'ua-video-torent-s3';
const S3_ID = 'AKIASSEMXOWZBWXILTXK';
const S3_SECRET = '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';
// permissions for s3 bucket
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: S3_ID,
    secretAccessKey: S3_SECRET,
});
//# sourceMappingURL=s3.service.js.map