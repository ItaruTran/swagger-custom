
const key = 'Auth-Info'
const profileKey = 'Profile'
const data = localStorage.getItem(key)
const storage = data ? JSON.parse(data) : {Default: null}

export function saveAuthInfo(profile, payload) {
    storage[profile] = payload

    localStorage.setItem(key, JSON.stringify(storage))

    return getProfiles()
}

export function getAuthInfo(profile) {
    localStorage.setItem(profileKey, profile)
    return storage[profile]
}

export function getProfiles() {
    const profiles = []

    for (const value in storage) {
        const element = storage[value];
        if (element)
            profiles.push({
                value,
                label: `🔐 ${value}`,
            })
        else
            profiles.push({
                value,
                label: `🔓 ${value}`,
            })
    }

    return profiles
}

export function getCurrentProfile() {
    let profile = localStorage.getItem(profileKey)
    if (!profile)
        profile = 'Default'

    return profile
}
