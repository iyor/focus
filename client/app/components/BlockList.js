import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../actions/'

class BlockList extends Component {
  componentWillMount() {
    this.props.loadBlockees()
  }

  getListItems() {
    return this.props.listItems || []
  }

  render() {
    return (
      <div className="blockees">
        {this.getListItems().map(item =>
          <div key={item.uri}>
            {item.name}
            <button onClick={() => this.props.deleteItem(item)}
              disabled = {this.props.blockerActive}>
              X
            </button>
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    listItems: state.blockees.get('blockees'),
    blockerActive: state.blocker.get('blockerActive')
  }
}

export default connect(mapStateToProps, ActionCreators)(BlockList)
