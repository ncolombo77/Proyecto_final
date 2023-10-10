export const invalidLimitErrorMsg = (value) => {
    return `
        El límite de resultados es inválido.
        Se esperaba un número entero. Dato recibido: ${value}.
    `;
}