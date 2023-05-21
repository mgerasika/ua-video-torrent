import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ImdbDto } from './imdb.dto';
import { EResolution } from '@server/enum/resolution.enum';
import { ETranslation } from '@server/enum/translation.enum';
import { RezkaMovieDto } from './rezka-movie.dto';

export interface IStreamDto {
    id: string;

    translation_original_text: string;

    resolution_enum: EResolution;

    translation_enum: ETranslation;

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
        default: EResolution._360p,
        nullable: true,
    })
    resolution_enum!: EResolution;

    @Column({
        type: 'enum',
        enum: ETranslation,
        default: ETranslation.default,
        nullable: true,
    })
    translation_enum!: ETranslation;

    @Column({ nullable: false, type: 'text' })
    translation_original_text!: string;

    @Column({ nullable: false, type: 'text', unique: true })
    stream_url!: string;

    @ManyToOne(() => ImdbDto, { nullable: false })
    @JoinColumn({ name: 'imdb_id' })
    imdb?: ImdbDto;

    @RelationId((item: StreamDto) => item.imdb)
    imdb_id?: string;
}
