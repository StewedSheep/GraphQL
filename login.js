
export default class Login {
    constructor() {
        document.title = "Login"
    }

    render() {
        return `
        <div id="login_page" class="login_page">
            <h1>Login</h1>
            <form id="login_form"">
                <div class="form_input">
                <input type="text" name="username" id="username" placeholder="username">
                </div>
                <div class="form_input">
                <input type="password" name="password" id="password" placeholder="password">
                </div>
                <br>

                <input class="form_submit" type="submit" value="Login">
            </form>
        </div>
                `
    }

    handleLogin = (e) => {
        e.preventDefault()

        const username = e.target.username.value
        const password = e.target.password.value
        const user = { username, password }
        this.login(user)
    }
    login = async (user) => {
        const username = user.username;
        const password = user.password;
        try {
            const response = await axios.post(
                'https://01.kood.tech/api/auth/signin',
                {},
                {
                    auth: {
                        username: username,
                        password: password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("response", response)
            const jwt = response.data;
            localStorage.setItem('jwt', jwt);
            location.reload()

        } catch (error) {
            alert("Wrong login data!")
            console.error('Error:', error.response.data.message);
        }
    }
}