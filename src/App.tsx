import React from 'react';
import './App.css'

class App extends React.Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      word: '',
      phonetic: '',
      origin: '',
      phonetics: [],
      meanings: []
    }
  }

  componentDidMount() {
    document.getElementById('search')?.focus();

    document.addEventListener('keypress', (e) => {
      if (e.key === '/') {
        setTimeout(() => document.getElementById('search')?.focus(), 0);
      }
    })
  }

  dictionary = async (word: string) => {
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const response = await data.json();

    return response;
  }

  handleSubmit = (e: any) => {
   if (e.key === 'Enter') {
    this.dictionary(e.target.value as string).then(word => {
      try {
        word = word[0];

        this.setState({
          word: word.word,
          phonetic: word.phonetic,
          origin: word.origin,
          phonetics: word.phonetics,
          meanings: word.meanings
        });
      } catch(err) {
        console.log(err);
        this.setState({
          word: '404 not found',
          phonetic: "",
          origin: "",
          phonetics: [],
          meanings: []
        })
      }
    })

    e.target.value = '';
   }
  }

  listen = () => {
    new Audio(this.state.phonetics[0].audio).play();
  }

  render() {
    return (
      <div className="app">
        <div className="form">
          <input type="text" id="search" placeholder="Look up a word..." onKeyPress={this.handleSubmit} />
        </div>
        <div className="result">
          <div className="top">
            <div className="audio">
              {
                this.state.phonetics.length > 0 ? <button id="listen" onClick={this.listen}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"></path><path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697l5.748 3.832a1.004 1.004 0 0 0 1.027.05A1 1 0 0 0 14 20V4a1 1 0 0 0-1.554-.832L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2zm0-8h3c.033 0 .061-.016.093-.019a1.027 1.027 0 0 0 .38-.116c.026-.015.057-.017.082-.033L12 5.868v12.264l-4.445-2.964c-.025-.017-.056-.02-.082-.033a.986.986 0 0 0-.382-.116C7.059 15.016 7.032 15 7 15H4V9z"></path></svg>
                </button> : null
              }
            </div>
            <div className="text">
              <h2>{this.state.word}</h2>
              <p>{this.state.phonetic ? `/${this.state.phonetic}/` : null}</p>
              <p>{this.state.origin}</p>
            </div>
          </div>
          <br />
          <br />
          <div className="meanings">
            {
              this.state.meanings.map((meaning: any) => (
                <div className="meaning">
                  <i>{meaning.partOfSpeech}</i>
                  <br />
                  <br />
                  {
                    meaning.definitions.map((definiton: any) => (
                      <div className="definition">
                        <p>{definiton.definition}</p>
                        <p className="example">{definiton.example ? `"${definiton.example}"` : null}</p>
                        <br />
                      </div>
                    ))
                  }
                  <br />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;