import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model'; 
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  standalone: false
})
export class FavoritesComponent implements OnInit {
  favorites: Product[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favoriteService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });
  }
}

