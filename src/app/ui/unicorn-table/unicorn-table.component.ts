import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IUnicornTableColumn } from '../models';
import {
  IFhirPatient,
  IFhirPractitioner,
  IPreparedIFhirPatient,
  IPreparedIFhirPractitioner,
} from '@red-probeaufgabe/types';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FhirUtilService } from '@red-probeaufgabe/search';

@Component({
  selector: 'app-unicorn-table',
  templateUrl: './unicorn-table.component.html',
  styleUrls: ['./unicorn-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UnicornTableComponent implements OnInit {
  dataSource: MatTableDataSource<IFhirPatient | IFhirPractitioner> = new MatTableDataSource([]);

  expandedElement: IPreparedIFhirPatient | IPreparedIFhirPractitioner = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>();
  @Input() totalLength = 0;
  @Input() isLoading = false;

  @Input()
  set entries(value: Array<IFhirPatient | IFhirPractitioner>) {
    // Um den Abgleich für die Expanded Row eindeutig zu machen, benötigen wir einen eindeutigen Identifier in der Liste.
    // Da der Name später formattiert wird und die ID hier nur 'example' jeweils gefüllt ist, ist dieser Schritt hier notwendig.
    // In einem 'real life' Beispiel sollte jedes Objekt seine eigene eindeutige ID haben.
    value.forEach((val, index) => (val.id = index.toString()));
    this.dataSource.data = value;
  }

  constructor(private fhirUtilService: FhirUtilService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  expandElement(row: IFhirPatient | IFhirPractitioner) {
    if (this.expandedElement && this.expandedElement.id === row.id) {
      this.expandedElement = null;
    } else {
      const detailData = this.fhirUtilService.prepareData(row);
      this.expandedElement = detailData;
    }
  }
}
