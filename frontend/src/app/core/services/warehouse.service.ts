import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Warehouse, InventoryItem, StockTransferRequest } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/warehouses`;

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<ApiResponse<Warehouse[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  createWarehouse(warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.post<ApiResponse<Warehouse>>(this.apiUrl, warehouse).pipe(
      map(res => res.data)
    );
  }

  getInventoryOverview(): Observable<InventoryItem[]> {
    return this.http.get<ApiResponse<InventoryItem[]>>(`${this.apiUrl}/inventory/overview`).pipe(
      map(res => res.data)
    );
  }

  getLowStockAlerts(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/inventory/low-stock`).pipe(
      map(res => res.data)
    );
  }

  transferStock(transferData: StockTransferRequest): Observable<{ message: string }> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/inventory/transfer`, transferData).pipe(
      map(res => ({ message: res.message || 'Stock transferred successfully' }))
    );
  }
}
