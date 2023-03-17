import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ISearchFormData } from '@red-probeaufgabe/types';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  searchForm: FormGroup;

  @Input() selectOptions = [];
  @Input() searchFormData$?: BehaviorSubject<ISearchFormData>;

  @Output() search = new EventEmitter<ISearchFormData>();

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchInput: new FormControl('', { validators: Validators.pattern('^[a-zA-Z0-9]*$') }),
      selectInput: new FormControl(this.selectOptions[2].value),
    });
    this.searchForm.controls['searchInput'].valueChanges.subscribe((searchValue) => {
      const selectInput = this.searchForm.controls['selectInput'];
      const searchInput = this.searchForm.controls['searchInput'];
      if (searchInput.valid) {
        this.searchFormData$.next({ searchText: searchValue.trim(), searchFuncSelect: selectInput.value });
      }
    });

    this.searchForm.controls['selectInput'].valueChanges.subscribe((selectValue) => {
      const searchInput = this.searchForm.controls['searchInput'];
      if (searchInput.valid) {
        this.searchFormData$.next({ searchText: searchInput.value.trim(), searchFuncSelect: selectValue });
      }
    });
  }
}
