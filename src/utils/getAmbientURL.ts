export const getAmbientURL = () => {
    // if (
    //     ["localhost", import.meta.env.VITE_IP].includes(
    //         window.location.hostname
    //     )
    // ) {
    return import.meta.env.VITE_BASE_URL;
    // }

    // return `${window.origin}/api/v1`;
};
