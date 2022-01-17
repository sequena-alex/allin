import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AlamatHistory {
  playerCount: number;
  adminFunds: number;
  playerPondo: number;
  totalProfit: number;
  totalOverBet: number;
  alamat: number;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "https://bbcalc-be.herokuapp.com/api";

  constructor(private httpClient: HttpClient) { }

  public getHistory(){
    return this.httpClient.get(`${this.REST_API_SERVER}/getHistory` );
  }

  public getHistories(){
    return this.httpClient.get(`${this.REST_API_SERVER}/getHistories` );
  }

  public saveHistory(alamatHistory: AlamatHistory){
    return this.httpClient.post(`${this.REST_API_SERVER}/createHistory`,alamatHistory);
  }
}