import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { DocumentEntity } from 'src/documents/models/document.entity';

@Entity('ingestion_jobs')
export class IngestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentEntity, { onDelete: 'CASCADE' })
  document: DocumentEntity;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  error: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
