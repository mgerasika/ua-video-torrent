import { getAllHurtomPagesAsync } from '../parser/get-hurtom-all.controller';
import { getHurtomPageByIdAsync } from './get-hurtom-by-id.controller';

export const parser = {
    getHurtomPageByIdAsync,
    getAllHurtomPagesAsync,
};
