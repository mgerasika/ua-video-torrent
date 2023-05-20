import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export interface ITorrentInfoDto {
    id: string;

    num_peers: number;
}
@Entity('torrent_info')
export class TorrentInfoDto implements ITorrentInfoDto {
    @PrimaryColumn('text')
    id!: string;

    @Column({ nullable: false, type: 'numeric' })
    num_peers!: number;
}
