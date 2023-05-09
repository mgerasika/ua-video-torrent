import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('imdb')
export class ImdbDto {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true, type: 'text', unique: true })
    original_id!: string;

    @Column({ nullable: true, type: 'text' })
    en_name!: string;

    @Column({ nullable: true, type: 'text' })
    poster!: string;

    @Column({ nullable: false, type: 'numeric' })
    imdb_rating!: number;

    @Column({ nullable: false, type: 'numeric' })
    year!: number;

    @Column({ nullable: true, type: 'json' })
    json!: string;
}
