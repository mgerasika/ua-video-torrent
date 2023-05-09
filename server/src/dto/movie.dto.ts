import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ImdbDto } from './imdb.dto';

@Entity('movie')
export class MovieDto {
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

    @Column({ nullable: true, type: 'text' })
    imdb_original_id?: string;

    @ManyToOne(() => ImdbDto)
    @JoinColumn({ name: 'imdb_id' })
    imdb?: ImdbDto;

    @RelationId((item: MovieDto) => item.imdb)
    imdb_id?: string;
}
