import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ImdbDto } from './imdb.dto';

export interface IMovieDto {
    id: string;

    en_name: string;

    ua_name: string;

    href: string;

    year: number;

    title: string;

    download_id: string;

    size: number;

    aws_s3_torrent_url: string;

    imdb?: ImdbDto;

    imdb_id?: string;

    hurtom_imdb_id: string;
}

@Entity('movie')
export class MovieDto implements IMovieDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, type: 'text' })
    en_name!: string;

    @Column({ nullable: false, type: 'text' })
    ua_name!: string;

    @Column({ nullable: false, type: 'text', unique: true })
    href!: string;

    @Column({ nullable: true, type: 'numeric' })
    year!: number;

    @Column({ nullable: false, type: 'text' })
    title!: string;

    @Column({ nullable: false, type: 'text', unique: true })
    download_id!: string;

    @Column({ nullable: true, type: 'text' })
    size!: number;

    @Column({ nullable: true, type: 'text', unique: true })
    aws_s3_torrent_url!: string;

    @ManyToOne(() => ImdbDto)
    @JoinColumn({ name: 'imdb_id' })
    imdb?: ImdbDto;

    @RelationId((item: MovieDto) => item.imdb)
    imdb_id?: string;

    @Column({ nullable: true, type: 'text' })
    hurtom_imdb_id!: string;
}
