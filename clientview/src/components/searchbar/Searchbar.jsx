import React, { useState, useCallback, useEffect } from 'react';
import Suggestions from './Suggestions';
import debounce from 'debounce';
import './searchbar.css';

export default function Searchbar({
  placeholder,
  fetchSuggestions,
  dataKey,
  customLoading,
  onSelect,
  onChange,
  onBlur,
  onFocus,
  customStyles,
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const getSuggestion = async (query) => {
    setError(null);
    setLoading(true);
    try {
      const result = await fetchSuggestions(query);
      setSuggestions(result);
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  }

  const getSuggestionDebounced = useCallback(debounce(getSuggestion, 1000), []);

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
  };

  return (
    <div className='Searchbar'>
      <input
        type="text"
        value={inputValue}
        className='SearchInput'
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
      />
      {((suggestions && suggestions.length > 0) || loading || error) && (
        <ul className='SuggestionList'>
          {error && <div className='error'>{error}</div>}
          {loading && <div className='Loading'>{customLoading}</div>}
          <Suggestions
            suggestions={suggestions}
            highlight={inputValue}
            dataKey={dataKey}
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </div>
  );
}
