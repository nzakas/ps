import React from 'react'

import logo from './logo.svg'
import './App.css'
import './style.css'
import { ElectricWrapper as ElectricProvider } from './ElectricProvider'

import { Example } from './Example'
import { User } from './User'

export default function App() {
  return (
    <ElectricProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <User />
        </header>
      </div>
    </ElectricProvider>
  )
}
