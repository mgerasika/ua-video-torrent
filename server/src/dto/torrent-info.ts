import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('torrent_info')
export class TorrentInfoDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'numeric' })
    num_peers!: number;
}
