import { cartLogic, CartItem } from '../lib/delivery/cart-logic';
import { DeliveryProduct } from '../lib/delivery/types';

// Mock Product
const mockProduct: DeliveryProduct = {
    id: '1',
    name: 'Burger',
    description: 'Tasty',
    price: 10,
    category_id: 'cat1',
    image_url: '',
    is_active: true,
    is_featured: false,
    stock: 10,
    unit: 'un',
    created_at: '',
    updated_at: ''
};

const mockProduct2: DeliveryProduct = {
    id: '2',
    name: 'Fries',
    description: 'Crispy',
    price: 5,
    category_id: 'cat1',
    image_url: '',
    is_active: true,
    is_featured: false,
    stock: 10,
    unit: 'un',
    created_at: '',
    updated_at: ''
};

function runTests() {
    console.log('🧪 Starting Cart Logic Tests...');
    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, message: string) {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            failed++;
        }
    }

    // Test 1: Add Item
    let items: CartItem[] = [];
    items = cartLogic.addItem(items, mockProduct);
    assert(items.length === 1 && items[0].quantity === 1, 'Should add item with quantity 1');

    // Test 2: Add Same Item (Increment)
    items = cartLogic.addItem(items, mockProduct);
    assert(items.length === 1 && items[0].quantity === 2, 'Should increment quantity for existing item');

    // Test 3: Add Different Item
    items = cartLogic.addItem(items, mockProduct2);
    assert(items.length === 2, 'Should add different item');

    // Test 4: Calculate Total
    const total = cartLogic.calculateTotal(items);
    // (10 * 2) + (5 * 1) = 25
    assert(total === 25, `Total should be 25, got ${total}`);

    // Test 5: Update Quantity
    items = cartLogic.updateQuantity(items, '1', 5);
    assert(items[0].quantity === 5, 'Should update quantity to 5');

    // Test 6: Remove Item via Update Quantity 0
    items = cartLogic.updateQuantity(items, '2', 0);
    assert(items.length === 1 && items[0].id === '1', 'Should remove item when quantity is 0');

    // Test 7: Remove Item Explicitly
    items = cartLogic.removeItem(items, '1');
    assert(items.length === 0, 'Should remove item explicitly');

    console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
}

runTests();
