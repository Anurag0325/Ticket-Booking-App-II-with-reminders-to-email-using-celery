const Admin = Vue.component("admin", {
    template: `
                <div>
                    <nav>
                        <ul class="nav justify-content-end">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/">Welcome</a>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" href="/#/user">User</button>
                            </li>
                        </ul>
                    </nav>
                    <div style="text-align: center; margin: 20px;">
                        <h1 style="font-size: 24px; color: #333;">Admin Login</h1>
                        <div style="margin-top: 20px;">
                            <label for="email" style="margin-right: 10px; font-weight: bold;">Email:</label>
                            <input type="email" id="email" v-model="email" required style="padding: 5px; border: 1px solid #ccc;">
                        </div>
                        <div style="margin-top: 10px;">
                            <label for="password" style="margin-right: 10px; font-weight: bold;">Password:</label>
                            <input type="password" id="password" v-model="password" required style="padding: 5px; border: 1px solid #ccc;">
                        </div>
                        <div style="margin-top: 20px;">
                            <button type="submit" v-on:click="loginAdmin" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Login</button>
                        </div>
                        <div style="margin-top: 20px;">
                            <button v-on:click="register" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Register</button> 
                        </div>
                    </div>

                </div>
            `,

    data() {
        return {
            email: '',
            password: '',
        }
    },

    methods: {

        async loginAdmin() {
            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        a_email: this.email,
                        a_password: this.password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const access_token = data.access_token;
                    localStorage.setItem('access_token', access_token);
                    this.$router.push({ path: "/admindashboard" })
                } else {
                    const errorData = await response.json();
                    alert('Login failed: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error occurred during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        },

        register() {
            this.$router.push({ path: "/adminreg" })
        }
    },
})

export default Admin;