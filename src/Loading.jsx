import React from 'react';
import logo from './logo.svg';
import './Loading.css';
import './CenteredDiv.css';

const TIME_BETWEEN_UPDATES = 750;

class Loading extends React.Component {
  componentDidMount() {
    this.setState({loadingText: "Loading"}, () => {
      setTimeout(
        () => this.animateEllipses(),
        TIME_BETWEEN_UPDATES
      );
    });
  }
  animateEllipses() {
    if (this.state.loadingText.length < 10){
      this.setState({loadingText: this.state.loadingText + "."}, () => {
        setTimeout(
          () => this.animateEllipses(),
          TIME_BETWEEN_UPDATES
        );
      });
    }
    else {
      this.setState({loadingText: "Loading"}, () => {
        setTimeout(
          () => this.animateEllipses(),
          TIME_BETWEEN_UPDATES
        );
      });
    }
  }
  render() {
    return (
      <div className='loading-screen centered-div parent'>
        <div className='loading-screen centered-div middle'>
          <div className='loading-screen centered-div content'>
            <img src={logo} className='loading-logo' alt="Loading..." />
            <br />
            {this.state===null?"":this.state.loadingText}
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
