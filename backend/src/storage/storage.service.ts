import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables, NodeEnvironment } from "@/config/env.validation";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs/promises";
import * as path from "path";

export interface UploadResult {
  key: string;
  url: string;
}

export interface StorageFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly isGcsEnabled: boolean;
  private readonly gcsStorage?: Storage;
  private readonly bucketName?: string;
  private readonly localMediaPath: string;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    const nodeEnv = this.configService.get("NODE_ENV", { infer: true });
    this.isGcsEnabled =
      nodeEnv === NodeEnvironment.STAGING ||
      nodeEnv === NodeEnvironment.PRODUCTION;
    this.localMediaPath = path.join(process.cwd(), "media");

    if (this.isGcsEnabled) {
      const projectId = this.configService.get("GCS_PROJECT_ID", {
        infer: true,
      });
      const clientEmail = this.configService.get("GCS_CLIENT_EMAIL", {
        infer: true,
      });
      const privateKey = this.configService.get("GCS_PRIVATE_KEY", {
        infer: true,
      });
      this.bucketName = this.configService.get("GCS_BUCKET_NAME", {
        infer: true,
      });

      this.gcsStorage = new Storage({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey?.replace(/\\n/g, "\n"),
        },
      });

      this.logger.log("GCS storage initialized");
    } else {
      this.logger.log("Using local file storage");
      // Ensure local media directory exists
      void this.ensureLocalDirectoryExists();
    }
  }

  private async ensureLocalDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.localMediaPath, { recursive: true });
    } catch (error) {
      this.logger.error("Failed to create local media directory", error);
    }
  }

  /**
   * Upload a file to storage
   * @param file The file to upload
   * @param folder The folder path within storage (e.g., "user-avatar")
   * @param filename The filename to use (without extension)
   */
  async uploadFile(
    file: StorageFile,
    folder: string,
    filename: string,
  ): Promise<UploadResult> {
    const extension = this.getExtension(file.originalname, file.mimetype);
    const key = `${folder}/${filename}${extension}`;

    if (this.isGcsEnabled) {
      return this.uploadToGcs(file, key);
    } else {
      return this.uploadToLocal(file, key);
    }
  }

  /**
   * Delete a file from storage
   * @param key The file key/path
   */
  async deleteFile(key: string): Promise<void> {
    if (this.isGcsEnabled) {
      await this.deleteFromGcs(key);
    } else {
      await this.deleteFromLocal(key);
    }
  }

  /**
   * Get a file URL (presigned for GCS, direct path for local)
   * @param key The file key/path
   * @param expiresInMinutes Expiration time for presigned URL (GCS only)
   */
  async getFileUrl(
    key: string,
    expiresInMinutes: number = 60,
  ): Promise<string> {
    if (this.isGcsEnabled) {
      return this.getGcsPresignedUrl(key, expiresInMinutes);
    } else {
      // For local storage, return a relative API path
      return `/api/users/avatar-file/${key}`;
    }
  }

  /**
   * Get file buffer (for serving local files)
   * @param key The file key/path
   */
  async getFileBuffer(key: string): Promise<Buffer> {
    const filePath = path.join(this.localMediaPath, key);
    return fs.readFile(filePath);
  }

  /**
   * Check if a file exists
   * @param key The file key/path
   */
  async fileExists(key: string): Promise<boolean> {
    if (this.isGcsEnabled) {
      try {
        const [exists] = await this.gcsStorage!.bucket(this.bucketName!)
          .file(key)
          .exists();
        return exists;
      } catch {
        return false;
      }
    } else {
      try {
        const filePath = path.join(this.localMediaPath, key);
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    }
  }

  // ============ GCS Methods ============

  private async uploadToGcs(
    file: StorageFile,
    key: string,
  ): Promise<UploadResult> {
    const bucket = this.gcsStorage!.bucket(this.bucketName!);
    const gcsFile = bucket.file(key);

    await gcsFile.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    // Return the key, URL will be generated via presigned URL when needed
    return {
      key,
      url: `gs://${this.bucketName}/${key}`,
    };
  }

  private async deleteFromGcs(key: string): Promise<void> {
    try {
      await this.gcsStorage!.bucket(this.bucketName!).file(key).delete();
    } catch (error) {
      this.logger.warn(`Failed to delete GCS file: ${key}`, error);
    }
  }

  private async getGcsPresignedUrl(
    key: string,
    expiresInMinutes: number,
  ): Promise<string> {
    const [url] = await this.gcsStorage!.bucket(this.bucketName!)
      .file(key)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });

    return url;
  }

  // ============ Local Storage Methods ============

  private async uploadToLocal(
    file: StorageFile,
    key: string,
  ): Promise<UploadResult> {
    const filePath = path.join(this.localMediaPath, key);
    const dirPath = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    return {
      key,
      url: `/api/users/avatar-file/${key}`,
    };
  }

  private async deleteFromLocal(key: string): Promise<void> {
    try {
      const filePath = path.join(this.localMediaPath, key);
      await fs.unlink(filePath);
    } catch (error) {
      this.logger.warn(`Failed to delete local file: ${key}`, error);
    }
  }

  // ============ Utility Methods ============

  private getExtension(originalname: string, mimetype: string): string {
    // Try to get extension from original filename
    const extMatch = originalname.match(/\.[^.]+$/);
    if (extMatch) {
      return extMatch[0].toLowerCase();
    }

    // Fallback to mimetype
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };

    return mimeToExt[mimetype] || ".jpg";
  }
}
