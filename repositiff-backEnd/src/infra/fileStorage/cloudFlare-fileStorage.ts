import { DeleteObjectCommand, GetObjectAclCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { IFileStorage } from "./IFileStorage.js";
import "dotenv/config"; // Carrega automaticamente as variáveis do .env
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";
export class CloudFlareFileStorage implements IFileStorage {
  private _r2: S3Client;
  constructor() {
    const CLOUDFLARE_ID_KEY = process.env.CLOUDFLARE_ID_ACCESS_KEY;
    const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const CLOUDFLARE_ENDPOINT = process.env.CLOUDFLARE_ENDPOINT;

    // console.log('EndPoint:', CLOUDFLARE_ENDPOINT);
    // console.log('Access Key:', CLOUDFLARE_ID_KEY);
    // console.log('Secret Access Key:', CLOUDFLARE_SECRET_ACCESS_KEY);

    // console.log(CLOUDFLARE_ID_KEY);
    // console.log(CLOUDFLARE_SECRET_ACCESS_KEY)
    // console.log(CLOUDFLARE_ENDPOINT)

    if (!CLOUDFLARE_ID_KEY || !CLOUDFLARE_SECRET_ACCESS_KEY || !CLOUDFLARE_ENDPOINT) {
      throw new Error("Cloudflare R2 credentials or endpoint are missing!");
    }
    this._r2 = new S3Client({
      region: "ENAM",
      endpoint: CLOUDFLARE_ENDPOINT,
      credentials: {
        accessKeyId: CLOUDFLARE_ID_KEY,
        secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  }
  async delete(key: string): Promise<Error | void> {
    try {
      await this._r2.send(
        new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
          Key: key, // o mesmo `key` que você usou para fazer upload
        })
      );
    } catch (error) {}

    throw new Error("Method not implemented.");
  }
  async upload(key: string, file: Buffer): Promise<Error | void> {
    console.log(key);
    try {
      if (key === undefined) {
        throw new Error("File key not found");
      }
      const result: PutObjectCommandOutput = await this._r2.send(
        new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
          Key: key,
          Body: file,
          ContentType: "application/pdf",
        })
      );
      console.log(result);
    } catch (error) {
      throw error;
    }
  }
  public async listsUploads(): Promise<void> {
    try {
      const result = await this._r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        })
      );
      console.log(result);
    } catch (error) {
      console.error("❌ Erro ao conectar ao bucket do Cloudflare R2:", error);
      throw new Error("ERROR ERROR ERROR.");
    }
  }
  async download(key: string): Promise<Error | string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: key,
      });
      const signedUrl = await getSignedUrl(this._r2, command, { expiresIn: 600 });
      return signedUrl;
    } catch (error) {
      console.error("❌ Erro ao conectar ao bucket do Cloudflare R2:", error);
      throw new Error("ERROR ERROR ERROR.");
    }
  }
}
