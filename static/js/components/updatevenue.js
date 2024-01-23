const Updatevenue = Vue.component("updatevenue", {
    template: `<div>
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
                        <h1>Update venue page!</h1>
                        <label for="v_name" style="margin-right: 10px;">Name</label>
                        <input type="text" id="v_name" name="v_name" :placeholder="venue.v_name" v-model="name" style="margin-right: 20px; padding: 5px;">
                        <label for="v_place" style="margin-right: 10px;">Place</label>
                        <input type="text" id="v_place" name="v_place" :placeholder="venue.v_place" v-model="place" style="margin-right: 20px; padding: 5px;">
                        <label for="v_location" style="margin-right: 10px;">Location</label>
                        <input type="text" id="v_location" name="v_location" :placeholder="venue.v_location" v-model="location" style="margin-right: 20px; padding: 5px;">
                        <label for="v_capacity" style="margin-right: 10px;">Capacity</label>
                        <input type="text" id="v_capacity" name="v_capacity" :placeholder="venue.v_capacity" v-model="capacity" style="margin-right: 20px; padding: 5px;">
                        <button @click="updateVenue()" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Update Venue</button>
                    </div>
                    </div>
            `,

    data: function () {
        return {
            venue: {},
            name: "",
            place: "",
            location: "",
            capacity: "",
        };
    },

    created: function () {

        const venueId = this.$route.params.venue_id;
        this.fetchVenueDetails(venueId);
    },

    methods: {
        fetchVenueDetails(venueId) {
            fetch(`/venueget/${venueId}`)
                .then((response) => response.json())
                .then((data) => {
                    this.venue = data;
                    this.name = data.v_name;
                    this.place = data.v_place;
                    this.location = data.v_location;
                    this.capacity = data.v_capacity;
                })
                .catch((error) => {
                    console.error("Error fetching venue details:", error);
                });
        },

        updateVenue() {

            const venueId = this.$route.params.venue_id;
            const updatedVenue = {
                v_name: this.name,
                v_place: this.place,
                v_location: this.location,
                v_capacity: this.capacity,
            };

            fetch(`/venueget/${venueId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedVenue),
            })
                .then((response) => response.json())
                .then((data) => {

                    this.venue = data;

                    this.$router.push(`/admindashboard`);
                })
                .catch((error) => {
                    console.error("Error updating venue:", error);
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
    },
})

export default Updatevenue;