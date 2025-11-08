import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";
import axiosInstance from "@/lib/axiosInstance";

interface ProductsState {
  list: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasMore: boolean;
  isSearch: boolean;
  isFiltered: boolean;
}

const initialState: ProductsState = {
  list: [],
  status: "idle",
  error: null,
  hasMore: true,
  isSearch: false,
  isFiltered: false,
};

interface FetchProductsArgs {
  skip?: number;
  query?: string;
  category?: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const fetchProducts = createAsyncThunk<ApiResponse, FetchProductsArgs>(
  "products/fetch",
  async ({ skip = 0, query, category }, { rejectWithValue }) => {
    try {
      let url: string;

      if (query) {
        url = `/products/search?q=${query}`;
      } else if (category) {
        url = `/products/category/${category}?limit=10&skip=${skip}`;
      } else {
        url = `/products?limit=10&skip=${skip}`;
      }

      const { data } = await axiosInstance.get<ApiResponse>(url);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const deleteProduct = createAsyncThunk<number, number>(
  "products/delete",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product>(
  "products/update",
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch<Product>(
        `/products/${product.id}`,
        product
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: () => initialState,
    updateProductLocal: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
        if (action.meta.arg.skip === 0) {
          state.list = [];
          state.isSearch = !!action.meta.arg.query;
          state.isFiltered = !!action.meta.arg.category;
        }
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.status = "succeeded";
          const existingIds = new Set(state.list.map((p) => p.id));
          const newProducts = action.payload.products.filter(
            (p) => !existingIds.has(p.id)
          );
          state.list = [...state.list, ...newProducts];
          state.hasMore = state.list.length < action.payload.total;
          if (state.isSearch || state.isFiltered) {
            state.hasMore = state.list.length < action.payload.total;
          }
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetProducts, updateProductLocal } = productsSlice.actions;
export default productsSlice.reducer;
