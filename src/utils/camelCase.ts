export function camelCaseAndNormalize(str: string, isUpper?: boolean) {
    try {
        if (isUpper) {
            return (str.slice(0, 1).toUpperCase() + str.slice(1))
                .replace(/([-_/ ]){1,}/g, " ")
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .split(/[-_ ]/)
                .reduce((cur, acc) => {
                    return cur + acc[0]?.toUpperCase() + acc.substring(1);
                });
        }
        return (str.slice(0, 1).toLowerCase() + str.slice(1))
            .replace(/([-_/ ]){1,}/g, " ")
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/[-_ ]/)
            .reduce((cur, acc) => {
                return cur + acc[0]?.toUpperCase() + acc.substring(1);
            });
    } catch (err) {
        return str;
    }
}
