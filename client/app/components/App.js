import React, { Component } from 'react'
import BlockList from './BlockList'
import Timer from './Timer'
import ButtonRow from './ButtonRow'
import Adder from './Adder'


export default class App extends Component {
  render() {
    return (
      <div>
        <Adder />
        <BlockList />
        <Timer />
        <ButtonRow />
      </div>
    )
  }
}
