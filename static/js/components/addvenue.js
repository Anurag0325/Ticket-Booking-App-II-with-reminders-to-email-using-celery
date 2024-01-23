const Addvenue = Vue.component("addvenue", {
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
            <h2 style="font-size: 20px; color: #333;">Add Venue page</h2>
            <label for="v_name" style="display: block; margin-bottom: 5px;">Name</label>
            <input type="text" id="v_name" name="v_name" v-model="name" style="padding: 5px; border: 1px solid #ccc; margin-bottom: 10px;">
            <label for="v_place" style="display: block; margin-bottom: 5px;">Place</label>
            <input type="text" id="v_place" name="v_place" v-model="place" style="padding: 5px; border: 1px solid #ccc; margin-bottom: 10px;">
            <label for="v_location" style="display: block; margin-bottom: 5px;">Location</label>
            <input type="text" id="v_location" name="v_location" v-model="location" style="padding: 5px; border: 1px solid #ccc; margin-bottom: 10px;">
            <label for="v_capacity" style="display: block; margin-bottom: 5px;">Capacity</label>
            <input type="text" id="v_capacity" name="v_capacity" v-model="capacity" style="padding: 5px; border: 1px solid #ccc; margin-bottom: 10px;">
            <div>
            <button v-on:click="addvenue" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Add Venue</button>
            </div>
        </div>
        </div>
                </div>
            `,

    data() {
        return {
            name: "",
            place: "",
            location: "",
            capacity: "",
        }
    },

    methods: {
        addvenue: function () {
            const data = {
                v_name: this.name,
                v_place: this.place,
                v_location: this.location,
                v_capacity: this.capacity
            };

            fetch("/venuereg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((response) => response.json()).then((data) => {
                console.log(data)
                this.updateVenues();
            })
            console.warn("addvenue", this.name, this.place, this.location, this.capacity)
            this.$router.push({ path: "/admindashboard" })
            window.location.reload(true);
            this.fetchVenues();

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

export default Addvenue;