export class CommonValidator{

    // for code check is unique
    static isCodeUsed(modelList: any, id: any,  code: string, isCreate: boolean): boolean{
        for (const obj of modelList){
            // check for update
            if (!isCreate && id === obj.id){
                continue;
            }
            const formValue = code.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            const dbValue = obj.code.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            if (dbValue.toUpperCase() === formValue.replace(/\s/g, '').toUpperCase()){
                return true;
            }
        }
        return false;
    }

    // for code check is unique
    static isNameUsed(modelList: any, id: any,  name: string, isBanglaName: boolean, isCreate: boolean): boolean{
        for (const obj of modelList){
            // check for update
            if (!isCreate && id === obj.id){
                continue;
            }
            const formValue = isBanglaName ? name : name.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            const dbName = isBanglaName ? obj.banglaName : obj.name;
            const dbValue = isBanglaName ? dbName : dbName.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            if (dbValue.toUpperCase() === formValue.replace(/\s/g, '').toUpperCase()){
                return true;
            }
        }
        return false;
    }

    static isContainsAnySpecialChar(value: any): boolean{
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(value);
    }

    static isContainsUpper(value: any): boolean{
        const format = /[A-Z]/;
        return format.test(value);
    }

    static isContainsLower(value: any): boolean{
        const format = /[a-z]/;
        return format.test(value);
    }

    static isContainsAlpha(value: any): boolean{
        const format = /[a-zA-Z]/;
        return format.test(value);
    }

    static isContainsNumeric(value: any): boolean{
        const format = /[0-9]/;
        return format.test(value);
    }

    static isContainsSequential(s: any): boolean{
        // Check for sequential numerical characters
        for ( const i in s) {
            if (+s[+i + 1] === +s[i] + 1 &&
                +s[+i + 2] === +s[i] + 2) {return false; }
        }
        // Check for sequential alphabetical characters
        for (const i in s){
            if (String.fromCharCode(s.charCodeAt(i) + 1) === s[+i + 1] &&
                String.fromCharCode(s.charCodeAt(i) + 2) === s[+i + 2]) {return false; }
        }

        return true;
    }




    // for check is negetive
    static isNegetiveNumber(value: number): boolean{
        if (value < 0){
            return true;
        }
        return false;
    }



}

