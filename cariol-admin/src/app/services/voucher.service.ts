import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = 'http://localhost:3002/vouchers';

  constructor(private http: HttpClient) {}

  getVouchers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addVoucher(voucher: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, voucher);
  }

  updateVoucher(voucher: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${voucher._id}`, voucher);
  }  

  deleteVoucher(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
