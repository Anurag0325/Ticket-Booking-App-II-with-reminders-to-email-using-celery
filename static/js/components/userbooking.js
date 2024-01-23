const Userbooking = Vue.component("userbooking", {
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
            <div class="table" style="margin-top: 20px;">
            <h2 style="color: rgb(241, 15, 45); font-size: 24px; margin-bottom: 10px;">Bookings for {{ username }}</h2>
            <table class="content-table" style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
                <thead>
                    <tr>
                        <th style="padding: 10px; text-align: left; background-color: #f2f2f2;">Id</th>
                        <th style="padding: 10px; text-align: left; background-color: #f2f2f2;">Number of tickets</th>
                        <th style="padding: 10px; text-align: left; background-color: #f2f2f2;">Show Name</th>
                        <th style="padding: 10px; text-align: left; background-color: #f2f2f2;">Place</th>
                        <th style="padding: 10px; text-align: left; background-color: #f2f2f2;">Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="booking in user_bookings" :key="booking.b_id">
                        <td style="padding: 10px; border: 1px solid #ccc;">{{ booking.b_id }}</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">{{ booking.b_seatsbooked }}</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">{{ booking.s_name }}</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">{{ booking.v_place }}</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">{{ booking.v_location }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
            </div>`
    ,

    props: {
        current_user: Object,
        username: String
    },

    data() {
        return {
            user_bookings: [],
        }
    },

    created() {
        this.fetchUserBookings();
    },


    methods: {
        fetchUserBookings() {

            fetch(`/userbooking/${this.username}`)
                .then(response => response.json())
                .then(data => {
                    this.user_bookings = data.user_bookings;
                })
                .catch(error => {
                    console.error("Error fetching user bookings:", error);
                });
        },

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

                        this.$router.push({ path: `/user` });
                    } else {

                        console.error('Logout failed');
                    }
                })
                .catch(error => {

                    console.error('Error:', error);
                });
        },

    },
})

export default Userbooking;