import { Flight } from './flight';
import { FlightFilter } from './flight-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class FlightService {
  flightList: Flight[] = [];

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<Flight> {
    const url = `https://rajesh-node-demo.azurewebsites.net/api/sensors/${id}`;
    const params = { 'id': id };
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<Flight>(url, {headers});
  }

  load(filter: FlightFilter): void {
    this.find(filter).subscribe(result => {
		
		let sensorsdata = JSON.stringify(result);
        this.flightList = JSON.parse(sensorsdata).data;
		
		
      },
      err => {
        console.error('error loading', err);
      }
    );
  }

  find(filter: FlightFilter): Observable<Flight[]> {
    const url = `https://rajesh-node-demo.azurewebsites.net/api/sensors`;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const params = {
      'from': filter.from,
      'to': filter.to,
    };

    return this.http.get<Flight[]>(url, {headers});
  }

  save(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
	
	let entityObjid = JSON.stringify(entity);
    let entityid = JSON.parse(entityObjid);
	
    if (entityid.Id) {
      url = `https://rajesh-node-demo.azurewebsites.net/api/sensors/${entityid.Id}`;
      params = new HttpParams().set('Id', entityid.Id.toString());
      return this.http.put<Flight>(url, entityid, {headers, params});
    } else {
      url = `https://rajesh-node-demo.azurewebsites.net/api/sensors`;
      return this.http.post<Flight>(url, entityid, {headers, params});
    }
  }

  delete(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
	let entityObjid = JSON.stringify(entity);
    let entityid = JSON.parse(entityObjid);
    if (entityid.Id) {
      url = `https://rajesh-node-demo.azurewebsites.net/api/sensors/${entityid.Id}`;
      params = new HttpParams().set('Id', entityid.Id);
      return this.http.delete<Flight>(url, {headers});
    }
    return EMPTY;
  }
}

