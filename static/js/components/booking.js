const Booking = Vue.component("booking", {


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
                </ul>
            </nav>
                    <div style="text-align: center; margin: 20px;">
                    <h2>Hello {{ current_user.u_name }}</h2>
                    <br /><br />
                    <h3>Total seats = {{ v_capacity }}</h3>
                    <br />
                    <h3>Seats_available = {{ avbseat }}</h3>
                    <br /><br />
                    <div v-if="avbseat === 0">
                        <h3 style="color: red;">The show is Housefull!!!</h3>
                    </div>
                    <div v-else>
                        <label for="num1" style="margin-right: 10px;">Number of tickets:</label>
                        <input type="number" id="num1" v-model="num1" style="margin-right: 20px; padding: 5px;">
                        <label for="num2" style="margin-right: 10px;">Price per ticket:</label>
                        <input type="number" id="num2" v-model="num2" style="margin-right: 20px; padding: 5px;"></br></br>
                        <div>
                            <input type="button" value="Totalcost" @click="calculateTotalCost" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;"></br></br>
                        </div>
                            <input type="box" v-model="result" id="result" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;"></br></br>
                    </div>
                    <div>
                        <button @click="bookTickets" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Book</button>
                    </div>
                    </div>
                    </div>
            </div>
            `,

    data() {
        return {
            num1: 0,
            num2: 0,
            result: 0,
            current_user: {},
            v_capacity: 0,
            avbseat: 0,
            selectedShow: null,
            bookedSeatsCount: 0
        }
    },

    computed: {
        availableseats() {
            if (this.selectedShow) {
                return this.selectedShow.venue.v_capacity - this.bookedSeatsCount;
            }
            return 0;
        },
    },

    created() {

        const show_id = Number(this.$route.params.showId);

        this.fetchShowDetails(show_id);
        this.fetchCurrentUser();
        this.fetchBookedSeats(show_id);

    },

    props: ['showId'],
    mounted() {
        const v_place = this.$route.query.v_place;
        const username = this.$route.query.username;

        console.log('v_place:', v_place);
        console.log('username:', username);


    },
    methods: {
        fetchCurrentUser() {
            fetch('/user/data', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.current_user = data
                    console.log(data)
                    this.username = data.u_name;
                    this.user_id = data.u_id
                    console.log(this.username);
                    console.log(this.user_id);
                })
                .catch(error => console.error('Error fetching current user:', error));
        },

        calculateTotalCost() {
            this.result = Number(this.num1) * Number(this.num2);
        },
        async fetchShowDetails(show_id) {
            try {
                const response = await fetch(`/showget/sh/${show_id}`);
                const data = await response.json();

                this.selectedShow = data;
                this.s_price = this.selectedShow.s_price;
                this.num2 = this.s_price;

                await this.fetchVenueDetails(this.selectedShow.venue_id);
                await this.fetchBookedSeats(show_id);
            } catch (error) {
                console.error("Error fetching show details:", error);
            }
        },

        async fetchVenueDetails(venue_id) {
            try {
                const response = await fetch(`/venueget/${venue_id}`);
                const venueData = await response.json();

                this.v_capacity = venueData.v_capacity;
                this.avbseat = this.v_capacity - this.bookedSeatsCount;
            } catch (error) {
                console.error("Error fetching venue details:", error);
            }
        },

        async fetchBookedSeats(show_id) {
            try {
                const response = await fetch(`/shows/${show_id}/bookedseats`);
                const data = await response.json();

                this.bookedSeatsCount = data.bookedSeatsCount;
                this.avbseat = this.v_capacity - this.bookedSeatsCount;
            } catch (error) {
                console.error("Error fetching booked seats count:", error);
            }
        },

        async bookTickets() {
            const bookingData = {
                b_seatsbooked: this.num1,
                b_show: this.selectedShow.s_id,
                vv_id: this.selectedShow.venue_id,
                b_user: this.user_id,
            };

            try {
                const response = await fetch(`/bookingpost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Booking success:', responseData);
                    this.bookedSeatsCount += this.num1;
                    this.avbseat = this.v_capacity - this.bookedSeatsCount;

                    this.num1 = 0;
                    this.num2 = 0;
                    this.result = 0;
                    this.$router.push({ path: "/bookingconfirmation" });
                } else {
                    console.error('Error booking tickets:', response.statusText);
                }
            } catch (error) {
                console.error('Error booking tickets:', error);
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
    },
})

export default Booking;