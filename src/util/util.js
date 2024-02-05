  // Function to calculate distance between two coordinates in kilometers
export const calculateDistance=(lat1, lon1, lat2, lon2) =>{
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  // Function to convert degrees to radians
  const degreesToRadians=(degrees)=> {
    return (degrees * Math.PI) / 180;
  }

  // Helper function to check if two arrays are equal
export  const areArraysEqual =(arr1, arr2)=>{
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  // export const filterJobsByCategory = (jobs, categoryName) => {
  //   return jobs.filter(job => job.category === categoryName);
  // };

  export const filterJobsByCategory = (jobs, categories) => {
    // Create an array of category names from the category objects
    const categoryNames = categories.map(category => category.name);
  
    // Filter jobs that have a category name that is in the categoryNames array
    return jobs.filter(job => categoryNames.includes(job.category));
  };
  
  export const filterUsersByAgeRange =(users,age)=>{
    return users.filter(user => user.age < age);

  }
  export const LEVELS =[
    {
      id: 1,
      name: 'Elementary Education',
    },
    {id: 2, name: 'Secondary Education'},
    {
      id: 3,
      name: 'Bachelors Degree',
    },
    {
      id: 4,
      name: 'Masters Degree',
    },
  ]

 export const LANGUAGES = [
    {
      key: 1,
      value: 'Spanish',
    },
    {key: 2, value: 'English'},
    {
      key: 3,
      value: 'Kiswahili',
    },
    {
      key: 4,
      value: 'Hebrew',
    },
    {
      key: 5,
      value: 'French',
    },
    {
      key: 6,
      value: 'Arabic',
    },
    {
      key: 7,
      value: 'Yiddish',
    },
    {
      key: 8,
      value: 'Russian',
    },
    {
      key: 9,
      value: 'Amharic',
    },
    {
      key: 10,
      value: 'German',
    },
  ];

  export const PRIVACY_POLICY = 'https://www.termsfeed.com/live/c22e0755-3001-46f2-9cac-2dc76ae16edb'
