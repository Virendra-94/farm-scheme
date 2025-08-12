# Deploying Farm Scheme Frontend to Render.com

## Prerequisites
- Render.com account
- Git repository with your Angular project

## Deployment Steps

### 1. Prepare Your Repository
Make sure your repository contains:
- `package.json` with build scripts
- `angular.json` configuration
- All source files

### 2. Deploy to Render.com

#### Option A: Using Render Dashboard
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Static Site"
3. Connect your Git repository
4. Configure the deployment:
   - **Name**: `farm-scheme-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/farm-scheme/browser`
   - **Environment**: Static Site

#### Option B: Using render.yaml (Recommended)
1. The `render.yaml` file is configured in the farm-scheme directory
2. Push your code to Git repository
3. Connect the repository to Render
4. Render will automatically detect the configuration

### 3. Environment Variables (Optional)
If you need to configure different API URLs for production:
- Go to your Render service dashboard
- Navigate to "Environment" tab
- Add environment variables as needed

### 4. Custom Domain (Optional)
- In your Render service dashboard
- Go to "Settings" → "Custom Domains"
- Add your custom domain

## Important Notes

### Backend Configuration
- Your backend will remain on localhost
- Update your backend CORS settings to allow your Render domain
- The frontend will make API calls to your local backend

### CORS Configuration
Make sure your backend allows requests from your Render domain:
```java
@CrossOrigin(origins = {"https://your-app-name.onrender.com"})
```

### API URL Configuration
The frontend is configured to call `http://localhost:8089` for API requests. 
If you need to change this for production, update the `apiUrl` in your services.

## Troubleshooting

### Build Failures
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify the build command works locally

### CORS Issues
- Update your backend CORS configuration
- Check browser console for CORS errors
- Verify the API URL is correct

### Routing Issues
- The `render.yaml` includes a rewrite rule for Angular routing
- All routes will redirect to `index.html` for client-side routing

## Support
If you encounter issues:
1. Check Render build logs
2. Verify local build works: `npm run build`
3. Check browser console for errors
4. Ensure backend is running and accessible
