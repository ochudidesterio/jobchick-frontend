import {Translation} from './WordsUtil';

const calculateTimeElapsed = (timestamp,hr,min,sec,s,ago,day)=> {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);

  const timeDifference = currentTime - pastTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${ago} ${days} ${day}`;
  } else if (hours > 0) {
    return `${ago} ${hours} ${hr}`;
  } else if (minutes > 0) {
    return `${ago} ${minutes} ${min}`;
  } else {
    return `${ago} ${seconds} ${sec}`;
  }
};

export default calculateTimeElapsed;
