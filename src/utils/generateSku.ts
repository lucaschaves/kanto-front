export const generateSku = (prefix: number, serial: number): string => {
    let value: any = prefix;
    if (prefix.toString().length === 1) {
        value = `0${prefix}`;
    }
    const lengthSerial = serial.toString().length;
    if (lengthSerial < 10) {
        const serialStr = serial.toString().padStart(10 - lengthSerial, "0");
        return `${value}${serialStr}`;
    }
    return `${value}${serial}`;
};
