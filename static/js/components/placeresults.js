const Placeresults = Vue.component("placeresults", {
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
    <h1 style="color: #007bff;">Place search page</h1>
    <h2>Shows for {{ searchplace }}</h2>
    <div style="margin-top: 20px;">
        <table class="content-table" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ccc; padding: 8px;">Id</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Start Time</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">End Time</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Rating</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Tags</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Book</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in shows" :key="s.s_id">
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_id }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_name }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_starttime }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_endtime }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_ratings }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_tags }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">{{ s.s_price }}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">
                        <router-link :to="getBookingLink(s.s_id)">Book</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

            </div>
            `,

    props: {
        searchplace: String,
    },

    data() {
        return {
            shows: [],
            current_user: "{{ current_user }}",
        }

    },
    computed: {
        bookingText() {
            return 'Book';
        }
    },
    created() {

        this.fetchShows();

    },

    methods: {
        fetchShows() {
            fetch(`/shows/place/${this.searchplace}`).then((r) => r.json()).then((data) => {
                this.shows = data;
                console.log(this.shows)
            }).catch((error) => {
                console.error('Error fetching shows:', error);
            })
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

                        this.$router.push({ path: `/admin` });
                    } else {

                        console.error('Logout failed');
                    }
                })
                .catch(error => {

                    console.error('Error:', error);
                });
        },

        getBookingLink(showId) {
            const username = 'username';
            return `/booking/${showId}/${username}`;
        },

    }
})

export default Placeresults;