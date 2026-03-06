import fs from 'fs/promises'
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';
import fss from 'fs'

class DocumentProcessor {

    async extractText(filePath: string, fileType: string) {

        try {
            switch (fileType) {
                case 'txt':
                    return await this.extractFromTxt(filePath)
                case 'pdf':
                    return await this.extractFromPdf(filePath)
                case 'docx':
                    return await this.extractFromDocx(filePath)
                default:
                    throw new Error(`Unsupported file type: ${fileType}`);
            }
        } catch (error) {
            console.error(`Error extracting text from ${fileType}:`, error);
            throw new Error(`Failed to process ${fileType} file`);
        }
    }

    async extractFromTxt(filePath: string) {
        const buffer = await fs.readFile(filePath);
        return buffer.toString('utf-8');
    }

    async extractFromPdf(filePath: string): Promise<string> {
        const pdfParser = new (PDFParser as any)(null, 1);

        return new Promise((resolve, reject) => {
            pdfParser.on('pdfParser_dataReady', () => {
                const textContent = pdfParser.getRawTextContent();
                resolve(textContent);
            });

            pdfParser.on('pdfParser_dataError', (error: any) => {
                reject(error);
            });

            pdfParser.loadPDF(filePath);
        });
    }

    async extractFromDocx(filePath: string) {
        const buffer = await fs.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    async removeFile(filePath: string) {
        fss.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }

    getFileType(mimetype: string) {
        const typeMap = {
            'text/plain': 'txt',
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'docx',
            'image/jpeg': 'image',
            'image/png': 'image',
            'image/jpg': 'image'
        };
        return typeMap[mimetype as keyof typeof typeMap] || 'unknown';
    }

    cleanText(text: string) {
        if (!text) return '';

        return text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n') // Remove empty lines
            .trim();
    }
}

export default new DocumentProcessor();