"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const get_from_s3_controller_1 = require("./get-from-s3.controller");
const has_file_s3_controller_1 = require("./has-file-s3.controller");
const upload_to_s3_controller_1 = require("./upload-to-s3.controller");
exports.s3 = {
    uploadFileToAmazonAsync: upload_to_s3_controller_1.uploadFileToAmazonAsync,
    getFromS3Async: get_from_s3_controller_1.getFromS3Async,
    hasFileS3Async: has_file_s3_controller_1.hasFileS3Async,
};
//# sourceMappingURL=index.js.map