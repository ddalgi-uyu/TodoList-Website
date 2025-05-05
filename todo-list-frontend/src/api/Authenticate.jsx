const Authenticate = async ({apiBase, token, emailVal, passVal}) => {
    
    let isRegistration = false

    try {
        let data
        if (isRegistration) {
            // register an account
            const response = await fetch(apiBase + 'auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: emailVal, password: passVal })
            })
            data = await response.json()
        } else {
            // login an account
            const response = await fetch(apiBase + 'auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: emailVal, password: passVal })
            })
            data = await response.json()
        }

        if (data.token) {
            token = data.token
            localStorage.setItem('token', token)

            // authenicating into loading

            // fetch todos
            
        } else {
            throw Error('Failed to authenticate...')
        }
    } catch (err) {
        console.log(err.message)
    }

    return isRegistration
}

export default Authenticate