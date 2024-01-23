const VenueShow = Vue.component("venueshow", {
    template: `
                <div>
                    <div>
                    <nav style=color:maroon>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/#/admindashboard">Back</a>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" @click="logout">Logout</button>
                    </li>
                </ul>
            </nav>
            </div>
            <div style="text-align: center; margin: 20px;">
                    <h1 style="font-size: 24px; color: #333;">Shows for Venue: {{ venue.v_name }}</h1>
                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 8px;">ID</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Start Time</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">End Time</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Ratings</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Tags</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Update Show</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Delete Show</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="show in shows" :key="show.s_id">
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_id }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_name }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_starttime }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_endtime }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_ratings }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_tags }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ show.s_price }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">
                                    <router-link v-if="show.s_id" :to="getUpdateShowLink(show.s_id)" :query="{ venueId: venue_id }" style="text-decoration: none; color: #007bff;">Update Show</router-link>
                                </td>
                                <td style="border: 1px solid #ccc; padding: 8px;">
                                    <button v-on:click="getDeleteLink(show.s_id)" style="padding: 5px 10px; background-color: #dc3545; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Delete Show</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button v-on:click="showregister" style="margin-top: 20px; padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Add new shows</button>
                </div>

                </div>
            `,

    props: {
        venue_id: {
            type: [Number, String],
            required: true,
        }
    },

    data() {
        return {
            venue: {},
            shows: []
        }
    },

    mounted() {

        const venue_id = Number(this.venue_id)
        console.log("venueId:", venue_id);
        this.fetchVenue(venue_id);
        this.fetchShows(venue_id);
    },

    methods: {
        fetchVenue(venue_id) {
            fetch(`/venueget/${venue_id}`).then((r) => r.json()).then((data) => {
                this.venue = data
            }).catch((error) => {
                console.error("Error fetching venue:", error)
            })
        },

        fetchShows(venue_id) {
            fetch(`/shows/venue/${venue_id}`).then((r) => r.json()).then((data) => {
                this.shows = data
            }).catch((error) => {
                console.error("Erorr fetching shows:", error)
            })
        },

        showregister: function () {
            this.$router.push({ path: `/showreg/${Number(this.venue_id)}` })
        },

        getUpdateShowLink(showId) {
            console.log("last venue_id: ", this.venue_id)
            return `/updateshow/${showId}`;
        },

        getDeleteLink(showId) {
            console.log("showId:", showId)
            fetch(`/shows/${showId}`, {
                method: "Delete",
            })
                .then((r) => r.json())
                .then((data) => {
                    this.venues = data.venues;
                    this.fetchShows(this.venue_id);
                })
                .catch((error) => {
                    console.error("Error deleting venue:", error);
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

export default VenueShow;