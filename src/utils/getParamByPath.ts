const getParamByPath = (pathname: string, index: number) => {
    try {
        return pathname.split("/")[index];
    } catch (err) {
        console.error("getParam", err);
        return "";
    }
};

export { getParamByPath };
