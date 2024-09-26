import laravelApiUtils from './config'

export default async function registerCollaborator(collaborator) {
    // Fazer validação de erros e um handle pro front
    await fetch(`${laravelApiUtils.localBaseUrl}/collaborators`, {
        method: 'POST',
        headers: {
            ...laravelApiUtils.header,
        },
        body: JSON.stringify({
            collaborator
        })
    })
}

export default async function registerCsvCollaborator(file) {
        // Fazer validação de erros e um handle pro front
        await fetch(`${laravelApiUtils.localBaseUrl}/collaborators`, {
            method: 'POST',
            headers: {
                ...laravelApiUtils.header,
            },
            body: JSON.stringify({
                file: file
            })
        })
}