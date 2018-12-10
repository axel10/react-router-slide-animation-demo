import * as React from "react";
import {Link} from "react-router-dom";


export default class Page1 extends React.Component {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={'Page1'} style={{height: 2000}} onClick={() => {
        console.log(1);
      }}>
        page1
        <Link to={'/2'} style={{display: 'block', marginTop: 1500}}>
          123
        </Link>
      </div>
    );
  }

}
