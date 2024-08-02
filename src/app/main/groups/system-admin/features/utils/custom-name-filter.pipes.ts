import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'customNameFilter',
    pure: false
})
export class CustomNameFilterPipes implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((item) => item.name.trim().toLowerCase().includes(args.toLowerCase()));
    }
}
