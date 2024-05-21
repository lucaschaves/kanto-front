function capitalize(str: any) {
    if (typeof str !== "string") {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
}

export { capitalize };
