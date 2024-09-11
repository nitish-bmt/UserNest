import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// default is
// varchar(255) for strings
// and integer for number
@Entity()
export class User{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 20,
    nullable: false,
  })
  lastName: string;

  @Column({
    length: 20,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  pass: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column()
  contact: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}