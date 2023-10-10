export const createUserErrorMsg = (user) => {
    return `
        Uno o más campos son inválidos.
        Listado de campos requeridos:
        name: Campo obligatorio y de tipo string. Dato recibido ${user.name}.
        lastname: Campo obligatorio y de tipo string. Dato recibido ${user.lastname}.
        email: Campo obligatorio y de tipo string. Dato recibido ${user.email}.
    `;
}