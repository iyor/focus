import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../actions/'

class Timer extends Component {

  getPlaceholderValue() {
    return "00:00"
  }

  sanitizeInput(e) {
    // Allow 4 digits of numeric input...
    if((e.charCode < 48 || e.charCode > 57) ||
      // ... and backspaces
      e.target.value.length > 4)
      e.preventDefault()
  }

  formatTimeInput(e) {
    var newTime = e.target.value.replace(":", "")
    // Keep the colon at the right place
    if(newTime.length > 2) {
      newTime = newTime.substring(0, newTime.length - 2) + ":"
        + newTime.substring(newTime.length - 2, newTime.length)
    }
    this.props.setTime(newTime)
  }


  render() {
    return (
      <div className="Timer">
        <input
          value = {this.props.time}
          disabled = {this.props.blockerActive}
          onKeyPress = {(e) => this.sanitizeInput(e)}
          onChange = {(e) => this.formatTimeInput(e)}
          placeholder = {this.getPlaceholderValue()} />
      </div>
    ) 
  }
}

function mapStateToProps(state) {
  return {
    blockerActive: state.block.get('blockerActive'),
    time: state.block.get('time')
  }
}

export default connect(mapStateToProps, ActionCreators)(Timer)
