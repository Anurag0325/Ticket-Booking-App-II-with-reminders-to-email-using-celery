const Bookingconfirmation = Vue.component("bookingconfirmation", {
    template: `
                <div>
                    <nav>
                        <ul class="nav justify-content-end">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/#/userdashboard">Home</a>
                            </li>
                            <li class="nav-item">
                            <button class="nav-link" @click="logout">Logout</button>
                            </li>
                        </ul>
                    </nav>
                    <div style="text-align: center; margin: 20px;">
                        <h1 style="color: #007bff;">Hurray!</h1>
                        <h2 style="color: #333;">You have successfully booked your ticket.</h2>
                        
                    </div>
                </div>
            `,

    methods: {
        logout() {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
                .then(response => {
                    if (response.ok) {

                        localStorage.removeItem('access_token');

                        this.$router.push({ path: `/admin` });
                    } else {

                        console.error('Logout failed');
                    }
                })
                .catch(error => {

                    console.error('Error:', error);
                });
        },
    }
})

export default Bookingconfirmation;