# Analytics-19 Web Application
> Analytics-19 is a dashboard that holds data, statistics analytics about Corona virus all around the world

## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info

## Screenshots

## Technologies

For Frontend
* Angular 
* Bootstrap

For Backend
* Using a mix of APIS to retrieve regions then countries and for each country
* Send HTTP calls to an other Web service which returns back relative data of the specified country :
http://covid19.soficoop.com/country/{countryCode} (e.g. http://covid19.soficoop.com/country/ma) https://restcountries.eu/

For Project Managment
* Trello

## Setup

You can clone this repository and setup angular environement.
Why no live demo ? deploying this project is going to cost money for a good hosting service.

## Code Examples
Corona virus updated statistics.
```typescript
  private static API = 'http://covid19.soficoop.com/country';

  constructor(private http: HttpClient, private datepipe: DatePipe) {
  }

  /**
   * Get covid data from API
   * Http Interceptor will perform error in case of unsuccessful operation
   */
  getData(countryCode: string, startDate: Date = null, endDate: Date = null) {
    return this.http.get<{snapshots: Array<StatisticsModel>, name: string, code: string}>(`${StatisticsService.API}/${countryCode}`).pipe(
      map((data) => {
        const desiredDate: Date = new Date();
        desiredDate.setHours(19, 0, 0, 0);
        let snapshots :Array<StatisticsModel> = new Array<StatisticsModel>();
        // Apply range if required
        if( startDate != null && endDate != null ) {
          data.snapshots.forEach((snapshot) => {
            const timestampDate1 = new Date(snapshot.timestamp);
            const timestampDate2 = new Date(snapshot.timestamp);
            // Subtract 24 hours to include end date 
            timestampDate2.setUTCHours(timestampDate2.getUTCHours() - 24);
            if( compareDate(timestampDate1, startDate) >= 0 && compareDate(timestampDate2, endDate) <= 0 ) {
              snapshots = [...snapshots, snapshot];
            }
          });
          data.snapshots = snapshots.slice();
        }
        // Retrieve snapshots of each day at 7 PM
        snapshots = [];
        data.snapshots.forEach((row) => {
          if( new Date(row.timestamp).getHours() == desiredDate.getHours() ) {
            row.timestamp = this.datepipe.transform(row.timestamp, 'dd/MM/yyyy');
            snapshots = [...snapshots, row];
          } 
        });
        // Reverse array to start from first first date
        data.snapshots = snapshots.slice().reverse();
        return data;
      }),
      retry(5)
    );
  }
```
## Features
* Graphs and latest statistics about Corona virus in the whole world.
## Status
Project is: _in progress_, 

## Inspiration
Project Inspired By Sedki

## Contact
Created by [@Sed9yDataBank](https://github.com/Sed9yDataBank) - Feel Free To Contact Me : [ benzidsedki@gmail.com ]
