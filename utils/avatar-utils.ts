export namespace AvatarUtils {

    export function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    export function stringAvatar(name: string) {
        let letters = "";
        const nameArr = name.split(' ');
        for (let i = 0; i < nameArr.length; i++) {
            letters += nameArr[i][0]
        }
        return letters;
    }

    export function getColorWithLetters(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: stringAvatar(name),
        };
    }

}