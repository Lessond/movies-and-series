import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: any[] = [];
  id: string = "";
  selectedOption = 'movies'; // Valore iniziale del segment button
  searchText = '';
  showDetails = false;
  selectedFilm: any;
  darkMode = false;
  showIcon1 = true;
  showIcon2 = false;
  sortingOption = 'year';
  yearsArray: number[] = [];

  itemsGroupedByYear: { [year: number]: any[] } = {};

  constructor(private http: HttpClient) {}

  searchItems() {
    let apiUrl = this.selectedOption === 'movies'
        ? `http://www.omdbapi.com/?s=${encodeURIComponent(this.searchText)}&apikey=f482abf9&type=movie`
        : `http://www.omdbapi.com/?s=${encodeURIComponent(this.searchText)}&apikey=f482abf9&type=series`;
  
    this.http.get(apiUrl).pipe(
      tap((response: any) => {
        this.showDetails = false;
        this.items = response.Search;
        this.itemsGroupedByYear = {}; // Resetta l'oggetto prima di raggruppare gli elementi
        for (const item of this.items) {
          const year = parseInt(item.Year);
          if (!this.itemsGroupedByYear[year]) {
            this.itemsGroupedByYear[year] = [];
          }
          this.itemsGroupedByYear[year].push(item);
        }
      })
    ).subscribe(() => {
      this.yearsArray = Object.keys(this.itemsGroupedByYear).map(Number).sort((a, b) => b - a);
    });
  
  
  }

  getDetails(selectedId: string, item: any) {
    this.id = selectedId;

    let apiUrl = this.selectedOption === 'movies'
      ? `http://www.omdbapi.com/?i=${encodeURIComponent(this.id)}&apikey=f482abf9&type=movie`
      : `http://www.omdbapi.com/?i=${encodeURIComponent(this.id)}&apikey=f482abf9&type=series`;

    this.http.get(apiUrl).subscribe((response: any) => {

      if (Array.isArray(response)) {
        this.items = response; // Assegna l'array di elementi alla variabile items
      } else {
        this.items = []; // Inizializza items come array vuoto in caso di dati non validi
      }
      this.selectedFilm = response;
      this.showDetails = true;
    });
  }

  goBack() {
    this.showDetails = false;
    this.searchItems();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.showIcon1 = !this.showIcon1;
    this.showIcon2 = !this.showIcon2;
  }

}
