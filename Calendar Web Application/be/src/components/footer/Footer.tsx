import React from 'react';
import './footer.css';

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="footer__date">2021 | Availability Tracker</div>
        <div className="footer__team">Made by Team "Bit by Bit"</div>
      </div>
    );
  }
}
