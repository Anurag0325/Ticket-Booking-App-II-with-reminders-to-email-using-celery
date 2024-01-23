
const Admindashboard = Vue.component("admindashboard", {
    template: `
                <div>
                <nav>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/#/admin">Back</a>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" @click="logout">Logout</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" @click="allshows">Shows</button>
                    </li>
                </ul>
            </nav>
                    <div style="padding: 20px;">
                        <h1>Admin Dashboard</h1>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ID</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Place</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Location</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Capacity</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Update</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Delete</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">CSV Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="venue in venues" :key="venue.v_id" style="border-bottom: 1px solid #ddd;">
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">{{ venue.v_id }}</td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;"><router-link :to="'/venueshow/' + venue.v_id" :venue_id="venue.v_id">{{ venue.v_name }}</router-link></td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">{{ venue.v_place }}</td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">{{ venue.v_location }}</td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">{{ venue.v_capacity }}</td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;"><router-link v-if="venue.v_id" :to="getVenueUpdate(venue.v_id)">Update Venue</router-link></td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;"><button v-on:click=deleteVenue(venue.v_id) style="cursor: pointer; background-color: #f44336; color: #fff; border: none; padding: 5px 10px; border-radius: 3px;">Delete Venue</button></td>
                                <td style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;"><button v-on:click=triggerExportCSV(venue.v_id) style="cursor: pointer; background-color: blue; color: white; border: none; padding: 5px 10px; border-radius: 3px;">Generate</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p style="text-align: left-center;">
                        <button v-on:click="addvenue" style="background-color: #007bff; color: white; border: none; padding: 10px 15px; margin-right: 10px; cursor: pointer; transition: background-color 0.3s;">Add venues</button>
                    </p>
                    <div style="text-align: center;">
                        <button @click="startReportGeneration" style="background-color: #007bff; color: white; border: none; padding: 10px 15px; cursor: pointer; transition: background-color 0.3s;">Generate Monthly Report</button>
                    </div>
                </div>
            `,

    data: function () {
        return {
            venues: []
        }
    },

    mounted: function () {
        this.fetchVenues()
    },

    methods: {
        async fetchVenues() {
            try {
                const response = await fetch("/venueget");
                const data = await response.json();
                this.venues = data.venues;
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        },

        addvenue: function () {
            this.$router.push({ path: "/addvenue" })
        },

        updateVenues() {
            this.fetchVenues();
        },

        getVenueUpdate(venueId) {
            return `/updatevenue/${venueId}`;
        },

        deleteVenue(venueId) {
            fetch(`/delete/${venueId}`, {
                method: "Delete",
            })
                .then((r) => r.json())
                .then((data) => {
                    this.venues = data.venues;
                    this.updateVenues();
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

        async startReportGeneration() {
            const userInput = window.prompt('Enter the month (e.g., 1 for January):');
            if (userInput !== null && userInput.trim() !== '') {
                const month = parseInt(userInput);
                if (!isNaN(month)) {
                    try {
                        const response = await fetch(`/monthly_report/${month}`, {
                            method: 'POST',
                        });
                        if (response.ok) {
                            const reportHtml = await response.text();
                            const newWindow = window.open('', '_blank');
                            newWindow.document.open();
                            newWindow.document.write(reportHtml);
                            newWindow.document.close();
                        } else {
                            console.error('Error generating monthly report:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error generating monthly report:', error);
                    }
                } else {
                    alert('Invalid input. Please enter a valid month (e.g., 1 for January).');
                }
            }
        },


        triggerceleryjob() {
            fetch('/trigger-celery-job').then((r) => r.json()).then((d) => d.console.log("Celery Task Started"))
        },

        triggerExportCSV(venueId) {
            fetch(`/export_venue/${venueId}`, { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    this.taskStatus = `CSV export task started. Task ID: ${data.task_id}`;
                })
                .catch(error => {
                    this.taskStatus = 'Error triggering CSV export task';
                });
        },

        allshows() {
            this.$router.push({ path: "/allshows" })
        }
    },

})

export default Admindashboard;