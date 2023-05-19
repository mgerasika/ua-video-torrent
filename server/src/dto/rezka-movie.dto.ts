import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ImdbDto } from './imdb.dto';

export enum ERezkaVideoType {
    film = 'film',
    cartoon = 'cartoon',
}

@Entity('rezka_movie')
export class RezkaMovieDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true, type: 'text' })
    en_name!: string;

    @Column({ nullable: false, type: 'text', unique: true })
    url_id!: string;

    @Column({ nullable: true, type: 'numeric' })
    year!: number;

    @Column({ nullable: false, type: 'text', unique: true })
    href!: string;

    @Column({
        type: 'enum',
        enum: ERezkaVideoType,
        default: ERezkaVideoType.film,
    })
    video_type!: ERezkaVideoType;
}
