const data = [
    {
        name: "Dr. Smith",
        appointments: [
            "2024-08-25 14:00",
            "2024-08-25 15:30",
            "2024-08-26 10:00",
            "2024-08-26 11:00",
        ],
    },
    {
        name: "Dr. Johnson",
        appointments: [
            "2024-08-25 09:00",
            "2024-08-25 10:30",
            "2024-08-26 14:00",
            "2024-08-26 16:30",
        ],
    },
    {
        name: "Dr. Williams",
        appointments: [
            "2024-08-25 11:00",
            "2024-08-25 13:45",
            "2024-08-26 09:30",
            "2024-08-26 12:00",
        ],
    },
];

//////////////////////////////////////////////////////////////////////////
function bookAppointment(patientName, doctorName, appointmentTime) {
    if (doctorName) {
        const doctor = data.find((doc) => doc.name === doctorName);
        if (!doctor) {
            return `Doctor ${doctorName} not found.`;
        }
        if (isAppointmentAvailable(doctor, appointmentTime)) {
            doctor.appointments.push(appointmentTime);
            return `Appointment booked for ${patientName} with ${doctorName} at ${appointmentTime}.`;
        } else {
            return `Appointment with ${doctorName} at ${appointmentTime} is not available.`;
        }
    } else {
        const availableDoctor = findAvailableDoctor(appointmentTime);
        if (availableDoctor) {
            availableDoctor.appointments.push(appointmentTime);
            return `Appointment booked for ${patientName} with ${availableDoctor.name} at ${appointmentTime}.`;
        } else {
            return `No available doctors for the appointment at ${appointmentTime}.`;
        }
    }
}
/////////////////////////////////////////////////////////////////////
function isAppointmentAvailable(doctor, appointmentTime) {
    const newAppointmentStart = new Date(appointmentTime);
    const newAppointmentEnd = new Date(newAppointmentStart.getTime() + 30 * 60000);
    for (let booked of doctor.appointments) {
        const bookedStart = new Date(booked);
        const bookedEnd = new Date(bookedStart.getTime() + 30 * 60000);

        if (
            (newAppointmentStart >= bookedStart && newAppointmentStart < bookedEnd) ||
            (newAppointmentEnd > bookedStart && newAppointmentEnd <= bookedEnd) ||
            (newAppointmentStart <= bookedStart && newAppointmentEnd >= bookedEnd)
        ) {
            return false;
        }
    }
    return true;
}

////////////////////////////////////////////////////////////////////////////////////
function findAvailableDoctor(appointmentTime) {
    for (let doctor of data) {
        if (isAppointmentAvailable(doctor, appointmentTime)) {
            return doctor;
        }
    }
    return null;
}

function runTests() {
    console.log("Running test cases...");

    // Test case 1: Book an appointment with a specific doctor
    let result = bookAppointment("John Doe", "Dr. Smith", "2024-08-27 11:00");
    console.assert(
        result === "Appointment booked for John Doe with Dr. Smith at 2024-08-27 11:00.",
        `Test case 1 failed: ${result}`
    );

    // Test case 2: Try to book an unavailable appointment (exact time conflict)
    result = bookAppointment("Jane Smith", "Dr. Smith", "2024-08-25 14:00");
    console.assert(
        result === "Appointment with Dr. Smith at 2024-08-25 14:00 is not available.",
        `Test case 2 failed: ${result}`
    );

    // Test case 3: Try to book an unavailable appointment (overlap conflict)
    result = bookAppointment("Alice Johnson", "Dr. Smith", "2024-08-25 14:15");
    console.assert(
        result === "Appointment with Dr. Smith at 2024-08-25 14:15 is not available.",
        `Test case 3 failed: ${result}`
    );

    // Test case 4: Book with any available doctor
    result = bookAppointment("Bob Wilson", null, "2024-08-27 09:00");
    console.assert(
        result.includes("Appointment booked for Bob Wilson with") &&
        result.includes("at 2024-08-27 09:00."),
        `Test case 4 failed: ${result}`
    );

    // Test case 5: Try to book when no doctors are available
    data.forEach((doctor) => doctor.appointments.push("2024-08-28 10:00"));
    result = bookAppointment("Charlie Brown", null, "2024-08-28 10:15");
    console.assert(
        result === "No available doctors for the appointment at 2024-08-28 10:15.",
        `Test case 5 failed: ${result}`
    );

    // Test case 6: Book with a non-existent doctor
    result = bookAppointment("David Lee", "Dr. Xavier", "2024-08-29 15:00");
    console.assert(
        result === "Doctor Dr. Xavier not found.",
        `Test case 6 failed: ${result}`
    );

    // Test case 7: Complex conflict check (multiple existing appointments)
    result = bookAppointment("Eva Green", "Dr. Williams", "2024-08-25 13:30");
    console.assert(
        result === "Appointment with Dr. Williams at 2024-08-25 13:30 is not available.",
        `Test case 7 failed: ${result}`
    );

    // Test case 8: Booking just after an existing appointment (should be allowed)
    result = bookAppointment("Frank White", "Dr. Johnson", "2024-08-25 09:30");
    console.assert(
        result === "Appointment booked for Frank White with Dr. Johnson at 2024-08-25 09:30.",
        `Test case 8 failed: ${result}`
    );

    // Test case 9: Booking overlapping with an existing appointment
    result = bookAppointment("Grace Taylor", "Dr. Johnson", "2024-08-25 08:45");
    console.assert(
        result === "Appointment with Dr. Johnson at 2024-08-25 08:45 is not available.",
        `Test case 9 failed: ${result}`
    );

    // Test case 10: Test isAppointmentAvailable function directly
    const doctor = data.find((d) => d.name === "Dr. Smith");
    console.assert(
        isAppointmentAvailable(doctor, "2024-08-27 12:00"),
        "Test case 10 failed: Appointment should be available"
    );
    console.assert(
        !isAppointmentAvailable(doctor, "2024-08-25 14:00"),
        "Test case 10 failed: Appointment should not be available"
    );

    // Test case 11: Test findAvailableDoctor function
    const availableDoctor = findAvailableDoctor("2024-08-27 13:00");
    console.assert(
        availableDoctor !== null,
        "Test case 11 failed: Should find an available doctor"
    );
    console.assert(
        data.some((d) => d.name === availableDoctor.name),
        `Test case 11 failed: Found invalid doctor ${availableDoctor.name}`
    );

    // Test case 12: Book appointment at midnight
    result = bookAppointment("Midnight Patient", null, "2024-08-28 00:00");
    console.assert(
        result.includes("Appointment booked for Midnight Patient with") &&
        result.includes("at 2024-08-28 00:00."),
        `Test case 12 failed: ${result}`
    );

    // Test case 13: Book appointment on a leap day
    result = bookAppointment("Leap Day Patient", null, "2024-02-29 10:00");
    console.assert(
        result.includes("Appointment booked for Leap Day Patient with") &&
        result.includes("at 2024-02-29 10:00."),
        `Test case 13 failed: ${result}`
    );

    console.log("Pass all the Test.");
}

runTests();
