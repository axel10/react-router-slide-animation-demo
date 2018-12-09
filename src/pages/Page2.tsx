import * as React from 'react';
import {NavLink} from "react-router-dom";

export default class Page2 extends React.Component {
  constructor (props) {
    super(props);
  }

  public render () {
    return (
      <div className={'Page2'}>
        page2
        <div>
          <NavLink to={'/3'}>
            to page3
          </NavLink>
        </div>
      </div>
    );
  }

}
