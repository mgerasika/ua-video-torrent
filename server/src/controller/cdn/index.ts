import { hasFileCDNAsync } from './has-cdn.controller';
import { getFromCDNAsync } from './get-from-cdn.controller';

import { uploadFileToCDNAsync } from './upload-to-cdn.controller';

export const cdn = {
    uploadFileToCDNAsync,
    getFromCDNAsync,
    hasFileCDNAsync,
};
