import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Check } from 'typeorm';

export interface IImdbDto {
    id: string;

    en_name: string;

    poster: string;

    imdb_rating: number;

    year: number;

    json: string;
}
@Entity('imdb')
export class ImdbDto implements IImdbDto {
    @PrimaryColumn('text', { nullable: false, unique: true })
    id!: string;

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

    constructor(id: string) {
        this.id = id;
    }
}
