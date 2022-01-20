export const capitalise = (s: string): string => {
    if (!s) {
        return;
    }
    if (s.length == 1) {
        return s.toUpperCase();
    }
    return s[0].toUpperCase() + s.slice(1);
}