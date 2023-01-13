export const findAttribute = (attributeName: string, titleEntry: Array<number | string>, selectedRow: (string | number)[]) => {
    if (titleEntry && titleEntry.length) {
        return ((selectedRow[titleEntry.indexOf(attributeName)]) as number) || 0;
    }
    return 0;
};
