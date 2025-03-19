// Sample calendar events
const calendarEvents = [
    { title: "Math Exam", date: "2025-03-20", time: "10:00 AM", location: "Room 305" },
    { title: "Group Project Meeting", date: "2025-03-18", time: "2:30 PM", location: "Library" },
    { title: "Programming Assignment Due", date: "2025-03-22", time: "11:59 PM", location: "Online" }
  ];

return (
    <div>
        {/* Calendar Section */}
        {activeSection === 'calendar' && (
          <section className="calendar-section">
            <h1>Academic Calendar</h1>

            <div className="calendar-view">
              <div className="calendar-header">
                <button>Previous</button>
                <h2>March 2025</h2>
                <button>Next</button>
              </div>

              <div className="calendar-grid">
                {/* Calendar grid would be generated here */}
                <div className="placeholder-calendar">
                  <p>Calendar grid would be displayed here</p>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              {calendarEvents.map((event, index) => (
                <div className="event-card" key={index}>
                  <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
                  <h3>{event.title}</h3>
                  <p>{event.time} - {event.location}</p>
                  <div className="event-actions">
                    <button>Add Reminder</button>
                    <button>View Details</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-event">
              <h2>Add New Event</h2>
              <form className="event-form">
                <input type="text" placeholder="Event Title" />
                <input type="date" placeholder="Date" />
                <input type="time" placeholder="Time" />
                <input type="text" placeholder="Location" />
                <button type="submit">Add Event</button>
              </form>
            </div>
          </section>
        )}

    </div>
)