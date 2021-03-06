import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../actions/'
import { isTimerDone } from '../lib/time_helper'

class Timer extends Component {

  sanitizeInput(e) {
    // Allow 4 digits of numeric input as well as backspaces
    if((e.charCode < 48 || e.charCode > 57) ||
      e.target.value.length > 4)
      e.preventDefault()
  }

  onTimeInputChange(e) {
    var newTime = e.target.value.replace(":", "")
    // Keep the colon at the right place
    if(newTime.length > 2) {
      newTime = newTime.substring(0, newTime.length - 2) + ":"
        + newTime.substring(newTime.length - 2, newTime.length)
    }
    this.props.setInitialTime(newTime)
  }

  componentWillUpdate(nextProps, nextState) {
    if (isTimerDone(nextProps.time)) {
      this.props.deactivateBlock()
    }
  }

  render() {
    return (
      <div className = "timer">
        <input
          value = {this.props.time}
          disabled = {this.props.blockerActive}
          onKeyPress = {(e) => this.sanitizeInput(e)}
          onChange = {(e) => this.onTimeInputChange(e)}
          placeholder = "00:00" />
      </div>
    ) 
  }
}

function mapStateToProps(state) {
  return {
    blockerActive: state.blocker.get('blockerActive'),
    time: state.blocker.get('time')
  }
}

export default connect(mapStateToProps, ActionCreators)(Timer)
