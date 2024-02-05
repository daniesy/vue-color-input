export const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const generateHash = (source: string): string => {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
        hash = (hash << 5) - hash + source.charCodeAt(i);
        hash &= hash; // Convert to 32bit integer
    }
    return (hash >>> 0).toString(36);
};