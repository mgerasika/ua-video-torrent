"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToAmazonAsync = void 0;
const axios_1 = __importDefault(require("axios"));
const api_url_constant_1 = require("@server/constants/api-url.constant");
const express_app_1 = require("@server/express-app");
const to_promise_util_1 = require("@server/utils/to-promise.util");
const get_hurtom_all_controller_1 = require("../tools/get-hurtom-all.controller");
const s3_service_1 = require("./s3.service");
express_app_1.app.post(api_url_constant_1.API_URL.api.s3.upload.toString(), async (req, res) => {
	if (!req.body.id) {
		res.status(400).send('id is undefined');
	}
	else {
		const [data, error] = await (0, exports.uploadFileToAmazonAsync)({ hurtomDownloadId: req.body.id });
		if (error) {
			res.status(400).send(error);
		}
		else {
			res.send(data);
		}
	}
});
const uploadFileToAmazonAsync = async ({ hurtomDownloadId, }) => {
	return (0, to_promise_util_1.toQuery)(() => axios_1.default.get(`https://toloka.to/download.php?id=${ hurtomDownloadId }`, get_hurtom_all_controller_1.HURTOM_HEADERS).then((response) => {
		const fileContent = response.data;
		console.log('fileContent', fileContent);
		if (fileContent === null || fileContent === void 0 ? void 0 : fileContent.includes('<script')) {
			throw 'File not found';
		}
		const params = {
			Bucket: s3_service_1.S3_BUCKED_NAME,
			Key: `${ hurtomDownloadId }.torrent`,
			Body: fileContent,
		};
		return new Promise((resolve, reject) => {
			s3_service_1.s3.upload(params, function(err, data) {
				if (err) {
					return reject(err);
				}
				console.log(`File uploaded successfully. ${ data.Location }`);
				resolve(data.Location);
			});
		});
	}));
};
exports.uploadFileToAmazonAsync = uploadFileToAmazonAsync;
//# sourceMappingURL=upload-to-s3.controller.js.map