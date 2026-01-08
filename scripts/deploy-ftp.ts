import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "ftp.gb.stackcp.com",
            user: "prod_deploy@shahidster.tech",
            password: "17Day11month!",
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
