import { getStreamAllAsync } from './get-stream-list.controller';
import { getStreamByIdAsync } from './get-stream.controller';
import { postStreamAsync } from './post-stream.controller';
import { putStreamAsync } from './put-streamcontroller';
import { deleteStreamAsync } from './delete-stream.controller';

export const stream = {
     getStreamAllAsync,
     getStreamByIdAsync,
     postStreamAsync,
     putStreamAsync,
     deleteStreamAsync,
};
