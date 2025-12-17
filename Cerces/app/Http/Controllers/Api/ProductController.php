<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Public: list products
    public function index()
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    // Admin: create product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string',
            'rating' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $product = Product::create($request->only([
            'title', 'price', 'description', 'category_id', 'image', 'rating', 'category'
        ]));

        return response()->json($product, 201);
    }

    // Admin: update product
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'nullable|string',
            'rating' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $product->update($request->only([
            'title', 'price', 'description', 'category_id', 'image', 'rating', 'category'
        ]));

        return response()->json($product);
    }

    // Admin: delete product
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}

