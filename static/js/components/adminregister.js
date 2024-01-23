const Adminregister = Vue.component("adminregister", {
    template: `
                <div>
                <nav style=color:maroon>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/#/admin">Back</a>
                    </li>
                </ul>
            </nav>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <label for="name">Name:</label>
                        <input type="text" v-model="name" placeholder="Enter Name" style="margin: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;" />
                        <label for="email">Email:</label>
                        <input type="text" v-model="email" placeholder="Enter Email" style="margin: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;" />
                        <label for="password">Password</label>
                        <input type="text" v-model="password" placeholder="Enter Password" style="margin: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;" />
                        <button v-on:click="signup" style="background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Sign up</button>
                    </div>
                </div>
            `,

    data() {
        return {
            name: "",
            email: "",
            password: "",
        }
    },

    methods: {
        signup: function () {
            const data = {
                a_name: this.name,
                a_email: this.email,
                a_password: this.password
            };

            fetch("/adminreg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((response) => response.json()).then((data) => {
                console.log(data)
            })
            console.warn("signup", this.name, this.email, this.password)
            this.$router.push({ path: "/admin" })
        }
    }
})

export default Adminregister;