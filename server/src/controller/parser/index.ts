import { parseHurtomAllPagesAsync } from './hurtom-all.controller';
import { parseHurtomDetailsAsync } from './hurtom-details.controller';
import { parseRezkaAllPagesAsync } from './rezka-all.controller';
import { parseRezkaDetailsAsync } from './rezka-details.controller';

export const parser = {
    parseHurtomDetailsAsync,
    parseHurtomAllPagesAsync,
    parseRezkaDetailsAsync,
    parseRezkaAllPagesAsync,
};
