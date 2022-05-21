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
        if(nameArr.length == 0) {
            letters = "?";
        }
        else if (nameArr.length == 1) {
            letters = nameArr[0][0];
        }
        else {
            letters = nameArr[0][0];
            letters += nameArr[1][0];
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