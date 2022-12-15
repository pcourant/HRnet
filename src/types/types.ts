import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';

export type ChildrenProps = {
  children?: React.ReactNode;
};

export const STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
} as const;
export type StateName = typeof STATES[keyof typeof STATES];
export type StateAbbreviation = keyof typeof STATES;

export const DEPARTMENTS = {
  Sales: 'Sales',
  Marketing: 'Marketing',
  Engineering: 'Engineering',
  HR: 'Human Resources',
  Legal: 'Legal',
};
export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  startDate: Date;
  department: Department;
  dateOfBirth: Date;
  street: string;
  city: string;
  state: StateAbbreviation;
  zipcode: number;
}

export interface GetEmployeesResponse {
  employees: Employee[];
  total: number;
  page: number;
  pagesize: number;
}

export interface QueryOptionsInterface {
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}

export const queryOptionsInit: QueryOptionsInterface = {
  sortModel: [{ field: 'firstname', sort: 'asc' }],
  filterModel: { items: [], quickFilterValues: [] },
};
