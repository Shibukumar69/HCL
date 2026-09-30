import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Supplier } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/suppliers';

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<ApiResponse<Supplier>>(this.apiUrl, supplier).pipe(
      map(res => res.data)
    );
  }

  deleteSupplier(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.success)
    );
  }
}
