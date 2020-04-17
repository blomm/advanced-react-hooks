import React from 'react';
import Home from './Home';
import Login from './Login';
import Speakers from './Speakers';

export const ConfigContext = React.createContext();

const configValue = {
  showSignMeUp: true,
  showSpeakerSpeakingDays: true
};

const pageToShow = pageName => {
  if (pageName === 'Home') return <Home />;
  if (pageName === 'Speakers') return <Speakers />;
  if (pageName === 'Login') return <Login />;

  return <div>Not Found</div>;
};

const App = ({ pageName, userInfo }) => {
  configValue.loggedInUserEmail = userInfo ? userInfo.email : '';
  return (
    <ConfigContext.Provider value={configValue}>
      <div>{pageToShow(pageName)}</div>;
    </ConfigContext.Provider>
  );
};

export default App;
