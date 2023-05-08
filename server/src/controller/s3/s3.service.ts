import { S3Client } from '@aws-sdk/client-s3';
export const S3_BUCKED_NAME = 'ua-video-torent-s3';
const S3_ID = 'AKIASSEMXOWZBWXILTXK';
const S3_SECRET = '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';
const { Credentials } = require('@aws-sdk/types');
// permissions for s3 bucket

export const s3 = new S3Client({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: S3_ID,
		secretAccessKey: S3_SECRET,
		
	},
	
});
