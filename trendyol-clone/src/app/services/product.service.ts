/* import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    { id: 1, name: 'iPhone 14 Pro', brand: 'Apple', gender: 'Unisex', description: 'Experience the future.', price: 1200, imageUrl: 'assets/products/iphone14pro.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 2, name: 'Samsung Galaxy S23', brand: 'Samsung', gender: 'Unisex', description: 'Epic moments.', price: 1000, imageUrl: 'assets/products/galaxys23.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 3, name: 'Google Pixel 7', brand: 'Google', gender: 'Unisex', description: 'Pure Android.', price: 900, imageUrl: 'assets/products/pixel7.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 4, name: 'OnePlus 11', brand: 'OnePlus', gender: 'Unisex', description: 'Fast and smooth.', price: 850, imageUrl: 'assets/products/oneplus11.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 5, name: 'Xiaomi 13 Pro', brand: 'Xiaomi', gender: 'Unisex', description: 'Innovation for everyone.', price: 800, imageUrl: 'assets/products/xiaomi13pro.jpg', category: 'Smartphones', comments: [], ratings: [] },

    { id: 6, name: 'Macbook Air M2', brand: 'Apple', gender: 'Unisex', description: 'Supercharged.', price: 1500, imageUrl: 'assets/products/macbookairm2.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 7, name: 'Dell XPS 13', brand: 'Dell', gender: 'Unisex', description: 'Compact and powerful.', price: 1300, imageUrl: 'assets/products/dellxps13.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 8, name: 'Asus Zephyrus G14', brand: 'Asus', gender: 'Unisex', description: 'Gaming beast.', price: 1500, imageUrl: 'assets/products/asusg14.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 9, name: 'HP Spectre x360', brand: 'HP', gender: 'Unisex', description: 'Elegance and power.', price: 1100, imageUrl: 'assets/products/hpspectre.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 10, name: 'Lenovo Yoga 9i', brand: 'Lenovo', gender: 'Unisex', description: 'Flex your creativity.', price: 1090, imageUrl: 'assets/products/lenovoyoga9i.jpg', category: 'Laptops', comments: [], ratings: [] },

    { id: 11, name: 'Sony Alpha A7 III', brand: 'Sony', gender: 'Unisex', description: 'Full frame mirrorless.', price: 2000, imageUrl: 'assets/products/sonya7iii.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 12, name: 'Canon EOS R6', brand: 'Canon', gender: 'Unisex', description: 'High-speed mirrorless.', price: 2400, imageUrl: 'assets/products/canoneosr6.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 13, name: 'Nikon Z6 II', brand: 'Nikon', gender: 'Unisex', description: 'Stability and sharpness.', price: 2200, imageUrl: 'assets/products/nikonz6ii.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 14, name: 'Fujifilm X-T4', brand: 'Fujifilm', gender: 'Unisex', description: 'Professional photography.', price: 1800, imageUrl: 'assets/products/fujifilmxt4.jpg', category: 'Cameras', comments: [], ratings: [] },

    { id: 15, name: 'Nike Air Max 270', brand: 'Nike', gender: 'Unisex', description: 'Maximum comfort.', price: 160, imageUrl: 'assets/products/nikeairmax270.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 16, name: 'Adidas Ultraboost 22', brand: 'Adidas', gender: 'Unisex', description: 'Endless energy.', price: 180, imageUrl: 'assets/products/adidasultraboost.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 17, name: 'Zara Leather Jacket', brand: 'Zara', gender: 'Unisex', description: 'Timeless style.', price: 130, imageUrl: 'assets/products/zarajacket.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 18, name: 'H&M Hoodie', brand: 'H&M', gender: 'Unisex', description: 'Casual comfort.', price: 50, imageUrl: 'assets/products/hmhoodie.jpg', category: 'Fashion', comments: [], ratings: [] },

    { id: 19, name: 'Rolex Submariner', brand: 'Rolex', gender: 'Male', description: 'Iconic diving watch.', price: 8450, imageUrl: 'assets/products/rolexsubmariner.jpg', category: 'Watches', comments: [], ratings: [] },
    { id: 20, name: 'Omega Speedmaster', brand: 'Omega', gender: 'Male', description: 'Legendary moonwatch.', price: 7800, imageUrl: 'assets/products/omegaspeedmaster.jpg', category: 'Watches', comments: [], ratings: [] },

    { id: 21, name: 'Dyson V15 Detect', brand: 'Dyson', gender: 'Unisex', description: 'Laser detects dust.', price: 700, imageUrl: 'assets/products/dysonv15.jpg', category: 'Home Appliances', comments: [], ratings: [] },
    { id: 22, name: 'Roomba i7+', brand: 'iRobot', gender: 'Unisex', description: 'Advanced robot vacuum.', price: 800, imageUrl: 'assets/products/roombai7.jpg', category: 'Home Appliances', comments: [], ratings: [] },
    { id: 23, name: 'Amazon Echo Dot 5', brand: 'Amazon', gender: 'Unisex', description: 'Smart speaker.', price: 50, imageUrl: 'assets/products/echodot5.jpg', category: 'Home Appliances', comments: [], ratings: [] },

    { id: 24, name: 'Harry Potter Box Set', brand: 'Bloomsbury', gender: 'Unisex', description: 'Complete magical series.', price: 65, imageUrl: 'assets/products/harrypotter.jpg', category: 'Books', comments: [], ratings: [] },
    { id: 25, name: 'Atomic Habits', brand: 'Penguin', gender: 'Unisex', description: 'Tiny changes, big results.', price: 16, imageUrl: 'assets/products/atomichabits.jpg', category: 'Books', comments: [], ratings: [] },
    { id: 26, name: 'Kindle Paperwhite', brand: 'Amazon', gender: 'Unisex', description: 'E-reader.', price: 140, imageUrl: 'assets/products/kindlepaperwhite.jpg', category: 'Books', comments: [], ratings: [] },

    { id: 27, name: 'Fitbit Charge 5', brand: 'Fitbit', gender: 'Unisex', description: 'Fitness tracker.', price: 130, imageUrl: 'assets/products/fitbitcharge5.jpg', category: 'Watches', comments: [], ratings: [] },
    { id: 28, name: 'Garmin Forerunner 255', brand: 'Garmin', gender: 'Unisex', description: 'Running watch.', price: 350, imageUrl: 'assets/products/garminforerunner.jpg', category: 'Watches', comments: [], ratings: [] },

    { id: 29, name: 'LEGO Technic Ferrari', brand: 'LEGO', gender: 'Unisex', description: 'Rewarding build.', price: 180, imageUrl: 'assets/products/legoferrari.jpg', category: 'Toys', comments: [], ratings: [] },

    { id: 30, name: 'PlayStation 5', brand: 'Sony', gender: 'Unisex', description: 'Next-gen console.', price: 1800, imageUrl: 'assets/products/ps5.jpg', category: 'Gaming', comments: [], ratings: [] },
    { id: 31, name: 'Xbox Series X', brand: 'Microsoft', gender: 'Unisex', description: '4K gaming.', price: 1750, imageUrl: 'assets/products/xbox.jpg', category: 'Gaming', comments: [], ratings: [] },
    { id: 32, name: 'Nintendo Switch OLED', brand: 'Nintendo', gender: 'Unisex', description: 'Portable gaming.', price: 1250, imageUrl: 'assets/products/switch.jpg', category: 'Gaming', comments: [], ratings: [] },

    { id: 33, name: 'LG UltraGear 27"', brand: 'LG', gender: 'Unisex', description: 'Gaming monitor.', price: 620, imageUrl: 'assets/products/monitor-lg.jpg', category: 'Monitors', comments: [], ratings: [] },
    { id: 34, name: 'ASUS ProArt 32"', brand: 'Asus', gender: 'Unisex', description: 'Professional monitor.', price: 980, imageUrl: 'assets/products/monitor-asus.jpg', category: 'Monitors', comments: [], ratings: [] },
    { id: 35, name: 'Samsung Odyssey G7', brand: 'Samsung', gender: 'Unisex', description: 'Curved display.', price: 790, imageUrl: 'assets/products/monitor-samsung.jpg', category: 'Monitors', comments: [], ratings: [] },

    { id: 36, name: 'Maybelline Fit Me Foundation', brand: 'Maybelline', gender: 'Female', description: 'Matte foundation.', price: 8.50, category: 'Cosmetics', imageUrl: 'assets/products/foundation.jpg', comments: [], ratings: [] },
    { id: 37, name: 'L\'Oréal Voluminous Mascara', brand: 'L\'Oréal', gender: 'Female', description: 'Lash volume.', price: 9, category: 'Cosmetics', imageUrl: 'assets/products/mascara.jpg', comments: [], ratings: [] },
    { id: 38, name: 'Nivea Soft Cream', brand: 'Nivea', gender: 'Unisex', description: 'Moisturizing cream.', price: 7, category: 'Cosmetics', imageUrl: 'assets/products/cream.jpg', comments: [], ratings: [] },

    { id: 39, name: 'Milk 1L', brand: 'Local', gender: 'Unisex', description: 'Fresh milk.', price: 1.2, category: 'Supermarket', imageUrl: 'assets/products/milk.jpg', comments: [], ratings: [] },
    { id: 40, name: 'Sunflower Oil 1L', brand: 'Local', gender: 'Unisex', description: 'Cooking oil.', price: 3.9, category: 'Supermarket', imageUrl: 'assets/products/oil.jpg', comments: [], ratings: [] },
    { id: 41, name: 'Eggs (10-pack)', brand: 'Local', gender: 'Unisex', description: 'Farm eggs.', price: 2.5, category: 'Supermarket', imageUrl: 'assets/products/eggs.jpg', comments: [], ratings: [] },
    { id: 42, name: 'Bread', brand: 'Local', gender: 'Unisex', description: 'Fresh bread.', price: 1, category: 'Supermarket', imageUrl: 'assets/products/bread.jpg', comments: [], ratings: [] },
    { id: 43, name: 'Pasta (500g)', brand: 'Local', gender: 'Unisex', description: 'Durum pasta.', price: 1.5, category: 'Supermarket', imageUrl: 'assets/products/pasta.jpg', comments: [], ratings: [] },
    { id: 44, name: 'Cookies (Pack)', brand: 'Local', gender: 'Unisex', description: 'Crunchy cookies.', price: 2.2, category: 'Supermarket', imageUrl: 'assets/products/cookies.jpg', comments: [], ratings: [] },
    { id: 45, name: 'Salt (750g)', brand: 'Local', gender: 'Unisex', description: 'Table salt.', price: 0.8, category: 'Supermarket', imageUrl: 'assets/products/salt.jpg', comments: [], ratings: [] },
    { id: 46, name: 'Sugar (1kg)', brand: 'Local', gender: 'Unisex', description: 'Granulated sugar.', price: 1.6, category: 'Supermarket', imageUrl: 'assets/products/sugar.jpg', comments: [], ratings: [] },
    { id: 47, name: 'Rice (1kg)', brand: 'Local', gender: 'Unisex', description: 'Long grain rice.', price: 2.9, category: 'Supermarket', imageUrl: 'assets/products/rice.jpg', comments: [], ratings: [] },
    { id: 48, name: 'Tea (500g)', brand: 'Local', gender: 'Unisex', description: 'Black tea.', price: 2.5, category: 'Supermarket', imageUrl: 'assets/products/tea.jpg', comments: [], ratings: [] },
    { id: 49, name: 'Toothpaste', brand: 'Colgate', gender: 'Unisex', description: 'Whitening toothpaste.', price: 1.4, category: 'Supermarket', imageUrl: 'assets/products/toothpaste.jpg', comments: [], ratings: [] },
    { id: 50, name: 'Toilet Paper (12-roll)', brand: 'Local', gender: 'Unisex', description: 'Soft toilet paper.', price: 5.5, category: 'Supermarket', imageUrl: 'assets/products/toiletpaper.jpg', comments: [], ratings: [] },

    { id: 52, name: 'Basketball Ball', brand: 'Spalding', gender: 'Unisex', description: 'Standard basketball.', price: 120, category: 'Sports', imageUrl: 'assets/products/basketball.jpg', comments: [], ratings: [] },
    { id: 53, name: 'Football Ball', brand: 'Nike', gender: 'Unisex', description: 'Durable football.', price: 100, category: 'Sports', imageUrl: 'assets/products/football.jpg', comments: [], ratings: [] },
    { id: 54, name: 'Yoga Mat', brand: 'Generic', gender: 'Unisex', description: 'Non-slip yoga mat.', price: 30, category: 'Sports', imageUrl: 'assets/products/yoga-mat.jpg', comments: [], ratings: [] },
    { id: 55, name: 'Dumbbell Set', brand: 'Generic', gender: 'Unisex', description: 'Adjustable dumbbells.', price: 350, category: 'Sports', imageUrl: 'assets/products/dumbbell.jpg', comments: [], ratings: [] },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(product => product.id === id));
  }

  createProduct(product: any) {
    return this.http.post('http://localhost:8080/api/products', product);
  }
}
  */


