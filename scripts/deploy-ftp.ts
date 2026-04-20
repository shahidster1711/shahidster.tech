import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) {
            throw new Error("Missing FTP credentials in environment variables");
        }

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false
        })
        console.log("Connected to FTP server")

        const distPath = path.resolve(__dirname, "../dist")
        console.log(`Uploading contents of ${distPath} to FTP root /`)

        await client.uploadFromDir(distPath, "/")
        console.log("Deployment successful!")
    } catch (err) {
        console.error("Deployment failed:", err)
    } finally {
        client.close()
    }
}

deploy()
