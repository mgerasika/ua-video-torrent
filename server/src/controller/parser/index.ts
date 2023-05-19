import { getAllHurtomPagesAsync } from '../parser/get-hurtom-all.controller';
import { getHurtomPageByIdAsync } from './get-hurtom-by-id.controller';
import { getAllRezkaPagesAsync } from './rezka-all.controller';
import { getRezkaPageByIdAsync } from './rezka-by-id.controller';

export const parser = {
    getHurtomPageByIdAsync,
    getAllHurtomPagesAsync,
    getRezkaPageByIdAsync,
    getAllRezkaPagesAsync,
};
