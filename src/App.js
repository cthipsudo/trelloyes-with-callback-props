import React, { Component } from 'react';
import List from './List'
import './App.css';

function omit(obj, keyToOmit) {
  let {[keyToOmit]: _, ...rest} = obj;
  return rest;
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: {
        lists: this.props.store.lists,
        allCards: this.props.store.allCards,
      }
    }
  }
  generateRandomCard = (listId) => {
    //console.log("You wanna make a random card! With this list", listId);
    //Make a random card object function
    const newRandomCard = () => {
      const id = Math.random().toString(36).substring(2, 4)
        + Math.random().toString(36).substring(2, 4);
      return {
        id,
        title: `Random Card ${id}`,
        content: 'lorem ipsum',
      }
    }
    //Actually make the randomCard
    const randomCard = newRandomCard();
    // Grab the lists in Store
    const currentLists = [
      //this grabs the current "lists in the store"
      ...this.state.store.lists
    ]
    //Filter for the list that matches listId argument
    const workingList = currentLists.filter(list => {
      return list.id === listId;
    })
    //With that matching list, push the id of randomCard
    workingList[0].cardIds.push(randomCard.id);

    // Somehow miraciously after pushing into the "working list", 
    // it also pushes to the current list version...not exactly sure why...

    // Make our new allCards object
    const newCards = {
      ...this.state.store.allCards, [randomCard.id]: randomCard
    }
    //console.log("this is newcards", newCards);
    //Set the new lists and new allCards
    this.setState({
      store: {
        lists: currentLists,
        allCards: Object.assign(newCards)
      }
    })
  }
  onClickHandleDelete = (cardId) => {
    const allCards = this.state.store.allCards;
    const allLists = this.state.store.lists;
    const newLists = allLists.map(list => ({
      ...list,
      cardIds: list.cardIds.filter(id => id !== cardId)
    }));
    const newCards = omit(allCards, cardId);
    this.setState({
      store:{
        lists: newLists,
        allCards: newCards
      }
    })
  }
  render() {
    const { store } = this.state
    //console.log(store);
    return (
      <main className='App'>
        <header className='App-header'>
          <h1>Trelloyes!</h1>
        </header>
        <div className='App-list'>
          {store.lists.map(list => (
            <List
              key={list.id}
              id={list.id}
              header={list.header}
              cards={list.cardIds.map(id => store.allCards[id])}
              handleRandomClick={this.generateRandomCard}
              onClickDelete={this.onClickHandleDelete}
            />
          ))}
        </div>
      </main>
    );
  }
}

export default App;
