import React from 'react';

function clicked(props) {
  console.log(props + " was selected");
}

function SearchOptions(props) {
  return (
    <datalist id="data-list">{props.array.map((value) => (<option key={value} value={value} onClick={() => clicked(value)}></option>))}</datalist>
  );
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {iterate: true, selectedString: "A"};
    this.array = ["A", "B", "C", "AA", "BB", "CC"]
  }

  searchText(e) {
    if (this.array.includes(e.target.value)) {
      this.setState({selectedString: e.target.value});
    }
  }

  enterPressed(e) {
    console.log("Selected string is " + this.state.selectedString);
    e.preventDefault();
  }

  /*input type=text*/
  render() {
    return (
      <div>
        <input type="checkbox" onChange={() => this.setState({iterate: !this.state.iterate})}></input>
        Text
        <SearchOptions array={this.array}/>
        <form onSubmit={(e) => this.enterPressed(e)}>
          <input type="search" list={'data-list'} onChange={(e) => this.searchText(e)}></input>
        </form>
      </div>
    );
  }
}

export default SearchBar