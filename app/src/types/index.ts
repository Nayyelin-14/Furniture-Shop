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

export type Images = {
  id: number;
  path: string;
};
export type Tag = {
  name: string;
};
export type ProductsType = {
  id: number;
  name: string;
  description: string;
  images: Images[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
};
export type PostsType = {
  id: string;
  author: {
    fullName: string;
  };
  title: string;
  content: string;
  modifiedImage: string;
  body: string;
  modifiedUpdatedAt: string;
  tags: Tag[];
};

export type CategoryType = {
  id: string;
  name: string;
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
