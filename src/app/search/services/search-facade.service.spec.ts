import { TestBed } from '@angular/core/testing';
import { PatientSearchService } from './patient-search.service';
import { PractitionerSearchService } from './practitioner-search.service';
import { SearchFacadeService } from './search-facade.service';

/**
 * Optionale Zusatzaufgabe
 */

const mockedPatients = [
  {
    active: true,
    address: [],
    birthDate: '1974-12-25',
    contact: [],
    deceasedBoolean: false,
    gender: 'male',
    id: '1',
    identifier: [],
    managingOrganization: {},
    meta: {},
    name: [
      {
        use: 'official',
        family: 'Chalmers',
        given: ['Peter', 'James'],
      },
      {
        use: 'usual',
        given: ['Jim'],
      },
      {
        use: 'maiden',
        family: 'Windsor',
        given: ['Peter', 'James'],
        period: {
          end: '2002',
        },
      },
    ],
    resourceType: 'Patient',
    telecom: [],
    text: {},
  },
];

const mockedPractitioners = [
  {
    active: true,
    address: [],
    id: '2',
    identifier: [],
    meta: {},
    name: [
      {
        family: 'Careful',
        given: ['Adam'],
        prefix: ['Dr'],
      },
    ],
    resourceType: 'Patient',
    telecom: [],
    qualification: [],
    text: {},
  },
];

const patientSearchServiceMock = {
  search: jest.fn(() => {
    return {
      entry: mockedPatients,
      total: 1,
    };
  }),
};

const practitionerSearchServiceMock = {
  search: jest.fn(() => {
    return {
      entry: mockedPractitioners,
      total: 1,
    };
  }),
};

describe('SearchFacadeService', () => {
  let service: SearchFacadeService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SearchFacadeService,
        { provide: PatientSearchService, use: patientSearchServiceMock },
        { provide: PractitionerSearchService, use: practitionerSearchServiceMock },
      ],
    });
    service = TestBed.inject(SearchFacadeService);
  });

  /* eslint-disable no-empty, @typescript-eslint/no-empty-function */
  test('should init', () => {
    expect(service).toBeTruthy();
  });

  test('should find patients', () => {
    service.searchPatients('Peter').subscribe((data) => {
      expect(data).toStrictEqual([
        [
          {
            active: true,
            address: [],
            birthDate: '1974-12-25',
            contact: [],
            deceasedBoolean: false,
            gender: 'male',
            id: '1',
            identifier: [],
            managingOrganization: {},
            meta: {},
            name: [
              {
                use: 'official',
                family: 'Chalmers',
                given: ['Peter', 'James'],
              },
              {
                use: 'usual',
                given: ['Jim'],
              },
              {
                use: 'maiden',
                family: 'Windsor',
                given: ['Peter', 'James'],
                period: {
                  end: '2002',
                },
              },
            ],
            resourceType: 'Patient',
            telecom: [],
            text: {},
          },
        ],
      ]);
    });
  });

  test('should find practitioners', () => {
    service.searchPractitioners('Adam').subscribe((data) => {
      expect(data).toStrictEqual([
        [
          {
            active: true,
            address: [],
            birthDate: '1974-12-25',
            contact: [],
            deceasedBoolean: false,
            gender: 'male',
            id: '1',
            identifier: [],
            managingOrganization: {},
            meta: {},
            name: [
              {
                use: 'official',
                family: 'Chalmers',
                given: ['Peter', 'James'],
              },
              {
                use: 'usual',
                given: ['Jim'],
              },
              {
                use: 'maiden',
                family: 'Windsor',
                given: ['Peter', 'James'],
                period: {
                  end: '2002',
                },
              },
            ],
            resourceType: 'Patient',
            telecom: [],
            text: {},
          },
        ],
      ]);
    });
  });

  test('should find both and merge the arrays', () => {
    service.searchAll('a').subscribe((data) => {
      expect(data).toStrictEqual({
        total: 2,
        entry: [
          {
            active: true,
            address: [],
            birthDate: '1974-12-25',
            contact: [],
            deceasedBoolean: false,
            gender: 'male',
            id: '1',
            identifier: [],
            managingOrganization: {},
            meta: {},
            name: [
              {
                use: 'official',
                family: 'Chalmers',
                given: ['Peter', 'James'],
              },
              {
                use: 'usual',
                given: ['Jim'],
              },
              {
                use: 'maiden',
                family: 'Windsor',
                given: ['Peter', 'James'],
                period: {
                  end: '2002',
                },
              },
            ],
            resourceType: 'Patient',
            telecom: [],
            text: {},
          },
          {
            active: true,
            address: [],
            id: '2',
            identifier: [],
            meta: {},
            name: [
              {
                family: 'Careful',
                given: ['Adam'],
                prefix: ['Dr'],
              },
            ],
            resourceType: 'Patient',
            telecom: [],
            qualification: [],
            text: {},
          },
        ],
      });
    });
  });
});
