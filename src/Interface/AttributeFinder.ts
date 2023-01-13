export const findAttribute = (attributeName: string, dataSet: Array<number | string>[], titleEntry: Array<number | string>, schoolYearShowing: string, selectedRow?: (string | number)[]) => {
    if (!selectedRow) {
        selectedRow = dataSet.filter(row => row[0] === schoolYearShowing)[0];
    }
    return dataSet.length ? ((selectedRow[titleEntry.indexOf(attributeName)]) as number) : 0;
};
