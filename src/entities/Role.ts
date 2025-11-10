import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

@Entity("roles")
export class Role {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id!: number;

    @Column({type:"varchar",nullable:false})
    name!:String;

    @Column({type:"varchar",nullable:false})
    short_name!:String;

    @Column({ type: "tinyint", default: 1 })
    status!: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
}
