const AccountInfo = () => {
    return (
        <form>
            <label for="account">Account: </label> 
            <input type="text" id="account"></input>
            <label for="password">Password: </label>
            <input type="password" id="password"></input>
            <input type="submit"></input>
        </form>
    )
}

export default AccountInfo