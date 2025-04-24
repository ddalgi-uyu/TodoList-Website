import AccountInfo from "../components/AccountInfo"

const SignupPage = () => {
    return (
        <section>
            <h1>Signup: </h1>

            <AccountInfo/>

            <h3>Already have an account?</h3>
            <a href="/login">Ligin</a>
        </section>
    )
}

export default SignupPage