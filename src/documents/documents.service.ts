import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { DocumentEntity } from './models/document.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async uploadDocument(
    userId: number,
    file: Express.Multer.File,
    body: UploadDocumentDto,
  ): Promise<DocumentEntity> {
    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Helper function to upload the buffer using a stream
    const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'documents' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    // Upload the file buffer directly to Cloudinary
    const result = await uploadToCloudinary(file.buffer);

    // Save the document details in the database
    const document = this.documentRepository.create({
      title: body.title || 'Title',
      description: body.description || 'Uploaded document',
      cloudinaryPublicId: result.public_id,
      cloudinaryUrl: result.secure_url,
      user,
    });

    return this.documentRepository.save(document);
  }

  async listDocuments(userId: number): Promise<DocumentEntity[]> {
    return this.documentRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getDocument(id: number, userId: number): Promise<DocumentEntity> {
    const document = await this.documentRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!document) {
      throw new NotFoundException('Document not found or access denied');
    }
    return document;
  }

  async updateDocument(
    id: number,
    userId: number,
    title?: string,
    description?: string,
    file?: Express.Multer.File,
  ): Promise<DocumentEntity> {
    const document = await this.getDocument(id, userId);

    // Update title and description if provided
    if (title) {
      document.title = title;
    }
    if (description) {
      document.description = description;
    }

    // Replace the file if a new file is uploaded
    if (file) {
      // Delete the old file from Cloudinary
      if (document.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(document.cloudinaryPublicId);
      }

      // Upload the new file to Cloudinary
      const uploadToCloudinary = (buffer: Buffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'documents' },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            },
          );
          streamifier.createReadStream(buffer).pipe(uploadStream);
        });
      };

      const result: any = await uploadToCloudinary(file.buffer);

      // Update the Cloudinary fields in the document
      document.cloudinaryPublicId = result.public_id;
      document.cloudinaryUrl = result.secure_url;
    }

    return this.documentRepository.save(document);
  }

  async deleteDocument(
    id: number,
    userId: number,
  ): Promise<{ message: string; documentId: number }> {
    // Check if the document exists
    const document = await this.getDocument(id, userId);
    if (!document) {
      throw new NotFoundException('Document not found or access denied');
    }

    try {
      // Remove the document from Cloudinary if it has a file
      if (document.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(
          document.cloudinaryPublicId,
          (error, result) => {
            if (error) {
              console.error('Cloudinary deletion error:', error);
              throw new Error('Failed to delete file from Cloudinary');
            }
            console.log('Cloudinary deletion result:', result);
          },
        );
      }

      // Delete the document record
      await this.documentRepository.remove(document);

      // Return a structured response
      return { message: 'Document deleted successfully', documentId: id };
    } catch (error) {
      console.error('Error during document deletion:', error);
      throw new NotFoundException('Document not found or access denied');
    }
  }
}
