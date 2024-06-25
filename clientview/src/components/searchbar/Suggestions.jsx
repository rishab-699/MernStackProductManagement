import React from 'react'
import './suggestions.css'

export default function Suggestions({ 
    suggestions=[],
    highlight,
    datakey,
    onSuggestionClick
   }) {
    const getHighletedText = (text, highlight)=>{
        const parts = text.split(new RegExp(`(${highlight})`,"gi"))
        return <span>
            {parts[0]}<b className='highlight'>{parts[1]}</b>{parts[2]}
        </span>;

    }
  return (
    <React.Fragment>{suggestions.map((suggestion, index)=>{
        const currentSuggestion = datakey ? suggestion[datakey] : suggestion;

        return(
            <li
            key = {index}
            onClick={()=>onSuggestionClick(suggestion)}
            className='SuggestedItem'
            >
                {getHighletedText(currentSuggestion, highlight)}
            </li>
        )
    })}</React.Fragment>
  )
}
