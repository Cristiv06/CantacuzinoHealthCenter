import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useDoctorService from "../../services/DoctorService";

const DoctorPrograms = () => {
  const { getDoctorPrograms } = useDoctorService();
  const [programs, setPrograms] = useState([]);
  const [unavailablePeriods, setUnavailablePeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await getDoctorPrograms();
      setPrograms(data.doctorProgramList || []);
      setUnavailablePeriods(data.unavailablePeriods || []);
    } catch (e) {
      console.error("Failed to fetch doctor programs:", e);
      setError("Failed to fetch doctor programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const transformProgramsForCalendar = (programs) => {
    return programs.map((program) => {
      const today = new Date();
      const startDate = new Date(
        today.setDate(
          today.getDate() + ((program.dayOfWeek - today.getDay() + 7) % 7)
        )
      );
      startDate.setHours(parseInt(program.startingHour.split(":")[0]));
      startDate.setMinutes(parseInt(program.startingHour.split(":")[1]));

      const endDate = new Date(startDate);
      endDate.setHours(parseInt(program.endingHour.split(":")[0]));
      endDate.setMinutes(parseInt(program.endingHour.split(":")[1]));

      return {
        id: `program-${program.id}`,
        title: `Program: ${program.startingHour} - ${program.endingHour}`,
        start:
          startDate.toISOString().split("T")[0] + "T" + program.startingHour,
        end: endDate.toISOString().split("T")[0] + "T" + program.endingHour,
      };
    });
  };

  const transformUnavailablePeriodsForCalendar = (unavailablePeriods) => {
    return unavailablePeriods.map((period) => ({
      id: `unavailable-${period.id}`,
      title: `Unavailable: ${period.reason}`,
      start: period.startingDay,
      end: period.endingDay,
    }));
  };

  const events = [
    ...transformProgramsForCalendar(programs),
    ...transformUnavailablePeriodsForCalendar(unavailablePeriods),
    ...(appointment ? [appointment] : []),
  ];

  const handleDateClick = (info) => {
    const startDateISOString = info.startStr;
    const endDateISOString = info.endStr;
    if (new Date(startDateISOString) > new Date()) {
      setAppointment({
        id: `appointment-${new Date().getTime()}`,
        title: "New Appointment",
        start: startDateISOString,
        end: endDateISOString,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Doctor Programs and Unavailable Periods</h2>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        editable={true}
        selectable={true}
        select={handleDateClick}
        eventClick={(info) => {
          alert(`Event: ${info.event.title}`);
        }}
      />
    </div>
  );
};

export default DoctorPrograms;
