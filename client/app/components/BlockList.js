import React, { Component } from 'react'
import { connect } from 'react-redux'
import actionCreators from '../actions/'

export default class BlockList extends Component {

  getListItems() {
    return this.props.listItems || []	
  }

  isAddingItem() {
    return this.props.isAddingItem
  }

  render() {
    return (
      <div className="BlockList">
        {this.getListItems().map(item =>
          <div key={item}>
            {item}
            <button onClick={() => this.props.deleteItem(item)}>
              X
            </button>
          </div>
        )}
        {this.isAddingItem() ? 
          <div className="listElement">
            <input ref="input"
              onKeyPress={(e) => {(e.key === 'Enter' ? this.props.addItem(this.refs.input.value) : null)}}>
            </input>
            <button onClick={() => this.props.toggleAdding() }>
              X
            </button>
          </div> 
          :
          <button onClick={() => this.props.toggleAdding() }>+</button>
        }
      </div>
    )	
  }
}

function mapStateToProps(state) {
  return {
    listItems: state.getIn(['blockList','blockees']),
    isAddingItem: state.getIn(['blockList', 'isAddingItem'])
  }
}

export const BlockListContainer = connect(mapStateToProps, actionCreators)(BlockList)
