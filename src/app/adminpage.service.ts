import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { URL } from './constants';
import { Observable } from 'rxjs'; // Import Observable

@Injectable({
  providedIn: 'root'
})
export class AdminpageService {


  constructor(private http:HttpClient) {} 




  // now modifications
  visitedNews:any[]=[];
  savedNews: any[] = []; 

  // Getdata():Observable<any>{
  //   console.log("wefhm")
  //   return this.http.get("http://127.0.0.1:8000/hindupulse/Staging_db/");
  // }


  Getdata(pageNumber: number = 1, pageSize: number = 50): Observable<any> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('page_size', pageSize.toString());
  
    return this.http.get(URL+"Staging_db/", { params });
  }
  


  // private baseUrl = 'http://127.0.0.1:8000/hindupulse/staging-to-production/transfer_to_production/';
  // transferData(id: any): Observable<any> {
  // return this.http.post<any>(`${this.baseUrl}${id}/`, {});
  // }



  private baseUrl = URL+'staging-to-production/transfer_to_production/';


  transferData(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${id}/`, {});
  }


  
 
  private baseUrls = URL+'edit_news_staging/';

  updateNews(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrls}${id}/`, data);
  }
  

  private apiUrls=URL+"Staging_db/"
  deleteNews(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrls}${id}/`);
  }
  



  // productionnews():Observable<any>{
    
  //   return this.http.get("http://127.0.0.1:8000/hindupulse/news/");
  // }


  productionnews(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get(URL+"news/", { params });
  }


  
  private apiview=URL+"news/"
  deleteFromProduction(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiview}${id}/`);
  }


  getCategories(): Observable<any> {
    return this.http.get(URL+`category/`);
  }

  getSubCategories() {
    return this.http.get(URL+`sub_category/`);
  }



  getSubcategoriesbyId(categoryId: string): Observable<any> {
    return this.http.get(URL+`sub_category_by_id/${categoryId}/`);
  }



  UndoFromProduction(id: any): Observable<any> {
    return this.http.post<any>(URL+`production-to-staging/transfer_to_staging/${id}/`, {}); // Sending empty body or add any necessary data
  }


fetchingnews():Observable<any>{
    
    return this.http.get("http://127.0.0.1:8000/hindupulse/Staging_db/fetch_news/");
  }
  

 



}





// getNewsItemById(id: any): Observable<any> {
//   return this.http.get('http://127.0.0.1:8000/news_app/Staging_db/' + id + '/');
// }
