import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

export const createSamples = (...lengths) => {
  const createSamplesLevel = (depth = 0) => {
    const length = lengths[depth];
    return [...Array(length)].map(() => {
      return {
        ...getSample(),
        ...(lengths[depth + 1] !== undefined ? { children: createSamplesLevel(depth + 1) } : {}),
      };
    });
  };
  return createSamplesLevel();
};

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}
const getSample = () => {
  const statusChance = Math.random();
  return {
    libName: faker.address.city(),
    facStatus: get_random(['Poor', 'Fair', 'Average','Good']),
		annualVisits: Math.floor(Math.random() * 100000),
		websiteVisits: Math.floor(Math.random() * 100000),
		registeredBorrowers: Math.floor(Math.random() * 100),
    operating_income: Math.floor(Math.random() * 100000),
    operating_expenditures: Math.floor(Math.random() * 100000),
		proKids: Math.floor(Math.random() * 100),
		proTeens: Math.floor(Math.random() * 100),
		proAdults: Math.floor(Math.random() * 100),
		proGeneral: Math.floor(Math.random() * 100),
		database: Math.floor(Math.random() * 100),
		computers: Math.floor(Math.random() * 10000),
		wifi: Math.floor(Math.random() * 10000),
    /*progress: Math.floor(Math.random() * 100),*/
    /*status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single', */
  };
};
