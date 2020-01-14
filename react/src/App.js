import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import {
  HomeView,
  NotFoundView,
  ProjectsView,
  ProjectDetailView,
  TagDetailView,
  SamplesView,
  ActivitiesPlayerView,
  ActivitiesTurkView,
  LoginView,
  AboutView,
  NewProjectView,
  CareersView,
  PrivacyView,
  TermsView,
} from "./Components";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="fs">
          <Switch>
            <Route exact path="/" component={HomeView}></Route>
            <Route exact path="/about" component={AboutView}></Route>
            <Route exact path="/careers" component={CareersView}></Route>
            <Route exact path="/privacy" component={PrivacyView}></Route>
            <Route exact path="/terms" component={TermsView}></Route>

            <Route exact path="/activities/player" component={ActivitiesPlayerView}></Route>
            <Route exact path="/activities/turk" component={ActivitiesTurkView}></Route>
            <Route exact path="/login" component={LoginView}></Route>
            <Route exact path="/projects" component={ProjectsView}></Route>
            <Route exact path="/projects/new" component={NewProjectView}></Route>
            <Route exact path="/projects/:projectId" component={ProjectDetailView}></Route>
            <Route exact path="/projects/:projectId/tags/:taskId" component={TagDetailView}></Route>
            <Route exact path="/projects/:projectId/samples" component={SamplesView}></Route>
            <Route component={NotFoundView}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
