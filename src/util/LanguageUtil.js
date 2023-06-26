import English from './english';
import Hebrew from './hebrew';

const getLanguageObject = (language) => {
  switch (language) {
    case 'en':
      return English;
    case 'he':
      return Hebrew;
    default:
      return English;
  }
};

export default getLanguageObject;
