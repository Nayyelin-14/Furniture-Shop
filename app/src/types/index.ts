export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  card?: NavItem[];
  menu?: NavItem[];
}

export type MainNavItem = NavItemWithChildren;

export type ProductsType = {
  id: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
};
export type PostsType = {
  id: string;
  author: string;
  title: string;
  content: string;
  image: string;
  body: string;
  updated_at: string;
  tags: string[];
};

export type CategoryType = {
  id: string;
  label: string;
};

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
};

export type Cart = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: {
    id: string;
    name: string;
    url: string;
  };
  category: string;
  subcategory: string;
};
