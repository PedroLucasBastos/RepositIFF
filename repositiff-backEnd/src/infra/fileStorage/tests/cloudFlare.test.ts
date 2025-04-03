import { describe, it, expect } from "vitest";
import "dotenv/config";
import { CloudFlareFileStorage } from "../cloudFlare-fileStorage.js";
import fs from "fs/promises";
import path from "path";

describe("Cloudflare R2 Connection", () => {
    it("should be able to upload file to buckets without error", async () => {
        try {
            const cloudFlare = new CloudFlareFileStorage();
            // await cloudFlare.listsUploads();

            const fileBuffer = await fs.readFile(path.join(__dirname, "test3.png"));
            await cloudFlare.upload("upload-test.jpg", fileBuffer);
        } catch (error) {
            console.error("Cloudflare R2 connection failed:", error);
            throw error;
        }
    });

    it("should be able to get download link, to file in bucket", async () => {
        try {
            const cloudFlare = new CloudFlareFileStorage();
            // await cloudFlare.listsUploads();

            const result = await cloudFlare.download("upload-test.jpg");
            console.log(result);
        } catch (error) {
            console.error("Cloudflare R2 connection failed:", error);
            throw error;
        }
    });
});
