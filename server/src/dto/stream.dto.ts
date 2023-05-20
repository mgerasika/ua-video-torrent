import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ImdbDto } from './imdb.dto';

export enum EResolution {
    _360 = '360p',
    _480 = '480p',
    _720p = '720p',
    _1080 = '1080p',
    _1280 = '1280p',
}

export enum ETranslation {
    default = 'default',
    ua_1 = 'ua_1',
}

export interface IStreamDto {
    id: string;

    resolution: EResolution;

    translation: ETranslation;

    stream_url: string;

    imdb?: ImdbDto;

    imdb_id?: string;
}
@Entity('stream')
export class StreamDto implements IStreamDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'enum',
        enum: EResolution,
        default: EResolution._360,
    })
    resolution!: EResolution;

    @Column({
        type: 'enum',
        enum: ETranslation,
        default: ETranslation.default,
    })
    translation!: ETranslation;

    @Column({ nullable: false, type: 'text' })
    stream_url!: string;

    @ManyToOne(() => ImdbDto)
    @JoinColumn({ name: 'imdb_id' })
    imdb?: ImdbDto;

    @RelationId((item: StreamDto) => item.imdb)
    imdb_id?: string;
}
