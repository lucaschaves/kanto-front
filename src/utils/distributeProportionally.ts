type Item = { [key: string]: any };

export function distributeProportionally<T extends Item>(
    newTotal: number,
    items: T[],
    property: keyof T
): T[] {
    const currentTotal = items.reduce(
        (sum, item) => sum + Number(item[property]),
        0
    );
    return items.map((item) => ({
        ...item,
        [property]: (
            (Number(item[property]) / currentTotal) *
            newTotal
        ).toFixed(2),
    }));
}
