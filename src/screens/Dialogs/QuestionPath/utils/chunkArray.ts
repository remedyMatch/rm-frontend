export function chunkArray(array: Array<any>, chunkSize: number): Array<Array<any>> {
    if (chunkSize % 1 !== 0) {
        throw TypeError("chunkSize can only be integer!")
    }
    let R = [];
    for (let i = 0; i < array.length; i += chunkSize)
        R.push(array.slice(i, i + chunkSize));
    return R;
}