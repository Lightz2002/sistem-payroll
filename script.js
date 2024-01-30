const users = [
  {
    id: 1,
    full_name: 'Nisse',
  },
  {
    id: 2,
    full_name: 'Bernadette',
  },
  {
    id: 3,
    full_name: 'Spence',
  },
  {
    id: 4,
    full_name: 'Calli',
  },
  {
    id: 5,
    full_name: 'Angelika',
  },
  {
    id: 6,
    full_name: 'Clair',
  },
  {
    id: 7,
    full_name: 'Jaime',
  },
  {
    id: 8,
    full_name: 'Pietra',
  },
  {
    id: 9,
    full_name: 'Koo',
  },
  {
    id: 10,
    full_name: 'Angelika',
  },
  {
    id: 11,
    full_name: 'Mel',
  },
  {
    id: 12,
    full_name: 'Karry',
  },
  {
    id: 13,
    full_name: 'Manfred',
  },
  {
    id: 14,
    full_name: 'Clayson',
  },
  {
    id: 15,
    full_name: 'Malva',
  },
  {
    id: 16,
    full_name: 'Kessia',
  },
  {
    id: 17,
    full_name: 'Sloane',
  },
  {
    id: 18,
    full_name: 'Celeste',
  },
  {
    id: 19,
    full_name: 'Herbert',
  },
  {
    id: 20,
    full_name: 'Fields',
  },
  {
    id: 21,
    full_name: 'Kellina',
  },
  {
    id: 22,
    full_name: 'Krista',
  },
  {
    id: 23,
    full_name: 'Ruperto',
  },
  {
    id: 24,
    full_name: 'Delinda',
  },
  {
    id: 25,
    full_name: 'El',
  },
  {
    id: 26,
    full_name: 'Fernandina',
  },
  {
    id: 27,
    full_name: 'Ian',
  },
  {
    id: 28,
    full_name: 'Prent',
  },
  {
    id: 29,
    full_name: 'Kristen',
  },
  {
    id: 30,
    full_name: 'Arthur',
  },
];

function getFullNames(userIds, users) {
  const result = [];

  function findFullNameById(userId) {
    const user = users.find(user => user.id === userId);
    return user ? user.full_name : null;
  }

  function processArray(arr) {
    const names = [];
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        names.push(processArray(arr[i]));
      } else {
        const fullName = findFullNameById(arr[i]);
        if (fullName) {
          names.push(fullName);
        }
      }
    }
    return names;
  }

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const fullName = findFullNameById(userId);
    if (fullName) {
      result.push(fullName);
    } else {
      result.push(processArray(userIds[i]));
    }
  }

  return result;
}

const array1 = [12, 2, 5, 6, 8, 10, 22, 30, 23, 15, 7];
const array2 = [13, 2, 24, 7, [1, 30, 25, 6]];
const array3 = [5, 7, 4, [1, 3], [6, 9, 13, [2, 27, 29]]];

console.log(getFullNames(array1, users));
console.log(getFullNames(array2, users));
console.log(getFullNames(array3, users));
