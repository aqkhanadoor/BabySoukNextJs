import { realtimeDb } from '../lib/firebase.js';
import { ref, onValue, update } from 'firebase/database';

console.log('🔧 Fixing TeddyBears product slug...');

const productRef = ref(realtimeDb, 'products');

onValue(productRef, async (snapshot) => {
  const products = snapshot.val();
  
  if (!products) {
    console.log('❌ No products found');
    process.exit(1);
  }
  
  // Find the TeddyBears product
  const productEntries = Object.entries(products);
  const teddyEntry = productEntries.find(([key, product]) => product.name === 'TeddyBears');
  
  if (!teddyEntry) {
    console.log('❌ TeddyBears product not found');
    process.exit(1);
  }
  
  const [productId, productData] = teddyEntry;
  
  console.log('📋 Current product data:');
  console.log('- ID:', productId);
  console.log('- Name:', productData.name);
  console.log('- Current slug:', productData.slug);
  console.log('- Category:', productData.category);
  
  // Check if slug is already correct
  if (productData.slug === 'teddybears') {
    console.log('✅ Slug is already correct!');
    process.exit(0);
  }
  
  // Update the slug
  const updates = {
    [`products/${productId}/slug`]: 'teddybears',
    [`products/${productId}/updatedAt`]: Date.now()
  };
  
  try {
    await update(ref(realtimeDb), updates);
    console.log('✅ Successfully updated TeddyBears slug to "teddybears"');
    console.log('🌐 Product will now be accessible at: http://localhost:3000/toys/teddybears');
  } catch (error) {
    console.error('❌ Error updating product:', error);
    process.exit(1);
  }
  
  process.exit(0);
}, {
  once: true
});