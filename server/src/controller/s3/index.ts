import { hasFileS3Async } from './has-file-s3.controller';
import { getFromS3Async } from './get-from-s3.controller';

import { uploadFileToAmazonAsync } from './upload-to-s3.controller';

export const s3 = {
    hasFileS3Async,
    uploadFileToAmazonAsync,
    getFromS3Async,
};
