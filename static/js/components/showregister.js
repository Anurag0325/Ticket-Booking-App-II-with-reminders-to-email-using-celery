const Showregister = Vue.component("showregister", {
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
                <div>
                <div style="text-align: center; margin: 20px;">
                        <h1>Welcome to the Shows</h1>
                        <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                            <div style="margin: 10px;">
                                <label for="s_name">Name</label>
                                <input type="text" id="s_name" name="s_name" v-model="name" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="s_starttime">Start Time</label>
                                <input type="text" id="s_starttime" name="s_starttime" v-model="starttime" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="s_endtime">End Time</label>
                                <input type="text" id="s_endtime" name="s_endtime" v-model="endtime" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="s_ratings">Rating</label>
                                <input type="text" id="s_ratings" name="s_ratings" v-model="ratings" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="s_tags">Tags</label>
                                <input type="text" id="s_tags" name="s_tags" v-model="tags" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="s_price">Price</label>
                                <input type="text" id="s_price" name="s_price" v-model="price" style="padding: 5px;">
                            </div>
                            <div style="margin: 10px;">
                                <label for="venue_id">Venue Name</label>
                                <input type="text" id="venue_id" v-model="selectedVenueName" :readonly="true" style="padding: 5px;">
                                <button @click="openVenueDropdown" style="background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Select Venue</button>
                                <div v-if="showVenueDropdown" style="position: absolute; background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 1;">
                                    <div v-for="venue in venues" :key="venue.v_id" @click="selectVenue(venue)">
                                        {{ venue.v_name }}
                                    </div>
                                </div>
                            </div>
                            <div style="margin: 10px;">
                                <button @click="addshow" style="background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Add shows</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            `,

    data() {
        return {
            name: "",
            starttime: "",
            endtime: "",
            ratings: "",
            tags: "",
            price: "",
            venue: null,
            selectedVenueName: "",
            showVenueDropdown: false,
            venues: [],
        }
    },

    props: {
        venue_id: {
            type: [Number, String],
            required: true,
        },
    },

    mounted() {
        const venue_id = Number(this.venue_id)
        this.fetchVenues()
        this.fetchShows()
    },



    methods: {
        addshow: function () {
            const data = {
                s_name: this.name,
                s_starttime: this.starttime,
                s_endtime: this.endtime,
                s_ratings: this.ratings,
                s_tags: this.tags,
                s_price: this.price,
            };

            fetch(`/postshows/${this.venue_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((response) => response.json()).then((data) => {
                console.log(data)
                this.$router.push({ path: `/venueshow/${this.venue_id}` });
            })
            console.warn("addshow", this.name, this.starttime, this.endtime, this.ratings, this.tags, this.price)
        },

        fetchVenues() {
            const venue_id = Number(this.venue_id);
            fetch(`/venueget/${this.venue_id}`)
                .then(response => response.json())
                .then(data => {
                    this.venues.push(data);
                })
                .catch(error => {
                    console.error("Error fetching venues:", error);
                });
        },

        fetchShows() {
            fetch("/showget")
                .then(response => response.json())
                .then(data => {
                    this.venue = data;
                })
                .catch(error => {
                    console.error("Error fetching venues:", error);
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

        openVenueDropdown() {
            this.showVenueDropdown = !this.showVenueDropdown;
        },

        selectVenue(venue) {
            this.selectedVenueName = venue.v_name;
            this.venue = venue.v_id;
            this.showVenueDropdown = false;
        }
    }
})

export default Showregister;