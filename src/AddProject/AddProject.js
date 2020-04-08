import React, { Component } from "react";
import ApiContext from "../ApiContext";
import "./AddProject.css";

class AddProject extends Component {
  static contextType = ApiContext;
  state = {
    name: "",
    description: "",
    priority: "",
    dueDate: "",
    status: "",
    editMode: false,
    error: "",
  };

  componentDidMount() {
    if (this.props.projectId) {
      this.context.getProjectById(this.props.projectId)
        .then((res) => {
        this.setState({
          name: res.project_name,
          description: res.description,
          priority: res.priority,
          dueDate: this.formatDateFromServer(res.duedate),
          status: res.status,
          editMode: true,
        })
        }).catch(errorObj => {
          this.setState({ error: errorObj.error.message });
        })
       
    }
  }

  clearForm = () => {
    this.setState({
      name: "",
      description: "",
      priority: "",
      dueDate: "",
      status: "",
    });
  };
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  };
  formatDateFromServer = (str) => {
    const end = str.indexOf("T");
    return str.slice(0, end);
  };

  formatDate = (str) => {
    const [year, month, day] = str.split("-");
    return new Date(year, month - 1, day);
  };
  
  handleAddProject = () => { 
  this.context
    .addProject(
      this.state.name,
      this.state.description,
      this.state.priority,
      this.formatDate(this.state.dueDate)
    )
    .then((response) => console.log(response))
    .catch((err) => { 
        console.log(err)
        this.setState({ error: err })
    });
  }
  handleEditProject = () => {
    this.context
      .editProject(
        this.state.name,
        this.state.description,
        this.state.priority,
        this.state.dueDate,
        this.state.status,
        this.props.projectId
      )
      .then((response) => console.log(response))
      .catch((err) => { 
        console.log(err)
        this.setState({ error: err });
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({error: ""})
    if (this.state.editMode) {
      this.handleEditProject();
    }
    else { 
      this.handleAddProject();
    }
    
  };
  render() {
    return (
      <div className="form-container">
        <h2>{this.state.editMode ? "Edit Project" : "Add Project"}</h2>
        {this.state.error && <p className="error">{this.state.error}</p>}

        <form onSubmit={this.handleSubmit}>
          <p className="input-container">
            <label htmlFor="name-input">Project Name:</label>
            <input
              type="text"
              className="name-input"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </p>
          <p className="input-container">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              className="description"
              onChange={this.handleChange}
              value={this.state.description}
            />
          </p>
          <p className="input-container">
            <label htmlFor="dueDate">Due date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={this.state.dueDate}
              onChange={this.handleChange}
            />
          </p>
          {this.props.projectId && (
            <p className="input-container">
              <label htmlFor="status">Status:</label>
              <select
                onChange={this.handleChange}
                value={this.state.status}
                name="status"
                id="status"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </p>
          )}
          <div className="input-container">
            <label htmlFor="priority"> Priority:</label>
            <input
              type="radio"
              onChange={this.handleChange}
              name="priority"
              checked={this.state.priority === "Urgent"}
              value="Urgent"
            />

            <label className="urgent-priority">Urgent</label>
            <input
              type="radio"
              onChange={this.handleChange}
              name="priority"
              checked={this.state.priority === "High"}
              value="High"
            />
            <label className="high-priority">High</label>

            <input
              type="radio"
              onChange={this.handleChange}
              name="priority"
              checked={this.state.priority === "Medium"}
              value="Medium"
            />
            <label className="medium-priority">Medium</label>
            <input
              type="radio"
              onChange={this.handleChange}
              name="priority"
              checked={this.state.priority === "Low"}
              value="Low"
            />

            <label className="low-priority">Low</label>
          </div>

          <div className="button-container">
            <button className="add-button" type="submit">
              {this.state.editMode ? "Edit Project" : "Add Project"}
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={() => this.clearForm()}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddProject;
