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

  // @Column({
  //   type: 'timestamp',
  //   nullable: false,
  //   default: ()=> 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn()
  createdAt: Date;

  // @Column({
  //   type:'timestamp', 
  //   nullable: true,
  //   default: null,
  // })
  @DeleteDateColumn()
  deletedAt: Date|null;
}