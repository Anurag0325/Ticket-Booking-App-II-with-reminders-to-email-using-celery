

const Updateshow = Vue.component("updateshow", {
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
            <div style="text-align: center; margin: 20px;">
                        <h1>Welcome to the Update Show page!</h1>
                        <h1>Update Show: {{ show.s_name }}</h1>
                        <div style="margin-top: 20px;">
                            <label for="s_name" style="margin-right: 10px;">Name</label>
                            <input type="text" id="s_name" v-model="show.s_name" style="margin-right: 20px; padding: 5px;">
                            <label for="s_starttime" style="margin-right: 10px;">Start Time</label>
                            <input type="text" id="s_starttime" v-model="show.s_starttime" style="margin-right: 20px; padding: 5px;">
                            <label for="s_endtime" style="margin-right: 10px;">End Time</label>
                            <input type="text" id="s_endtime" v-model="show.s_endtime" style="margin-right: 20px; padding: 5px;">
                            <label for="s_ratings" style="margin-right: 10px;">Ratings</label>
                            <input type="text" id="s_ratings" v-model="show.s_ratings" style="margin-right: 20px; padding: 5px;">
                            <label for="s_tags" style="margin-right: 10px;">Tags</label>
                            <input type="text" id="s_tags" v-model="show.s_tags" style="margin-right: 20px; padding: 5px;">
                            <label for="s_price" style="margin-right: 10px;">Price</label>
                            <input type="text" id="s_price" v-model="show.s_price" style="margin-right: 20px; padding: 5px;">
                            <button @click="updateShow()" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Update Show</button>
                        </div>
                    </div>
                    </div>
                </div>
                `,

    data() {
        return {
            show: {},
        };
    },

    props: {
        showId: {
            type: [Number, String],
            required: true,
        },
    },

    mounted() {
        const showId = Number(this.showId);
        console.log(showId);
        this.fetchShow(showId);
    },

    methods: {
        fetchShow(showId) {
            fetch(`/showget/sh/${showId}`)
                .then((response) => response.json())
                .then((data) => {
                    this.show = data;
                })
                .catch((error) => {
                    console.error("Error fetching show:", error);
                });
        },

        updateShow() {
            const showId = Number(this.showId);
            console.log("Show data:", this.show);

            fetch(`/showput/${showId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.show),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Show updated successfully");
                    console.log(this.show.venue_id);
                    this.$router.push(`/venueshow/${this.show.venue_id}`);

                })
                .catch((error) => {
                    console.error("Error updating show:", error);

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
});

export default Updateshow;
