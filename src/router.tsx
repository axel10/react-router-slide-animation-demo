import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import history from './history';

import SlideRouter from "@/components/SlideRouter";
import Page1 from '@/pages/page1';
import Page2 from "@/pages/Page2";
import Page3 from "@/pages/Page3";

export const routes = () => {
  return (
    <Router history={history}>
      <Route render={() => {
        return (
          <SlideRouter routeAnimationDuration={400} history={history}>
            <Route path='/' exact={true} component={Page1} />
            <Route path='/2' exact={true} component={Page2} />
            <Route path='/3' exact={true} component={Page3} />
          </SlideRouter>
        );
      }}/>
    </Router>
  );
};
