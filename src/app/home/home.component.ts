import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {CountriesDataService} from '../shared/countries-data.service';
import StatisticsModel from '../models/statistics.model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import CountryDataModel from '../models/country-data.model';
import { TrafficService } from '../shared/traffic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

// MatPaginator Inputs
  pagedList: CountryDataModel[] = [];
  breakpoint: number = 6;  //to adjust to screen
  // MatPaginator Inputs
  length: number = 0;
  pageSize: number = 6;  //displaying three cards each row
  pageSizeOptions: number[] = [6, 12, 18, 24];

  // MatPaginator Output
  pageEvent: PageEvent;

  countriesDataSubscription: Subscription;
  isLoading = true;
  isError = false;
  countriesData: CountryDataModel[] = [];
  countriesList: CountryDataModel[] = [];

  constructor(private titleService: Title, private countriesDataService: CountriesDataService, private snackBar: MatSnackBar,
              private trafficService: TrafficService) {
  }

  ngOnInit(): void {
    // Increment views
    this.trafficService.incrementViews();
    // Set page title
    this.titleService.setTitle('COVID19 - Home');
    // Retrieve countries data
    this.countriesDataSubscription = this.countriesDataService.getRegionsData().subscribe(
      (countriesData) => {
        this.countriesData = countriesData;
        this.countriesList = countriesData;
        this.pagedList = this.countriesList.slice(0, 6);
        this.length = this.countriesList.length;
      },
      (error) => {
        this.snackBar.open('An error occurred', 'Undo', {
          duration: 6000,
        });
        this.isError = true;
      },
      () => {
        // Disable loading
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    // Desroy subscription
    if (this.countriesDataSubscription != null) {
      this.countriesDataSubscription.unsubscribe();
    }
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pagedList = this.countriesList.filter(countryData =>
      countryData.country.toLocaleLowerCase().indexOf(filterValue.toLowerCase()) !== -1).slice(0, 6);
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedList = this.countriesList.slice(startIndex, endIndex);
  }

}
