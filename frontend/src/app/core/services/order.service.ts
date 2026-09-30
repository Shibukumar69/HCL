import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Order, CreateOrderRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/orders';

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData).pipe(
      map(res => res.data)
    );
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(res => res.data)
    );
  }
}
