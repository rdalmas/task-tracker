const generateId = (): string => {
    return Math.floor(Math.random() * Date.now()).toString(16);
}

export {
    generateId
}