const getInitials = name => {
    const names = name.split(" ");
    if (names.length === 1) return names[0][0];
    else if (name.length > 1) return `${names[0][0]}${names[1][0]}`;
    return 'A';
}


export const UTILS = {getInitials};