import {
  AdminProducts,
  AdminProductsWithPagination,
  AllMiniProducts,
  FilterParams,
  MiniProduct,
  Product,
} from "@/types/product.type";
import { privateAxios } from "./axios";
import { buildQueryString } from "@/utils/queryBuilder";
import { ProductType } from "@/utils/constants";

export async function getProducts(
  page = 1
): Promise<AdminProductsWithPagination | null> {
  try {
    const { data } = await privateAxios.get<AdminProductsWithPagination>(
      `/products?page=${page}`
    );
    return data;
  } catch (error: any) {
    console.log(
      "Error getting products:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data } = await privateAxios.get<Product>(`/products/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error getting product by id ${id}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getProductsByGameId(
  gameId: string,
  type: ProductType,
  page: number
): Promise<AllMiniProducts | null> {
  try {
    const { data } = await privateAxios.get<AllMiniProducts>(
      `/products/type/${type}/game/${gameId}?page=${page}&limit=20`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting products by game id ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getFilteredProductsByGameId(
  params: FilterParams
): Promise<{
  products: MiniProduct[];
  totalPages: number;
  currentPage: number;
} | null> {
  try {
    const queryParams = buildQueryString({
      platforms: params.platforms,
      servers: params.servers,
      regions: params.regions,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    });

    const fetchingUrl = `/products/type/${params.type}/game/${params.gameId}${
      queryParams ? "?" + queryParams : ""
    }`;
    const { data } = await privateAxios.get<{
      products: MiniProduct[];
      totalPages: number;
      currentPage: number;
    }>(fetchingUrl);
    return data;
  } catch (error: any) {
    console.log(
      `Error filtering products by game id ${params.gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getMyProductsByUserId(
  userId: string
): Promise<Product[] | null> {
  try {
    const { data } = await privateAxios.get<Product[]>(
      `/users/${userId}/products`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting my product for user with id ${userId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function createProduct(newProduct: any): Promise<Product | null> {
  try {
    const { data } = await privateAxios.post<Product>("/products", newProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error creating product ${JSON.stringify(newProduct)}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function updateProduct(
  updatedProduct: Partial<Product>,
  id: string
): Promise<Product | null> {
  try {
    const { data } = await privateAxios.put<Product>(
      `/products/${id}`,
      updatedProduct
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error updating product with id ${id}, ${JSON.stringify(
        updatedProduct
      )}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { data } = await privateAxios.delete(`/products/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting product with id ${id}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function deleteProductImage(
  productId: string,
  imageIndex: number
) {
  try {
    const data = await privateAxios.delete(
      `/products/one/${productId}/images/${imageIndex}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting image ${imageIndex} for product with id ${productId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function updateProductStatus(
  id: string,
  newStatus: boolean
): Promise<Product | null> {
  try {
    const { data } = await privateAxios.put<Product>(`/products/${id}/status`, {
      isActive: newStatus,
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error updating product with id ${id}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function searchProductsByName(
  name: string
): Promise<AdminProducts[] | null> {
  try {
    const { data } = await privateAxios.get<AdminProducts[]>(
      `/products/admin/search?name=${name}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting products with name ${name}:`,
      error.response?.data || error.message
    );
    return null;
  }
}
