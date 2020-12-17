import React from "react";
import OnOutsideClick from "react-outclick";
import getSuggestions from "../../Api";
import { debounce } from "lodash";
import styles from "./InputTextfield.module.css";

const KEYS_MAPPING = {
  ENTER: 13,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
};

class InputTextfield extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      activeIndex: 0,
      userInput: "",
    };

    this.inputRef = React.createRef();
    this.debouncedSuggestionFunc = debounce(this.getSuggestionsForWord, 500);
  }

  getSuggestionsForWord = (textToSearch) => {
    getSuggestions(textToSearch)
      .then(data => this.setState({ suggestions: data, activeIndex: 0 }))
      .catch(console.error);
  }

  suggestionSelected = (suggestion) => {
    const { userInput } = this.state;
    this.setState({ 
      userInput: `${userInput.split(" ").slice(0, -1).join(" ")} ${suggestion} `,
      suggestions: [],
      activeIndex: 0,
    });
    this.inputRef.current.focus();
  }

  clearSuggestions = () => {
    this.setState({ suggestions: [], activeIndex: 0 });
  }

  onKeyPressed = (e) => {
    const { suggestions, activeIndex } = this.state;

    if(suggestions.length > 0) {
      const keyPressed = e.which;
      if (keyPressed === KEYS_MAPPING.ENTER) {
        this.suggestionSelected(suggestions[activeIndex]);
      } else if (keyPressed === KEYS_MAPPING.UP_ARROW) {
        e.preventDefault();

        if (activeIndex === 0) return;
        
        this.setState({ activeIndex: activeIndex - 1 });
      } else if (keyPressed === KEYS_MAPPING.DOWN_ARROW) {
        e.preventDefault();
        
        if (activeIndex === suggestions.length - 1) return;
        
        this.setState({ activeIndex: activeIndex + 1 });
      }
    }
  }

  onInputChange = (event) => {
    const { userInput } = this.state;
    const { value } = event.target;

    const lastSavedWord = userInput.split(" ").pop();
    const newWord = value.split(" ").pop();

    this.setState({ userInput: value });

    if (!!newWord && lastSavedWord !== newWord) {
      this.debouncedSuggestionFunc(newWord)
    } else {
      this.setState({ suggestions: [], activeIndex: 0 });
    }
  }

  render() {
    const { userInput, suggestions, activeIndex } = this.state;
    const showDropdown = suggestions.length > 0;
    return (
      <div className={styles.container}>
        <input
          ref={this.inputRef}
          className={styles.input}
          type="text"
          placeholder="Search"
          value={userInput}
          onKeyDown={this.onKeyPressed}
          onChange={this.onInputChange}
        />
        {showDropdown && (
          <OnOutsideClick onOutsideClick={this.clearSuggestions}>
            <div className={styles.dropdown}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={activeIndex === index ? styles.activeIndex : styles.normal}
                  onClick={() => this.suggestionSelected(suggestion)}
                >
                  <p className={styles.dropdownItem}>{suggestion}</p>
                </div>
              ))}
            </div>
          </OnOutsideClick>
        )}
      </div>
    );
  }
}

export default InputTextfield;
