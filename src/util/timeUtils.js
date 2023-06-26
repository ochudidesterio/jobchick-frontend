import {Translation} from './WordsUtil';

const calculateTimeElapsed = timestamp => {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);

  const timeDifference = currentTime - pastTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${Translation.word.day}${
      days > 1 ? Translation.word.s : ''
    } ${Translation.word.ago}`;
  } else if (hours > 0) {
    return `${hours} ${Translation.word.hr}${
      hours > 1 ? Translation.word.s : ''
    } ${Translation.word.ago}`;
  } else if (minutes > 0) {
    return `${minutes} ${Translation.word.min}${
      minutes > 1 ? Translation.word.s : ''
    } ${Translation.word.ago}`;
  } else {
    return `${seconds} ${Translation.word.sec}${
      seconds !== 1 ? Translation.word.s : ''
    } ${Translation.word.ago}`;
  }
};

export default calculateTimeElapsed;
