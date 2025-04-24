import AccountInfo from "../components/AccountInfo"

const LoginPage = () => {
    return (
        <section>
            <h1>Login: </h1>

            <AccountInfo/>

            <h3>Don't have an account?</h3>
            <a href="/signup">Sign up</a>
        </section>
    )
}

export default LoginPage