# Environment Configuration

This project uses Vite's built-in environment handling with the `VITE_API_URL` environment variable.

## Environment Variables

### VITE_API_URL
- **Development**: `http://localhost:3000/api` (fallback)
- **Production**: `https://api.mysite.com/api` (fallback)

## Deployment Configuration

### Vercel
```bash
# In Vercel dashboard or vercel.json
VITE_API_URL=https://api.mysite.com/api
```

### Netlify
```bash
# In netlify.toml or Netlify dashboard
VITE_API_URL=https://api.mysite.com/api
```

### Railway
```bash
# In Railway dashboard
VITE_API_URL=https://api.mysite.com/api
```

### Other Platforms
Set the environment variable `VITE_API_URL` to your production API URL.

## Local Development

The app automatically uses `http://localhost:3000/api` for development.

## Configuration Logic

The API configuration follows this priority:
1. `VITE_API_URL` environment variable (highest priority)
2. Production fallback: `https://api.mysite.com/api`
3. Development fallback: `http://localhost:3000/api`

## Debugging

You can check the current API configuration by calling:
```javascript
import { getCurrentApiConfig } from './config/api';
console.log(getCurrentApiConfig());
```