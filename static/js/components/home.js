const Home = Vue.component("home", {
    template: `
                <div>
                <div>
                    <nav>
                        <ul class="nav justify-content-end">
                            
                        </ul>
                    </nav>
                </div>

                    <div style="text-align: center; margin: 20px;">
                        <h1 style="color: #007bff;">Welcome to the Ticket Booking App!</h1>
                        
                        <router-link to="/admin" style="margin: 10px; display: block; text-decoration: none; color: #007bff;">Admin Login</router-link>
                        <router-link to="/user" style="margin: 10px; display: block; text-decoration: none; color: #007bff;">User Login</router-link>
                    </div>
                </div>
            `
})

export default Home;