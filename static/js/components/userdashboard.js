const Userdashboard = Vue.component("userdashboard", {
    template: `
                <div>
                    <div>
                    <nav style=color:maroon>
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/#/userdashboard">Home</a>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" @click="logout">Logout</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" @click="userbooking">Booking</button>
                        </li>
                    </ul>
                </nav>
                <div style="text-align: center; margin: 20px;">
                    <h1 style="font-size: 24px; color: #333;">User Dashboard</h1>
                    <h2 style="font-size: 20px; color: #555;">Welcome {{ username }}</h2>

                    <div class="form" style="margin-top: 20px;">
                        <form @submit.prevent="search">
                            <div class="dropdown" style="margin-bottom: 10px;">
                                <select v-model="searchTerm" style="padding: 5px;">
                                    <option value="">Select an option</option>
                                    <option value="option1">Place</option>
                                    <option value="option2">Ratings</option>
                                    <option value="option3">Tags</option>
                                </select>
                            </div>
                            <div class="placeholder" style="margin-bottom: 10px;">
                                <input v-model="searchPlace" type="text" name="searchplace" id="searchplace" placeholder="Search..." style="padding: 5px; border: 1px solid #ccc;">
                            </div>
                            <div class="search">
                                <button @click:submit style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Search</button>
                            </div>
                        </form>
                    </div>

                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 8px;">ID</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Starttime</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Endtime</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Ratings</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Tags</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Location</th>
                                <th style="border: 1px solid #ccc; padding: 8px;">Book</th>
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
                                <td style="border: 1px solid #ccc; padding: 8px;">{{ getVenueLocation(show.venue_id) }}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">
                                    <button @click="bookTicket(show.s_id, username)" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Book</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-top: 20px;"><button @click="logout" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Logout</button></div>
                </div>
                </div>
                </div>
            `,


    data() {
        return {
            shows: [],
            venues: [],
            username: '',
            searchTerm: '',
            searchPlace: ''
        };
    },

    mounted() {
        this.fetchShows();
        this.fetchVenues();
        this.fetchUserData();
    },

    methods: {
        fetchShows() {
            fetch('/showget')
                .then((response) => response.json())
                .then((data) => (this.shows = data))
                .catch((error) => console.error('Error fetching shows:', error));
        },

        fetchVenues() {

            fetch('/venueget')
                .then((response) => response.json())
                .then((data) => {

                    if (data.hasOwnProperty('venues') && Array.isArray(data.venues)) {

                        this.venues = data.venues.map((venue) => ({
                            v_id: venue.v_id,
                            v_name: venue.v_name,
                            v_location: venue.v_location,
                            v_place: venue.v_place,
                            v_capacity: venue.v_capacity,
                        }));
                    } else {
                        console.error('Venues data is not an array:', data);
                    }
                })
                .catch((error) => console.error('Error fetching venues:', error));
        },

        fetchUserData() {
            fetch('/user/data', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
            })
                .then(response => response.json())
                .then(data => {

                    this.username = data.u_name;
                })
                .catch(error => console.error('Error fetching user data:', error));
        },

        navigateToPlacePage(placeId) {
            this.$router.push({ path: `/place/${placeId}` });
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

        bookTicket(showId) {
            if (this.username) {
                this.$router.push({ path: `/booking/${showId}/${this.username}`, query: { v_place: this.$route.params.v_place, username: this.username } });
            } else {

                console.error('User information not available.');
            }
        },

        search() {
            if (this.searchTerm && this.searchPlace) {
                if (this.searchTerm === 'option1') {

                    this.$router.push('/placeresults/' + encodeURIComponent(this.searchPlace));
                    console.log("Hello")
                } else if (this.searchTerm === 'option2') {

                    this.$router.push('/ratingresults/' + encodeURIComponent(this.searchPlace));
                } else if (this.searchTerm === 'option3') {

                    this.$router.push('/tagresults/' + encodeURIComponent(this.searchPlace));
                } else {
                    this.$router.push('/errorpage')
                }
            }
        },

        userbooking(username) {
            this.$router.push({ path: `/userbooking/${this.username}` })
        },
    },

    computed: {
        getVenueLocation() {
            return (venueId) => {
                const venue = this.venues.find((v) => v.v_id === venueId);
                console.log(venueId)
                return venue ? venue.v_location : 'N/A';
            };
        },
        getVenuePlace() {
            return (venueId) => {
                const venue = this.venues.find((v) => v.v_id === venueId);
                return venue ? venue.v_place : 'N/A';
            };
        },


    }

})

export default Userdashboard;