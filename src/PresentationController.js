

export default class FileController {
    constructor(fileName, file) {

        this.fileName = fileName;

        this.file = file;

        this.binaryFile = null;

        this.pdf = null;

        this.actualPage = null;

    }

    readFile() {
        return new Promise((resolve, reject) => {
            if (!this.file)
                reject('Not file found');
            var reader = new FileReader();
            reader.onload = function(e) {
                let content = e.target.result;
                let content2 = content.slice(content.indexOf(',') + 1, -1);
                resolve(content2);
            }
            reader.readAsDataURL(this.file);
        });

    }

    convertToBinary(fileBase64) {
        this.binaryFile = atob(fileBase64);
        return this.binaryFile;
    }

    getBinaryFile() {
        return this.binaryFile;
    }

    getPdf() {
        return this.pdf;
    }

    getActualPage() {
        return this.actualPage;
    }

    getPage(pdf, number) {
        return new Promise((resolve, reject) => {
            if (!pdf)
                reject("Error: falta pdf");
            if (!number)
                reject("Error: falta página");
            pdf.getPage(number).then((page) => {
                resolve(page);
            });
        })

    }

    getDocument(binaryFile) {
        return new Promise((resolve, reject) => {
            if (!this.binaryFile)
                reject("No existe el archivo binario");
            PDFJS.getDocument({data: this.binaryFile}).then(function(pdf) {
                resolve(pdf);
    		}).catch(function(error) {
                reject(error);
    			console.log(error);
    		});
        });
    }

    createPdfPage() {

    }
}
