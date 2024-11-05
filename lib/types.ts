export interface Product {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
    created_at: string;
  }
  
  export interface Inquiry {
    id: number;
    customer_name: string;
    email: string;
    phone?: string;
    message: string;
    product_ids: string;
    status: 'pending' | 'reviewed' | 'contacted';
    created_at: string;
  }
  
  export interface SelectedProduct {
    product: Product;
    quantity: number;
  }
  
  export interface ProductWithQuantity {
    id: number;
    quantity: number;
  }
  
  export interface ProductWithDetails {
    product: Product;
    quantity: number;
  }