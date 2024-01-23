const Allshows = Vue.component("allshows", {
    template: `
                <div>
                <div>
                <nav>
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/#/admindashboard">Home</a>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" @click="logout">Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>

                <div class="table" style="margin: 20px;">
                <h2 style="font-size: 24px; color: #333; margin-bottom: 20px;">All shows</h2>
                <table class="content-table" style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Id</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Name</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Start Time</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">End Time</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Rating</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Tags</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Price</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Venue ID</th>
                            <th style="padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sh in shows" :key="sh.s_id" style="background-color: #fff; border: 1px solid #ccc;">
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_id }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_name }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_starttime }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_endtime }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_ratings }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_tags }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.s_price }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">{{ sh.venue_id }}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;"><button @click="deleteShow(sh.s_id)" class="delete" style="cursor: pointer; background-color: #f44336; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Delete Show</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    `,

    data() {
        return {
            shows: [],
        };
    },

    created() {
        this.fetchShows();
    },

    methods: {
        fetchShows() {
            fetch('/allshows')
                .then(response => response.json())
                .then(data => {
                    this.shows = data.shows;
                })
                .catch(error => {
                    console.error('Error fetching shows:', error);
                });
        },

        deleteShow(showId) {
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

                        console.error('Logout failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
    },


});

export default Allshows;
