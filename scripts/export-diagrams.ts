import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from '@mermaid-js/mermaid-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DiagramExport {
    source: string;
    outputPath: string;
    title: string;
}

/**
 * Extract Mermaid diagrams from a Markdown file
 */
function extractMermaidDiagrams(markdownPath: string): DiagramExport[] {
    const content = fs.readFileSync(markdownPath, 'utf-8');
    const diagrams: DiagramExport[] = [];

    // Match mermaid code blocks
    const mermaidRegex = /```mermaid\n([\s\S]+?)\n```/g;
    let match;
    let index = 0;

    const filename = path.basename(markdownPath, '.md');

    while ((match = mermaidRegex.exec(content)) !== null) {
        index++;
        diagrams.push({
            source: match[1],
            outputPath: path.join(__dirname, `../public/diagrams/${filename}-diagram-${index}.svg`),
            title: `${filename} - Diagram ${index}`,
        });
    }

    return diagrams;
}

/**
 * Export a single Mermaid diagram to SVG
 */
async function exportDiagramToSVG(diagram: DiagramExport): Promise<void> {
    // Create temporary mermaid file
    const tempMmdPath = path.join(__dirname, `temp-${Date.now()}.mmd`);
    fs.writeFileSync(tempMmdPath, diagram.source);

    try {
        // Ensure output directory exists
        const outputDir = path.dirname(diagram.outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Export to SVG using mermaid-cli
        await run(
            tempMmdPath,
            diagram.outputPath,
            {
                parseMMDOptions: {
                    backgroundColor: '#020617', // slate-950
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#e879f9',
                        primaryTextColor: '#f1f5f9',
                        primaryBorderColor: '#1e293b',
                        lineColor: '#64748b',
                        secondaryColor: '#0f172a',
                        tertiaryColor: '#020617',
                    },
                },
            }
        );

        console.log(`✅ Exported: ${diagram.outputPath}`);
    } catch (error) {
        console.error(`❌ Failed to export ${diagram.title}:`, error);
    } finally {
        // Clean up temp file
        if (fs.existsSync(tempMmdPath)) {
            fs.unlinkSync(tempMmdPath);
        }
    }
}

/**
 * Export all diagrams from blog posts
 */
async function exportAllDiagrams(): Promise<void> {
    const blogDir = path.join(__dirname, '../src/content/blog');
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

    console.log('📊 Exporting Mermaid diagrams to SVG...\n');

    let totalDiagrams = 0;

    for (const file of files) {
        const filePath = path.join(blogDir, file);
        const diagrams = extractMermaidDiagrams(filePath);

        if (diagrams.length > 0) {
            console.log(`📝 Processing ${file}: ${diagrams.length} diagram(s)`);

            for (const diagram of diagrams) {
                await exportDiagramToSVG(diagram);
                totalDiagrams++;
            }

            console.log('');
        }
    }

    console.log(`\n✨ Exported ${totalDiagrams} diagrams total`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    exportAllDiagrams().catch(err => {
        console.error('Export failed:', err);
        process.exit(1);
    });
}

export { exportAllDiagrams, extractMermaidDiagrams, exportDiagramToSVG };
