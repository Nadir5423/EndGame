import React from 'react'
import Confetti from 'react-confetti'
import clsx from 'clsx'
import Header from './Header/header'
import { languages } from './assets/languages'
import { getFarewellText, randomWord } from './utils'
import './App.css'

export default function App() {
  const [word, setWord] = React.useState(randomWord().toUpperCase())
  const [guessedLetters, setGuessedLetters] = React.useState([])
  const keyboardLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const wrongGuessesCount = guessedLetters.filter(
    letter => !word.includes(letter)
  ).length

  const isGameWon = word.split('').every(letter => guessedLetters.includes(letter))
  const isLastGuessWrong =
    wrongGuessesCount > 0 &&
    !word.includes(guessedLetters[guessedLetters.length - 1])

  const maxWrongGuesses = languages.length - 1
  const isGameLost = maxWrongGuesses < wrongGuessesCount
  const isGameOver = isGameLost || isGameWon

  const gameStatusClass = clsx('game-status', {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessWrong,
  })

  function handleLetterClick(event) {
    const currentLetter = event.target.value

    setGuessedLetters(prev =>
      prev.includes(currentLetter) ? prev : [...prev, currentLetter]
    )
  }

  function startNewGame() {
    setWord(randomWord())
    setGuessedLetters([])
  }

  const languageChips = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessesCount

    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    }

    return (
      <span
        className={`chip ${isLanguageLost ? 'lost' : ''}`}
        style={styles}
        key={language.name}
      >
        {language.name}
      </span>
    )
  })

  const wordTiles = word.split('').map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter) || isGameLost
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && 'missed-letter'
    )

    return (
      <span key={index} className={letterClassName}>
        {isGuessed ? letter.toUpperCase() : ''}
      </span>
    )
  })

  const keyboardButtons = keyboardLetters.map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && word.includes(letter)
    const isWrong = isGuessed && !word.includes(letter)

    return (
      <button
        key={index}
        value={letter}
        onClick={handleLetterClick}
        disabled={isGameOver}
        className={clsx('btn-keyboard', {
          'btn-wrong': isWrong,
          'btn-correct': isCorrect,
        })}
      >
        {letter}
      </button>
    )
  })

  console.log(word)

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}

      <Header />

      <section className={gameStatusClass}>
        {isGameOver ? (
          isGameWon ? (
            <>
              <h2>You win!</h2>
              <p>Well done! ??</p>
            </>
          ) : (
            <>
              <h2>Game over!</h2>
              <p>You lose! Better start learning Assembly ??</p>
            </>
          )
        ) : (
          isLastGuessWrong && (
            <p className='farewell'>
              {getFarewellText(languages[wrongGuessesCount - 1].name)}
            </p>
          )
        )}
      </section>

      <section className='Languages'>{languageChips}</section>

      <section className='currentword'>{wordTiles}</section>

      <section className='keyboard'>{keyboardButtons}</section>

      {isGameOver && (
        <button className='new-game' onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  )
}
