import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import _ from 'lodash';

var App = React.createClass({

    render: function() {
      return <div id="wrapper">
            <header className="clearfix">
                <h1><a href="/#/">Ironpanda. Front end development. London UK.</a></h1>
            </header>
            <section>
                <div id="contentWrap" className="clearfix">
                    <nav className="clearfix">
                        <ul>
                            <li><Link id="port" to="/">Portfolio.</Link></li>
                            <li><Link id="cont" to="/contact">Contact.</Link></li>
                        </ul>
                    </nav>
                    <div className="clearfix">
                      {this.props.children}
                    </div>
                </div>
            </section>
            <footer>
                &copy; 2016 Ironpanda Limited.
            </footer>
        </div>;
    }
});

var ProjectListItem = React.createClass({
  render: function () {
    return <div className="article" >
        <div className="title">
            <h3>{this.props.data.project_name}</h3>
        </div>
        <Link to={"/project/" + this.props.data.url_name}><img src={'/public/' + this.props.data.image} alt={this.props.data.project_name} /></Link>
    </div>
  }
});

var ProjectList = React.createClass({
  getInitialState: function () {
    return {
        projects: []
    };
  },
  componentDidMount: function () {
    axios.get('/app/data/projects.json')
    .then(function (response) {
      var activeProjects = _.filter(response.data, function(o) { return o.active; });
      var projects = _.slice(activeProjects, 0, 9);
      this.setState({
        projects: projects
      })
    }.bind(this))
    .catch(function (error) {
      console.log("error: ");
      console.log(error);
    });
  },
  render: function () {
    if(this.state.projects){
      return <div className="panel">
           {this.state.projects.map(function(project) {
            return <ProjectListItem key={project.id} data={project} />
           })}
      </div>
    }else{
      return <p>no projects</p>
    }

  }
});

var Project = React.createClass({
  getInitialState: function () {
    return {
        project: []
    };
  },
  componentDidMount: function () {
    axios.get('/app/data/projects.json')
    .then(function (response) {
      var loc = this.props.routeParams.projectName;
      console.log(loc);
      var project = _.find(response.data, function(o) { return o.url_name == loc });
      console.log(project);
      //var project = _.slice(activeProjects, 0, 9);
      this.setState({
        project: project
      })
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  },
  render: function () {
    console.log(this.state.project);
    return <div className="panel">
        <div className="project-details">
            <img src={"/public/" + this.state.project.image2} alt={this.state.project.project_name} />

            <div className="project-title">
                <h4>{this.state.project.project_name}</h4>
            </div>
            
            <div dangerouslySetInnerHTML={{__html: this.state.project.text}}></div>
        </div>
    </div>
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={ProjectList} addHandlerKey={true}/>
      <Route path="project/:projectName" component={Project}/>
    </Route>
  </Router>
), document.getElementById('app'))
