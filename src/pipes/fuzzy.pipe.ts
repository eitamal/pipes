import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fuzzy'
})
export class FuzzyPipe implements PipeTransform {
    transform(value: any, search: string, csensitive: boolean): any {
        let sensitive = csensitive || false;
        let collection: any[] = value instanceof Array ? value : this.toArray(value);

        if (!(collection instanceof Array) || collection == null) {
            return collection;
        }

        search = sensitive ? search : search.toLowerCase();

        return collection.filter(elm => {
            if (typeof elm === "string") {
                var str = elm as string;
                str = sensitive ? str : str.toLocaleLowerCase();
                return this.hasApproxPattern(str, search) !== false;
            }

            return (typeof elm === "object") ? this._hasApproximateKey(elm, search, sensitive) : false;
        });
    }

    private _hasApproximateKey(obj: any, search: string, sensitive: boolean): boolean {
        let properties = Object.keys(obj),
            prop, flag: boolean;
        return 0 < properties.filter(function (elm) {
            prop = obj[elm];

            //avoid iteration if we found some key that equal[performance]
            if (flag) return true;

            if (typeof prop === "string") {
                prop = sensitive ? prop : prop.toLowerCase();
                return flag = this.hasApproxPattern(prop, search) !== false;
            }

            return false;

        }).length;
    }

    private hasApproxPattern(word: string, pattern: string): boolean {
        // cheaper version of indexOf; instead of creating each
        // iteration new str.
        function indexOf(word, p, c) {
            var j = 0;
            while ((p + j) <= word.length) {
                if (word.charAt(p + j) == c) return j;
                j++;
            }
            return -1;
        }
        var p = 0;
        for (var i = 0; i <= pattern.length; i++) {
            var index = indexOf(word, p, pattern.charAt(i));
            if (index == -1) return false;
            p += index + 1;
        }
        return true
    }

    private toArray(obj: any): any[] {
        let arr: any[] = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(obj[key]);
            }
        }

        return arr;
    }
}