import React from 'react';
import './Loading.css';
import './CenteredDiv.css';

const TIME_BETWEEN_UPDATES = 750;

class Loading extends React.Component {
  componentDidMount() {
    this._isMounted = true;
    if( this._isMounted) this.setState({loadingText: "Loading"}, () => {
      setTimeout(
        () => this.animateEllipses(),
        TIME_BETWEEN_UPDATES
      );
    });
  }
  componentWillUnmount() { this._isMounted = false; }
  animateEllipses() {
    if( !this._isMounted) return;
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
  get spinnerHTML() {
    return (
      <div className="lds-css">
        {/* Loading spinner made on loading.io */}
        <div className="lds-spinner" style={{height:"100%"}}>
          { /* one div for each section */}
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className='loading-screen centered-div parent'>
        <div className='loading-screen centered-div middle'>
          <div className='loading-screen centered-div content'>
            {this.spinnerHTML}
            <br />
            {this.state && this.state.loadingText}
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
