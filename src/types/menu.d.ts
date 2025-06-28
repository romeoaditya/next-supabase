interface IMenu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface IMenuCartItem extends IMenu {
  quantity: number;
}
export type {IMenu, IMenuCartItem};
