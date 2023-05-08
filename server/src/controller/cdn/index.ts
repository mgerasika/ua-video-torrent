import { getFromCDNAsync } from './get-from-cdn.controller';
import { hasFileCDNAsync } from './has-file-cdn.controller';
import { uploadFileToCDNAsync } from './upload-to-cdn.controller';

export const cdn = {
     uploadFileToCDNAsync,
     getFromCDNAsync,
     hasFileCDNAsync,
};
