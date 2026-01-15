
export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  soldCount: number;
  imageUrl: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface FlashSaleItem extends Product {
  progress: number; // 0 to 100
}
