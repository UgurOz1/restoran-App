/* Tipler: Menü ve sepet için temel veri yapıları */
export type MenuItem = {
    id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    image?: string;
  };
  
  export type CartItem = {
    product: MenuItem;
    quantity: number;
  };
  