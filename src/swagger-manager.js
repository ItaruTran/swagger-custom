
let manager
const key = 'Current-Spec'

export const specs = [
    {
        label: 'Okuro service',
        value: 'https://petstore.swagger.io/v2/swagger.json',
    },
    {
        label: 'Chat service',
        value: 'https://coronavirus-tg-api.herokuapp.com/openapi.json',
    },
]

export function getManager() {
    return manager
}

export function setManager(m) {
    manager = m
}

export function changeSpec(value) {
    // manager.specActions.updateUrl(value)
    localStorage.setItem(key, JSON.stringify(value))
}

export function getCurrentSpec() {
    const current = JSON.parse(localStorage.getItem(key))
    return current ? current : specs[0]
}

export function updateAuthInfo(authInfo) {
    if (authInfo)
        manager.authActions._oldAuthorize(authInfo)
}

export function logout(currentInfo) {
    if (currentInfo) {
        manager.authActions._oldLogout(Object.keys(currentInfo))
    }
}
