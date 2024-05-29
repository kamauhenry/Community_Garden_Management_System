import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getAllPlots, getAllActivities, getAllResources, getAllEvents, createResource, createPlot, createActivity, createEvent } from "../../utils/communityGarden";
import PlotList from "../../components/UserManager/PlotList";
import ActivityList from "../../components/UserManager/ActivityList";
import ResourceList from "../../components/UserManager/ResourceList";
import EventList from "../../components/UserManager/EventList";
import AddPlotModal from "../../components/CRUD/AddPlotModal";
import AddActivityModal from "../../components/CRUD/AddActivityModal";
import AddResourceModal from "../../components/CRUD/AddResourceModal";
import AddEventModal from "../../components/CRUD/AddEventModal";

const UserDashboard = ({ user }) => {
  const [plots, setPlots] = useState([]);
  const [activities, setActivities] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);

  const [showPlotModal, setShowPlotModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchPlots();
    fetchActivities();
    fetchResources();
    fetchEvents();
  }, []);

  const fetchPlots = async () => {
    try {
      const plots = await getAllPlots();
      setPlots(plots);
    } catch (error) {
      console.error("Failed to fetch plots:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const activities = await getAllActivities();
      setActivities(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const resources = await getAllResources();
      setResources(resources);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const events = await getAllEvents();
      setEvents(events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleAddPlot = () => setShowPlotModal(true);
  const handleAddActivity = () => setShowActivityModal(true);
  const handleAddResource = () => setShowResourceModal(true);
  const handleAddEvent = () => setShowEventModal(true);

  const savePlot = async (plot) => {
    try {
      console.log("Plot to save:", plot);
      await createPlot(plot);
      console.log("Plot saved successfully");
      fetchPlots();
      toast.success("Plot added successfully!");
    } catch (error) {
      console.error("Failed to save plot:", error);
      toast.error("Failed to add plot.");
    }
  };

  const saveActivity = async (activity) => {
    try {
      console.log("Activity to save:", activity);
      await createActivity(activity);
      console.log("Activity saved successfully");
      fetchActivities();
      toast.success("Activity added successfully!");
    } catch (error) {
      console.error("Failed to save activity:", error);
      toast.error("Failed to add activity.");
    }
  };

  const saveResource = async (resource) => {
    try {
      console.log("Resource to save:", resource);
      await createResource(resource);
      console.log("Resource saved successfully");
      fetchResources();
      toast.success("Resource added successfully!");
    } catch (error) {
      console.error("Failed to save resource:", error);
      toast.error("Failed to add resource.");
    }
  };

  const saveEvent = async (event) => {
    try {
      console.log("Event to save:", event);
      await createEvent(event);
      console.log("Event saved successfully");
      fetchEvents();
      toast.success("Event added successfully!");
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error("Failed to add event.");
    }
  };

  if (!user || !user.userId) {
    return <div>Loading...</div>;
  }

  console.log("User:", user); // Check user object
  console.log("User ID:", user.userId); // Check userId

  return (
    <Container className="mt-2">
      <Row className="mx-2 my-4">
        <Col md={6}>
          <PlotList plots={plots} onAdd={handleAddPlot} />
        </Col>
        <Col md={6}>
          <ActivityList activities={activities} onAdd={handleAddActivity} />
        </Col>
      </Row>
      <Row className="mx-2 my-4">
        <Col md={6}>
          <ResourceList resources={resources} onAdd={handleAddResource} />
        </Col>
        <Col md={6}>
          <EventList events={events} onAdd={handleAddEvent} />
        </Col>
      </Row>

      <AddPlotModal
        show={showPlotModal}
        handleClose={() => setShowPlotModal(false)}
        handleSave={savePlot}
        userId={user.userId} // Pass the userId to the modal
      />
      <AddActivityModal
        show={showActivityModal}
        handleClose={() => setShowActivityModal(false)}
        handleSave={saveActivity}
      />
      <AddResourceModal
        show={showResourceModal}
        handleClose={() => setShowResourceModal(false)}
        handleSave={saveResource}
      />
      <AddEventModal
        show={showEventModal}
        handleClose={() => setShowEventModal(false)}
        handleSave={saveEvent}
      />
    </Container>
  );
};

export default UserDashboard;
