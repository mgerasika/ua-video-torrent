import { getFromS3Async } from './get-from-s3.controller';
import { hasFileS3Async } from './has-file-s3.controller';
import { uploadFileToAmazonAsync } from './upload-to-s3.controller';

export const s3 = {
    uploadFileToAmazonAsync,
    getFromS3Async,
    hasFileS3Async,
};
