import { Injectable, Logger } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StoragePort, UploadFileOptions } from '../../domain/interfaces/storage.port';

@Injectable()
export class CloudflareR2Adapter implements StoragePort {
  private readonly logger = new Logger(CloudflareR2Adapter.name);
  private client: S3Client | null = null;
  private readonly bucketName = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
  private readonly publicUrl = process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const endpoint =
      process.env.R2_ENDPOINT ||
      (process.env.CLOUDFLARE_R2_ACCOUNT_ID
        ? `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
        : undefined);
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const region = process.env.R2_REGION || 'auto';

    if (!endpoint || !accessKeyId || !secretAccessKey || !this.bucketName) {
      this.logger.warn('Cloudflare R2 no configurado en .env. Modo simulado activo.');
      return;
    }

    this.client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
    this.logger.log(`Conectado al bucket Cloudflare R2: ${this.bucketName}`);
  }

  async uploadFile({ buffer, originalName, mimeType, folder = 'comprobantes' }: UploadFileOptions): Promise<string> {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${originalName.replace(/\s+/g, '_')}`;
    const key = `${folder}/${uniqueName}`;

    if (!this.client) {
      const fallbackUrl = `https://mock-storage.cloudflare.r2/${key}`;
      this.logger.log(`[Simulación R2] Archivo guardado virtualmente: ${fallbackUrl}`);
      return fallbackUrl;
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    const baseUrl = this.publicUrl ? this.publicUrl.replace(/\/$/, '') : `https://${this.bucketName}.r2.cloudflarestorage.com`;
    return `${baseUrl}/${key}`;
  }

  async getFile(fileUrlOrKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    if (!this.client || !fileUrlOrKey) return null;
    try {
      let key = fileUrlOrKey;
      if (key.includes('.cloudflarestorage.com/')) {
        key = key.split('.cloudflarestorage.com/')[1];
      } else if (key.startsWith('http://') || key.startsWith('https://')) {
        try {
          key = new URL(key).pathname.replace(/^\//, '');
        } catch {
          // ignore
        }
      }
      key = key.replace(/^\//, '');

      const res = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      let buffer: Buffer;
      if (res.Body && typeof (res.Body as any).transformToByteArray === 'function') {
        const bytes = await (res.Body as any).transformToByteArray();
        buffer = Buffer.from(bytes);
      } else {
        const chunks: Buffer[] = [];
        for await (const chunk of res.Body as any) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        buffer = Buffer.concat(chunks);
      }

      return {
        buffer,
        mimeType: res.ContentType || 'image/png',
      };
    } catch (error) {
      this.logger.error(`Error al recuperar archivo ${fileUrlOrKey} de R2:`, error);
      return null;
    }
  }
}

