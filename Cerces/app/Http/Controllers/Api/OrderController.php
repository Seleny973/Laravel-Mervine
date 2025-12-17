<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['user', 'items.product'])->get());
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.product'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'status' => 'sometimes|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'sometimes|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $order = Order::create([
            'user_id' => $request->user_id,
            'status' => $request->status ?? 'pending',
            'total' => 0,
        ]);

        $total = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            $price = $item['price'] ?? $product->price ?? 0;
            $total += $price * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $price,
            ]);
        }

        $order->update(['total' => $total]);

        return response()->json($order->load('items.product'), 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $order->update($request->only(['status']));
        return response()->json($order->fresh('items.product'));
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}

