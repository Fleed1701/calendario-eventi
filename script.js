document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Fetch the JSON data
    fetch('Eventi_Virgilio.it_puliti_condescrizioni_json.json')
        .then(response => response.json())
        .then(data => {
            let calendarEvents = [];
            
            // Prepare the data for FullCalendar
            data.forEach(event => {
                calendarEvents.push({
                    title: event['Titolo evento'],
                    start: formatDateToISO(event['Data']),
                    description: event['Descrizione di Groq'],
                    location: event['Luogo'],
                    extendedProps: {
                        price: event['Prezzo'],
                        time: event['Orario']
                    }
                });
            });

            // Initialize the FullCalendar
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: calendarEvents,
                eventContent: function(info) {
                    let price = info.event.extendedProps.price;
                    let time = info.event.extendedProps.time;
                    return {
                        html: `<b>${info.event.title}</b><br>${time} - ${price}`
                    };
                },
                eventClick: function(info) {
                    alert(`Descrizione: ${info.event.extendedProps.description}\nLuogo: ${info.event.extendedProps.location}`);
                }
            });

            calendar.render();
            
            // Add search filter
            document.getElementById('nameFilter').addEventListener('input', function() {
                filterEventsByName(calendar, calendarEvents);
            });
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
});

// Convert date to ISO format (yyyy-mm-dd)
function formatDateToISO(dateStr) {
    let parts = dateStr.split('/');
    return `2024-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; // Assuming year is 2024
}

// Filter events by name
function filterEventsByName(calendar, events) {
    let searchTerm = document.getElementById('nameFilter').value.toLowerCase();
    
    let filteredEvents = events.filter(event => {
        return event.title.toLowerCase().includes(searchTerm);
    });

    calendar.removeAllEvents();
    calendar.addEventSource(filteredEvents);
}
