# NASA Dashboard

A beautiful dashboard displaying data from NASA's open APIs including Astronomy Picture of the Day, NASA Image Gallery, and Near Earth Objects.

## Features
- 🌟 Astronomy Picture of the Day
- 🖼️ Searchable NASA Image Gallery
- 🌍 Near Earth Objects tracking
- 🎨 Modern, space-themed UI

## Technologies Used
- React
- Tailwind CSS v4
- Lucide React (icons)
- NASA Open APIs

## Setup Instructions

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/nasa-dashboard.git
   cd nasa-dashboard
```

2. **Install dependencies**
```bash
   npm install
```

3. **Get a NASA API Key**
   - Visit https://api.nasa.gov
   - Sign up for a free API key (instant)

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
```bash
   cp .env.example .env
```
   - Open `.env` and add your NASA API key:
```
   REACT_APP_NASA_API_KEY=your_actual_api_key_here
```

5. **Run the project**
```bash
   npm start
```

6. **Open your browser**
   - Navigate to `http://localhost:3000`

## Note
The project will work with the DEMO_KEY but has rate limits. For best experience, use your own API key.

## License
MIT License - feel free to use this project for learning and personal projects!
```

### 5. **Add a LICENSE file**

Choose a license at https://choosealicense.com/. For open source projects, MIT is popular:
```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy...