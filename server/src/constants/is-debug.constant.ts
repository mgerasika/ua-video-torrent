import { ENV } from "@server/env";

export const IS_DEBUG = ENV.node_env === 'development';