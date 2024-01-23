

const PlaceDetails = Vue.component("placedetails", {
    template: `
                <div>
                    <nav style=color:maroon>
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/#/userdashboard">Back</a>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" @click="logout">Logout</button>
                        </li>
                    </ul>
                </nav>

                    <div style="text-align: center; margin: 20px;">
                        <h1 style="color: #007bff;">Place Details</h1>
                        <div v-if="venue" style="margin-top: 20px;">
                            <h2>{{ venue.v_name }}</h2>
                            <h3>Shows at this place:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="border: 1px solid #ccc; padding: 8px;">ID</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Start Time</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">End Time</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Ratings</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Tags</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
                                        <th style="border: 1px solid #ccc; padding: 8px;">Booking</th>
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
                                            <button @click="bookTicket(show.s_id, username)" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Book</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else style="margin-top: 20px;">
                            <h2>No venue details found.</h2>
                        </div>
                        </div>
                    </div>

    `,

    data() {
        return {
            venue: [],
            shows: [],
            username: null,
        };
    },

    mounted() {

        const venue = this.$route.params.v_place;
        this.fetchVenueDetails(venue);
        this.fetchShowsForVenue(venue);
        this.fetchCurrentUser();

    },

    methods: {
        fetchVenueDetails(venue) {
            fetch(`/venueplace/${venue}`)
                .then((response) => response.json())
                .then((data) => {
                    this.venue = data;
                })
                .catch((error) => console.error('Error fetching venue details:', error));
        },

        fetchShowsForVenue(venue) {
            fetch(`/venueplace/${venue}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const venueId = Number(data.v_id);
                    fetch(`/shows/place/${venue}`)
                        .then((response) => response.json())
                        .then((showsData) => {
                            this.shows = showsData.map(show => {
                                const bookedSeats = show.bookings ? show.bookings.reduce((total, booking) => total + booking.b_seatsbooked, 0) : 0;
                                show.s_seats_available = show.s_capacity - bookedSeats > 0;
                                return show;
                            });
                        })
                        .catch((error) => console.error('Error fetching shows for venue:', error));
                })
                .catch((error) => console.error('Error fetching venue details:', error));
        },

        fetchCurrentUser() {
            fetch('/user/data', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
            })
                .then(response => response.json())
                .then(data => {

                    this.username = data.u_name;
                    console.log(this.username);
                })
                .catch(error => console.error('Error fetching current user:', error));
        },

        bookTicket(showId) {
            if (this.username) {
                this.$router.push({ path: `/booking/${showId}/${this.username}`, query: { v_place: this.$route.params.v_place, username: this.username } });
            } else {

                console.error('User information not available.');
            }
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

                        console.error('Logout failed');
                    }
                })
                .catch(error => {

                    console.error('Error:', error);
                });
        },
    }


});

export default PlaceDetails;

