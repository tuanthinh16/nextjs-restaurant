export const formatTime = (numTime: string | number | undefined) => {
    if (!numTime) return;
    const str = numTime.toString();
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);
    const hour = str.slice(8, 10);
    const minute = str.slice(10, 12);
    const second = str.slice(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};