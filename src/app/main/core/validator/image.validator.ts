export class ImageValidator{

    static validateFileSize(file: any, size: any): boolean {
        if(file.size > size){
            return false;
        }
        return true;
    }

    static validateFileExtension(file: any, extensions: any): boolean {
        var ext = file.name.substring(file.name.lastIndexOf('.') + 1);

        for(const extension of extensions){
            if(ext.toLowerCase() == extension){
                return true;
            }
        }
        return false;
    }


    static validateFileHeightWidth(file: any, height: any, width: any): boolean {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const imgHeight = img.naturalHeight;
                const imgWidth = img.naturalWidth;
                console.log('Width and Height', imgWidth, imgHeight);

                if(imgHeight > height){
                    console.log('Chacking height...........');
                    return false
                }
                if(imgWidth > width){
                    console.log('Chacking width...........');
                    return false
                }
            };
        };
        return true;
    }

}

