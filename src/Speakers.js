import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo
} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/site.css';
import { Header } from '../src/Header';
import { Menu } from '../src/Menu';
import SpeakerData from './SpeakerData';
import SpeakerDetail from './SpeakerDetail';
import { ConfigContext } from './App';
import speakerReducer from './speakerReducer';
import useAxiosFetch from './useAxiosFetch';
import Axios from 'axios';

const Speakers = ({}) => {
  const [speakingSaturday, setSpeakingSaturday] = useState(true);
  const [speakingSunday, setSpeakingSunday] = useState(true);

  // const [speakerList, dispatch] = useReducer(speakerReducer, []);
  // const [isLoading, setIsLoading] = useState(true);

  const context = useContext(ConfigContext);

  const {
    data,
    isLoading,
    hasErrored,
    errorMessage,
    updateDataRecord
  } = useAxiosFetch('http://localhost:4000/speakers', []);

  const handleChangeSaturday = () => {
    setSpeakingSaturday(!speakingSaturday);
  };

  const newSpeakerList = useMemo(() => {
    return data
      .filter(
        ({ sat, sun }) => (speakingSaturday && sat) || (speakingSunday && sun)
      )
      .sort(function(a, b) {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }
        return 0;
      });
  }, [speakingSaturday, speakingSunday, data]);

  const speakerListFiltered = isLoading ? [] : newSpeakerList;
  if (hasErrored) {
    return (
      <div>
        {errorMessage} &nbsp; 'Make sure you have launched the json-server'
      </div>
    );
  }

  const handleChangeSunday = () => {
    setSpeakingSunday(!speakingSunday);
  };

  const heartFavoriteHandler = useCallback((e, speakerRec) => {
    e.preventDefault();
    const toggledSpeakerRec = { ...speakerRec, favorite: !speakerRec.favorite };
    Axios.put(
      `http://localhost:4000/speakers/${speakerRec.id}`,
      toggledSpeakerRec
    )
      .then(() => {
        updateDataRecord(toggledSpeakerRec);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
        <div className="btn-toolbar  margintopbottom5 checkbox-bigger">
          {context.showSpeakerSpeakingDays === false ? null : (
            <div className="hide">
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSaturday}
                    checked={speakingSaturday}
                  />
                  Saturday Speakers
                </label>
              </div>
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSunday}
                    checked={speakingSunday}
                  />
                  Sunday Speakers
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered
              ? speakerListFiltered.map(
                  ({ id, firstName, lastName, sat, sun, bio, favorite }) => {
                    return (
                      <SpeakerDetail
                        key={id}
                        id={id}
                        favorite={favorite}
                        onHeartFavoriteHandler={heartFavoriteHandler}
                        firstName={firstName}
                        lastName={lastName}
                        bio={bio}
                        sat={sat}
                        sun={sun}
                      />
                    );
                  }
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