// src/app/services/product.service.ts
/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private http: HttpClient) {}

  // Tüm ürünleri sunucudan çek
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  // Eğer detay sayfası olacaksa
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>('/api/products', product);
  }
}

 */





/* 
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  private products: Product[] = [
    { id: 1, name: 'iPhone 14 Pro', brand: 'Apple', gender: 'Unisex', description: 'iPhone 14 Pro \n\nMemory: 128 GB \nRAM: 6GB \nScreen Size: 6.1 inch \nResolution: 40-60 MP \nColour: Space Gray \nWarranty Period: 1 Year', price: 1200, imageUrl: 'assets/products/iphone14pro.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 2, name: 'Samsung Galaxy S23', brand: 'Samsung', gender: 'Unisex', description: 'Samsung Galaxy S23 \n\nMemory: 256 GB \nRAM: 8GB \nScreen Size: 6.1 inch \nResolution: 50 MP \nColour: Phantom Black \nWarranty Period: 1 Year', price: 1000, imageUrl: 'assets/products/galaxys23.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 3, name: 'Google Pixel 7', brand: 'Google', gender: 'Unisex', description: 'Google Pixel 7 \n\nMemory: 128 GB \nRAM: 8GB \nScreen Size: 6.3 inch \nResolution: 50 MP \nColour: Obsidian \nWarranty Period: 1 Year', price: 900, imageUrl: 'assets/products/pixel7.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 4, name: 'OnePlus 11', brand: 'OnePlus', gender: 'Unisex', description: 'OnePlus 11 \n\nMemory: 256 GB \nRAM: 12GB \nScreen Size: 6.7 inch \nResolution: 50 MP \nColour: Titan Black \nWarranty Period: 1 Year', price: 850, imageUrl: 'assets/products/oneplus11.jpg', category: 'Smartphones', comments: [], ratings: [] },
    { id: 5, name: 'Xiaomi 13 Pro', brand: 'Xiaomi', gender: 'Unisex', description: 'Xiaomi 13 Pro \n\nMemory: 256 GB \nRAM: 12GB \nScreen Size: 6.73 inch \nResolution: 50 MP \nColour: Ceramic Black \nWarranty Period: 1 Year', price: 800, imageUrl: 'assets/products/xiaomi13pro.jpg', category: 'Smartphones', comments: [], ratings: [] },
 
    { id: 6, name: 'Macbook Air M2', brand: 'Apple', gender: 'Unisex', description: 'Macbook Air M2 \n\nStorage: 256 GB SSD \nRAM: 8GB \nScreen Size: 13.6 inch \nResolution: 2560x1664 \nColour: Midnight \nWarranty Period: 1 Year', price: 1500, imageUrl: 'assets/products/macbookairm2.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 7, name: 'Dell XPS 13', brand: 'Dell', gender: 'Unisex', description: 'Dell XPS 13 \n\nStorage: 512 GB SSD \nRAM: 16GB \nScreen Size: 13.4 inch \nResolution: 1920x1200 \nColour: Platinum Silver \nWarranty Period: 1 Year', price: 1300, imageUrl: 'assets/products/dellxps13.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 8, name: 'Asus Zephyrus G14', brand: 'Asus', gender: 'Unisex', description: 'Asus Zephyrus G14 \n\nStorage: 1 TB SSD \nRAM: 16GB \nScreen Size: 14 inch \nResolution: 2560x1440 \nColour: Moonlight White \nWarranty Period: 1 Year', price: 1500, imageUrl: 'assets/products/asusg14.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 9, name: 'HP Spectre x360', brand: 'HP', gender: 'Unisex', description: 'HP Spectre x360 \n\nStorage: 512 GB SSD \nRAM: 16GB \nScreen Size: 13.5 inch \nResolution: 3000x2000 \nColour: Nightfall Black \nWarranty Period: 1 Year', price: 1100, imageUrl: 'assets/products/hpspectre.jpg', category: 'Laptops', comments: [], ratings: [] },
    { id: 10, name: 'Lenovo Yoga 9i', brand: 'Lenovo', gender: 'Unisex', description: 'Lenovo Yoga 9i \n\nStorage: 512 GB SSD \nRAM: 16GB \nScreen Size: 14 inch \nResolution: 3840x2160 \nColour: Storm Grey \nWarranty Period: 1 Year', price: 1090, imageUrl: 'assets/products/lenovoyoga9i.jpg', category: 'Laptops', comments: [], ratings: [] },
 
    { id: 11, name: 'Sony Alpha A7 III', brand: 'Sony', gender: 'Unisex', description: 'Sony Alpha A7 III \n\nSensor: 24.2 MP \nLens Mount: E-mount \nScreen Size: 3 inch \nResolution: 4K Video \nColour: Black \nWarranty Period: 1 Year', price: 2000, imageUrl: 'assets/products/sonya7iii.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 12, name: 'Canon EOS R6', brand: 'Canon', gender: 'Unisex', description: 'Canon EOS R6 \n\nSensor: 20.1 MP \nLens Mount: RF-mount \nScreen Size: 3 inch \nResolution: 4K Video \nColour: Black \nWarranty Period: 1 Year', price: 2400, imageUrl: 'assets/products/canoneosr6.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 13, name: 'Nikon Z6 II', brand: 'Nikon', gender: 'Unisex', description: 'Nikon Z6 II \n\nSensor: 24.5 MP \nLens Mount: Z-mount \nScreen Size: 3.2 inch \nResolution: 4K Video \nColour: Black \nWarranty Period: 1 Year', price: 2200, imageUrl: 'assets/products/nikonz6ii.jpg', category: 'Cameras', comments: [], ratings: [] },
    { id: 14, name: 'Fujifilm X-T4', brand: 'Fujifilm', gender: 'Unisex', description: 'Fujifilm X-T4 \n\nSensor: 26.1 MP \nLens Mount: X-mount \nScreen Size: 3 inch \nResolution: 4K Video \nColour: Silver \nWarranty Period: 1 Year', price: 1800, imageUrl: 'assets/products/fujifilmxt4.jpg', category: 'Cameras', comments: [], ratings: [] },
 
    { id: 15, name: 'Nike Air Max 270', brand: 'Nike', gender: 'Unisex', description: 'Nike Air Max 270 \n\nMaterial: Synthetic/Mesh \nSize: EU 36-46 \nColour: Black/White \nWarranty Period: 6 Months', price: 160, imageUrl: 'assets/products/nikeairmax270.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 16, name: 'Adidas Ultraboost 22', brand: 'Adidas', gender: 'Unisex', description: 'Adidas Ultraboost 22 \n\nMaterial: Primeknit \nSize: EU 36-46 \nColour: Core Black \nWarranty Period: 6 Months', price: 180, imageUrl: 'assets/products/adidasultraboost.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 17, name: 'Zara Leather Jacket', brand: 'Zara', gender: 'Unisex', description: 'Zara Leather Jacket \n\nMaterial: Faux Leather \nSize: S-XXL \nColour: Black \nWarranty Period: 3 Months', price: 130, imageUrl: 'assets/products/zarajacket.jpg', category: 'Fashion', comments: [], ratings: [] },
    { id: 18, name: 'H&M Hoodie', brand: 'H&M', gender: 'Unisex', description: 'H&M Hoodie \n\nMaterial: Cotton Blend \nSize: S-XXL \nColour: Grey \nWarranty Period: 3 Months', price: 50, imageUrl: 'assets/products/hmhoodie.jpg', category: 'Fashion', comments: [], ratings: [] },
 
    { id: 19, name: 'Rolex Submariner', brand: 'Rolex', gender: 'Male', description: 'Rolex Submariner \n\nMaterial: Stainless Steel \nMovement: Automatic \nDial Size: 41 mm \nColour: Black \nWarranty Period: 5 Years', price: 8450, imageUrl: 'assets/products/rolexsubmariner.jpg', category: 'Watches', comments: [], ratings: [] },
    { id: 20, name: 'Omega Speedmaster', brand: 'Omega', gender: 'Male', description: 'Omega Speedmaster \n\nMaterial: Stainless Steel \nMovement: Manual \nDial Size: 42 mm \nColour: Black \nWarranty Period: 5 Years', price: 7800, imageUrl: 'assets/products/omegaspeedmaster.jpg', category: 'Watches', comments: [], ratings: [] },
 
    { id: 21, name: 'Dyson V15 Detect', brand: 'Dyson', gender: 'Unisex', description: 'Dyson V15 Detect \n\nPower: 230 AW \nBattery Life: 60 min \nWeight: 3 kg \nColour: Nickel \nWarranty Period: 2 Years', price: 700, imageUrl: 'assets/products/dysonv15.jpg', category: 'Home Appliances', comments: [], ratings: [] },
    { id: 22, name: 'Roomba i7+', brand: 'iRobot', gender: 'Unisex', description: 'Roomba i7+ \n\nSuction Power: 1700 Pa \nBattery Life: 75 min \nWeight: 3.4 kg \nColour: Black \nWarranty Period: 1 Year', price: 800, imageUrl: 'assets/products/roombai7.jpg', category: 'Home Appliances', comments: [], ratings: [] },
    { id: 23, name: 'Amazon Echo Dot 5', brand: 'Amazon', gender: 'Unisex', description: 'Amazon Echo Dot 5 \n\nSpeaker Size: 1.73 inch \nConnectivity: Wi-Fi, Bluetooth \nDimensions: 100x100x89 mm \nColour: Charcoal \nWarranty Period: 1 Year', price: 50, imageUrl: 'assets/products/echodot5.jpg', category: 'Home Appliances', comments: [], ratings: [] },
 
    { id: 24, name: 'Harry Potter Box Set', brand: 'Bloomsbury', gender: 'Unisex', description: 'Harry Potter Box Set \n\nPages: 3400 \nFormat: Paperback \nLanguage: English \nColour: Multicolour \nWarranty Period: None', price: 65, imageUrl: 'assets/products/harrypotter.jpg', category: 'Books', comments: [], ratings: [] },
    { id: 25, name: 'Atomic Habits', brand: 'Penguin', gender: 'Unisex', description: 'Atomic Habits \n\nPages: 320 \nFormat: Hardcover \nLanguage: English \nColour: Blue \nWarranty Period: None', price: 16, imageUrl: 'assets/products/atomichabits.jpg', category: 'Books', comments: [], ratings: [] },
    { id: 26, name: 'Kindle Paperwhite', brand: 'Amazon', gender: 'Unisex', description: 'Kindle Paperwhite \n\nStorage: 8 GB \nScreen Size: 6.8 inch \nResolution: 300 ppi \nColour: Black \nWarranty Period: 1 Year', price: 140, imageUrl: 'assets/products/kindlepaperwhite.jpg', category: 'Books', comments: [], ratings: [] },
 
    { id: 27, name: 'Fitbit Charge 5', brand: 'Fitbit', gender: 'Unisex', description: 'Fitbit Charge 5 \n\nDisplay: AMOLED \nBattery Life: 7 days \nFeatures: ECG, SpO2 \nColour: Black \nWarranty Period: 1 Year', price: 130, imageUrl: 'assets/products/fitbitcharge5.jpg', category: 'Watches', comments: [], ratings: [] },
    { id: 28, name: 'Garmin Forerunner 255', brand: 'Garmin', gender: 'Unisex', description: 'Garmin Forerunner 255 \n\nDisplay: MIP \nBattery Life: 14 days \nFeatures: GPS, HR \nColour: Slate Grey \nWarranty Period: 1 Year', price: 350, imageUrl: 'assets/products/garminforerunner.jpg', category: 'Watches', comments: [], ratings: [] },
 
    { id: 29, name: 'LEGO Technic Ferrari', brand: 'LEGO', gender: 'Unisex', description: 'LEGO Technic Ferrari \n\nPieces: 1349 \nAge: 18+ \nDimensions: 45x25x11 cm \nColour: Red \nWarranty Period: None', price: 180, imageUrl: 'assets/products/legoferrari.jpg', category: 'Toys', comments: [], ratings: [] },
 
    { id: 30, name: 'PlayStation 5', brand: 'Sony', gender: 'Unisex', description: 'PlayStation 5 \n\nStorage: 825 GB SSD \nRAM: 16GB \nResolution: 4K \nColour: White \nWarranty Period: 1 Year', price: 1800, imageUrl: 'assets/products/ps5.jpg', category: 'Gaming', comments: [], ratings: [] },
    { id: 31, name: 'Xbox Series X', brand: 'Microsoft', gender: 'Unisex', description: 'Xbox Series X \n\nStorage: 1 TB SSD \nRAM: 16GB \nResolution: 4K \nColour: Black \nWarranty Period: 1 Year', price: 1750, imageUrl: 'assets/products/xbox.jpg', category: 'Gaming', comments: [], ratings: [] },
    { id: 32, name: 'Nintendo Switch OLED', brand: 'Nintendo', gender: 'Unisex', description: 'Nintendo Switch OLED \n\nStorage: 64 GB \nScreen Size: 7 inch \nResolution: 720p \nColour: White \nWarranty Period: 1 Year', price: 1250, imageUrl: 'assets/products/switch.jpg', category: 'Gaming', comments: [], ratings: [] },
 
    { id: 33, name: 'LG UltraGear 27"', brand: 'LG', gender: 'Unisex', description: 'LG UltraGear 27" \n\nResolution: 2560x1440 \nRefresh Rate: 240 Hz \nScreen Size: 27 inch \nColour: Black \nWarranty Period: 1 Year', price: 620, imageUrl: 'assets/products/monitor-lg.jpg', category: 'Monitors', comments: [], ratings: [] },
    { id: 34, name: 'ASUS ProArt 32"', brand: 'Asus', gender: 'Unisex', description: 'ASUS ProArt 32" \n\nResolution: 3840x2160 \nRefresh Rate: 60 Hz \nScreen Size: 32 inch \nColour: Black \nWarranty Period: 1 Year', price: 980, imageUrl: 'assets/products/monitor-asus.jpg', category: 'Monitors', comments: [], ratings: [] },
    { id: 35, name: 'Samsung Odyssey G7', brand: 'Samsung', gender: 'Unisex', description: 'Samsung Odyssey G7 \n\nResolution: 2560x1440 \nRefresh Rate: 240 Hz \nScreen Size: 27 inch \nColour: Black \nWarranty Period: 1 Year', price: 790, imageUrl: 'assets/products/monitor-samsung.jpg', category: 'Monitors', comments: [], ratings: [] },
 
    { id: 36, name: 'Maybelline Fit Me Foundation', brand: 'Maybelline', gender: 'Female', description: 'Maybelline Fit Me Foundation \n\nVolume: 30 ml \nFinish: Matte \nShades: Multiple \nWarranty Period: None', price: 8.50, imageUrl: 'assets/products/foundation.jpg', category: 'Cosmetics', comments: [], ratings: [] },
    { id: 37, name: 'L\'Oréal Voluminous Mascara', brand: 'L\'Oréal', gender: 'Female', description: 'L\'Oréal Voluminous Mascara \n\nVolume: 8 ml \nType: Volumizing \nColour: Black \nWarranty Period: None', price: 9, imageUrl: 'assets/products/mascara.jpg', category: 'Cosmetics', comments: [], ratings: [] },
    { id: 38, name: 'Nivea Soft Cream', brand: 'Nivea', gender: 'Unisex', description: 'Nivea Soft Cream \n\nVolume: 200 ml \nType: Moisturizing \nSkin Type: All \nWarranty Period: None', price: 7, imageUrl: 'assets/products/cream.jpg', category: 'Cosmetics', comments: [], ratings: [] },
 
    { id: 39, name: 'Milk 1L', brand: 'Local', gender: 'Unisex', description: 'Milk 1L \n\nVolume: 1 L \nType: Whole Milk \nPackaging: Carton \nWarranty Period: None', price: 1.2, imageUrl: 'assets/products/milk.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 40, name: 'Sunflower Oil 1L', brand: 'Local', gender: 'Unisex', description: 'Sunflower Oil 1L \n\nVolume: 1 L \nType: Refined \nPackaging: Bottle \nWarranty Period: None', price: 3.9, imageUrl: 'assets/products/oil.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 41, name: 'Eggs (10-pack)', brand: 'Local', gender: 'Unisex', description: 'Eggs (10-pack) \n\nQuantity: 10 \nType: Free Range \nPackaging: Carton \nWarranty Period: None', price: 2.5, imageUrl: 'assets/products/eggs.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 42, name: 'Bread', brand: 'Local', gender: 'Unisex', description: 'Bread \n\nWeight: 500 g \nType: White \nPackaging: Plastic \nWarranty Period: None', price: 1, imageUrl: 'assets/products/bread.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 43, name: 'Pasta (500g)', brand: 'Local', gender: 'Unisex', description: 'Pasta (500g) \n\nWeight: 500 g \nType: Durum Wheat \nPackaging: Plastic \nWarranty Period: None', price: 1.5, imageUrl: 'assets/products/pasta.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 44, name: 'Cookies (Pack)', brand: 'Local', gender: 'Unisex', description: 'Cookies (Pack) \n\nWeight: 200 g \nType: Chocolate Chip \nPackaging: Plastic \nWarranty Period: None', price: 2.2, imageUrl: 'assets/products/cookies.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 45, name: 'Salt (750g)', brand: 'Local', gender: 'Unisex', description: 'Salt (750g) \n\nWeight: 750 g \nType: Table Salt \nPackaging: Carton \nWarranty Period: None', price: 0.8, imageUrl: 'assets/products/salt.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 46, name: 'Sugar (1kg)', brand: 'Local', gender: 'Unisex', description: 'Sugar (1kg) \n\nWeight: 1 kg \nType: Granulated \nPackaging: Plastic \nWarranty Period: None', price: 1.6, imageUrl: 'assets/products/sugar.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 47, name: 'Rice (1kg)', brand: 'Local', gender: 'Unisex', description: 'Rice (1kg) \n\nWeight: 1 kg \nType: Long Grain \nPackaging: Plastic \nWarranty Period: None', price: 2.9, imageUrl: 'assets/products/rice.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 48, name: 'Tea (500g)', brand: 'Local', gender: 'Unisex', description: 'Tea (500g) \n\nWeight: 500 g \nType: Black Tea \nPackaging: Carton \nWarranty Period: None', price: 2.5, imageUrl: 'assets/products/tea.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 49, name: 'Toothpaste', brand: 'Colgate', gender: 'Unisex', description: 'Toothpaste \n\nVolume: 100 ml \nType: Whitening \nPackaging: Tube \nWarranty Period: None', price: 1.4, imageUrl: 'assets/products/toothpaste.jpg', category: 'Supermarket', comments: [], ratings: [] },
    { id: 50, name: 'Toilet Paper (12-roll)', brand: 'Local', gender: 'Unisex', description: 'Toilet Paper (12-roll) \n\nQuantity: 12 Rolls \nType: 3-Ply \nPackaging: Plastic \nWarranty Period: None', price: 5.5, imageUrl: 'assets/products/toiletpaper.jpg', category: 'Supermarket', comments: [], ratings: [] },
 
    { id: 52, name: 'Basketball Ball', brand: 'Spalding', gender: 'Unisex', description: 'Basketball Ball \n\nSize: 7 \nMaterial: Composite Leather \nColour: Orange \nWarranty Period: 6 Months', price: 120, imageUrl: 'assets/products/basketball.jpg', category: 'Sports', comments: [], ratings: [] },
    { id: 53, name: 'Football Ball', brand: 'Nike', gender: 'Unisex', description: 'Football Ball \n\nSize: 5 \nMaterial: Synthetic Leather \nColour: White/Black \nWarranty Period: 6 Months', price: 100, imageUrl: 'assets/products/football.jpg', category: 'Sports', comments: [], ratings: [] },
    { id: 54, name: 'Yoga Mat', brand: 'Generic', gender: 'Unisex', description: 'Yoga Mat \n\nDimensions: 183x61 cm \nMaterial: PVC \nColour: Blue \nWarranty Period: 3 Months', price: 30, imageUrl: 'assets/products/yoga-mat.jpg', category: 'Sports', comments: [], ratings: [] },
    { id: 55, name: 'Dumbbell Set', brand: 'Generic', gender: 'Unisex', description: 'Dumbbell Set \n\nWeight: 20 kg \nMaterial: Cast Iron \nColour: Black \nWarranty Period: 1 Year', price: 350, imageUrl: 'assets/products/dumbbell.jpg', category: 'Sports', comments: [], ratings: [] },
  ];
 
  constructor(private http: HttpClient) {}
 
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }
 
  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(product => product.id === id));
  }
 
  createProduct(product: any) {
    return this.http.post('http://localhost:8080/api/products', product);
  }
}
  */

// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Product } from '../models/product.model';
import { ReviewService } from './review.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Public (herkesin görebileceği) ürün endpoint’i
  private publicBase = 'http://localhost:8080/api/products';
  // Seller (sadece satıcıların kullanacağı) endpoint’i
  private sellerBase = 'http://localhost:8080/api/seller/products';

  constructor(
    private http: HttpClient,
    private reviewSvc: ReviewService
  ) {}

  //1) GET /api/products  - Ana sayfa: sadece aktif ürünleri, yorumları ve ortalama puanı ile getir
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.publicBase).pipe(
      map(products => products.map(p => ({...p, imageUrl: p.image , reviews: [], avgRating: 0 }))),
      switchMap(products =>
        forkJoin(
          products.map(p =>
            this.reviewSvc.list(p.id).pipe(
              map(revs => {
                const avg = revs.length
                  ? revs.reduce((sum, r) => sum + r.rating, 0) / revs.length
                  : 0;
                return { ...p, reviews: revs, avgRating: avg };
              })
            )
          )
        )
      )
    );
  }

  //2) GET /api/products/{id} - Tek ürün detayı (yorumlarla birlikte)
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.publicBase}/${id}`).pipe(
      switchMap(p =>
        this.reviewSvc.list(id).pipe(
          map(revs => ({
            ...p,
            imageUrl: p.image,
            reviews: revs,
            avgRating: revs.length
              ? revs.reduce((s, r) => s + r.rating, 0) / revs.length
              : 0
          }))
        )
      )
    );
  }

  //3) GET /api/seller/products - Seller paneli: kendi ürünlerin 
  getSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.sellerBase);
  }

  //4) POST /api/seller/products - Satıcı yeni ürün ekler
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.sellerBase, product);
  }

  //5) PUT /api/seller/products/{id} - Satıcı mevcut ürünü günceller
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.sellerBase}/${id}`, product);
  }

  //6) DELETE /api/seller/products/{id}- Satıcı ürünü siler
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sellerBase}/${id}`);
  }
}
