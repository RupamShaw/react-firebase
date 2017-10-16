import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
    console.log(new Date().getFullYear())
    this.state = {year: new Date().getFullYear()};
  }

  render() {
    return (
      <footer>
        <ul >
          <li>
            © {this.state.year} development journey
          </li>
        </ul>
      </footer>
    );
  }
}

export default Footer;