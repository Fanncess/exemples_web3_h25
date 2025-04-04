import { Component1 } from './components/ChaineComponentsContext'
import { TicTacToe } from './components/tictactoe/TicTacToe'
import { Timer } from './components/Timer'

export function App() {
  return (
    <>
      <TicTacToe />
      <hr />
      <Timer />
      <hr />
      <Component1 />
    </>
  )
}
