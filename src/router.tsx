import * as React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import history from './history';

import Page1 from '@/pages/page1';
import Page2 from "@/pages/Page2";
import Page3 from "@/pages/Page3";
import config from '@/utils/config';

export const routes = () => {
  return (
    <Router history={history}>
      <Route render={(params) => {
        const { location } = params;
        return (
          <React.Fragment>
            <TransitionGroup  id={'routeWrap'}>
              <CSSTransition classNames={'router'} timeout={config.routeAnimationDuration} key={location.pathname}>
                <Switch location={location} key={location.pathname}>
                  <Route path='/' exact={true} component={Page1} />
                  <Route path='/2' exact={true} component={Page2} />
                  <Route path='/3' exact={true} component={Page3} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </React.Fragment>
        );
      }}/>
    </Router>
  );
};
