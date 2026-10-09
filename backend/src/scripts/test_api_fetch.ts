// backend/src/scripts/test_api_fetch.ts
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const jwtSecret = env.JWT_SECRET;
const apiUrl = 'http://localhost:5000/api/v1';

async function run() {
  const payload = {
    _id: '6a104058418f82b4a570103b',
    email: 'admin@example.com',
    role: 'restaurant-admin',
    restaurantId: '6a104055418f82b4a570101f',
    panel: 'admin'
  };
  
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  try {
    const res = await axios.get(`${apiUrl}/admin/tables`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Response Success:', res.status);
    console.log('Tables count:', res.data?.data?.tables?.length);
  } catch (error: any) {
    if (error.response) {
      console.error('Response Failed:', error.response.status, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Request Failed:', error.message);
    }
  }
}

run();
