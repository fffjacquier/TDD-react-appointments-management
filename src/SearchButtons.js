import React from 'react'

export const SearchButtons = ({ handleNext, handlePrevious }) => {
  return (
    <div className="button-bar">
      <button role="button" id="previous-page" onClick={handlePrevious}>
        Previous
      </button>
      <button id="next-page" role="button" onClick={handleNext}>
        Next
      </button>
    </div>
  )
}
