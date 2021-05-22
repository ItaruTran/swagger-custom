
let manager
const key = 'Current-Spec'

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

export function getCurrentSpec(specs) {
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
