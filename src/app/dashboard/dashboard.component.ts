import { Component } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import {
  FhirSearchFn,
  IFhirPatient,
  IFhirPractitioner,
  IFhirSearchResponse,
  ISearchFormData,
} from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { SearchFacadeService } from '@red-probeaufgabe/search';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  searchFormData$ = new BehaviorSubject<ISearchFormData>({ searchText: '', searchFuncSelect: FhirSearchFn.SearchAll });

  fhirSearchOptions = Object.values(FhirSearchFn).map((fhirSearchValue) => {
    switch (fhirSearchValue) {
      case 'searchAll':
        return { value: fhirSearchValue, key: 'Patients + Practitioners' };
      case 'searchPatients':
        return { value: fhirSearchValue, key: 'Patients' };
      case 'searchPractitioners':
        return { value: fhirSearchValue, key: 'Practitioners' };
    }
  });

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.searchFormData$.pipe(
    switchMap((data) => {
      return this.searchFacade.search(data.searchFuncSelect, data.searchText).pipe(
        catchError(this.handleError),
        tap(() => {
          this.isLoading = false;
        }),
        shareReplay(),
      );
    }),
  );

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  // Fehler: Der Abstract Service wurde importiert statt des richtigen implementierten Search Facade Services, des weiteren musste der Service im dashboard.module.ts im providers Array hinzugefügt werden.
  // Abstrakte Klassen/Services sind Blaupausen für davon abgeleitete Klassen/Services und können daher nicht im Code produktiv verwendet werden. Des weiteren muss ein Service immer als provider im zugehörigen oder App-Modul registriert werden.

  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
