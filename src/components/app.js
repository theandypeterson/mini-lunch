import React from 'react';
import Header from './Header';
import Pairer from './Pairer';
import { Provider } from 'react-redux'

export const App = ({ store }) => (
  <Provider store={store}>
    <div className='container text-center'>
      <Header/>
      <Pairer/>
    </div>
  </Provider>
);

export default App;
