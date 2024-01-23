const User = Vue.component("user", {
    template: `
                <div>
                <nav>
                        <ul class="nav justify-content-end">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/">Welcome</a>
                            </li>
                            <li class="nav-item">
                            <button class="nav-link" href="/#/admin">Admin</button>
                            </li>
                            
                        </ul>
                    </nav>
                    <div style="text-align: center; margin: 20px;">
                            <h1 style="font-size: 24px; color: #333;">User Login</h1>
                            <form @submit.prevent="loginUser" style="margin-top: 20px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-block; width: 80px; text-align: right; margin-right: 10px; font-weight: bold;">Email:</label>
                                    <input type="text" v-model="email" style="padding: 5px; border: 1px solid #ccc;">
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-block; width: 80px; text-align: right; margin-right: 10px; font-weight: bold;">Password:</label>
                                    <input type="password" v-model="password" style="padding: 5px; border: 1px solid #ccc;">
                                </div>
                                <div>
                                    <button type="submit" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Login</button>
                                </div>
                            </form>
                            <div v-if="message" style="margin-top: 10px; color: red;">{{ message }}</div>
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
            message: '',
        }

    },

    methods: {

        async loginUser() {
            try {
                const response = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        u_email: this.email,
                        u_password: this.password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const access_token = data.access_token;
                   
                    localStorage.setItem('access_token', access_token);
                    
                    this.$router.push({ path: "/userdashboard" })
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
            this.$router.push({ path: "/userreg" })
        }
    },

})

export default User;