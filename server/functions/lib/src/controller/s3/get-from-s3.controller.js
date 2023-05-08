"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromS3Async = void 0;
const axios_1 = __importDefault(require("axios"));
const api_url_constant_1 = require("@server/constants/api-url.constant");
const express_app_1 = require("@server/express-app");
const to_promise_util_1 = require("@server/utils/to-promise.util");
const get_hurtom_all_controller_1 = require("../tools/get-hurtom-all.controller");
const s3_service_1 = require("./s3.service");
express_app_1.app.get(api_url_constant_1.API_URL.api.s3.get.id().toString(), async (req, res) => {
	const [data, error] = await (0, exports.getFromS3Async)({ id: req.params.id });
	if (error) {
		res.status(400).send(error);
	}
	else {
		res.send(data);
	}
});
const getFromS3Async = async ({ id }) => {
	return (0, to_promise_util_1.toQuery)(() => axios_1.default.get(`https://toloka.to/download.php?id=${ id }`, get_hurtom_all_controller_1.HURTOM_HEADERS).then((response) => {
		const params = {
			Bucket: s3_service_1.S3_BUCKED_NAME,
			Key: `${ id }.torrent`,
		};
		return new Promise((resolve, reject) => {
			s3_service_1.s3.getObject(params, function(err, data) {
				if (err) {
					return reject(err);
				}
				resolve(data.Body);
			});
		});
	}));
};
exports.getFromS3Async = getFromS3Async;
//# sourceMappingURL=get-from-s3.controller.js.map