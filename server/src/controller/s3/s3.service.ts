import AWS from 'aws-sdk';
export const S3_BUCKED_NAME = 'ua-video-torent-s3';
const S3_ID = 'AKIASSEMXOWZBWXILTXK';
const S3_SECRET = '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';
// permissions for s3 bucket

export const s3 = new AWS.S3({
    accessKeyId: S3_ID,
    secretAccessKey: S3_SECRET,
});
