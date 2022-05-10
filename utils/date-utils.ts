export namespace DateUtils {

    export function toLocalDateString(date: string) {
        const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let d = new Date(date);
        return d.toLocaleDateString(undefined, options);
    }

}