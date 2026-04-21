// vite.config.ts
import { defineConfig } from "file:///Users/dicksonchow/Documents/GitHub/dickson-cap-fe/node_modules/vite/dist/node/index.js";
import react from "file:///Users/dicksonchow/Documents/GitHub/dickson-cap-fe/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tagger from "file:///Users/dicksonchow/Documents/GitHub/dickson-cap-fe/node_modules/@dhiwise/component-tagger/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    outDir: "build"
  },
  plugins: [react(), tagger()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@assets": "/src/assets",
      "@constants": "/src/constants",
      "@styles": "/src/styles"
    }
  },
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGlja3NvbmNob3cvRG9jdW1lbnRzL0dpdEh1Yi9kaWNrc29uLWNhcC1mZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RpY2tzb25jaG93L0RvY3VtZW50cy9HaXRIdWIvZGlja3Nvbi1jYXAtZmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RpY2tzb25jaG93L0RvY3VtZW50cy9HaXRIdWIvZGlja3Nvbi1jYXAtZmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFnZ2VyIGZyb20gXCJAZGhpd2lzZS9jb21wb25lbnQtdGFnZ2VyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIG91dERpcjogXCJidWlsZFwiLFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSx0YWdnZXIoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiAnL3NyYycsXG4gICAgICAnQGNvbXBvbmVudHMnOiAnL3NyYy9jb21wb25lbnRzJyxcbiAgICAgICdAcGFnZXMnOiAnL3NyYy9wYWdlcycsXG4gICAgICAnQGFzc2V0cyc6ICcvc3JjL2Fzc2V0cycsXG4gICAgICAnQGNvbnN0YW50cyc6ICcvc3JjL2NvbnN0YW50cycsXG4gICAgICAnQHN0eWxlcyc6ICcvc3JjL3N0eWxlcycsXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogXCI0MDI4XCIsXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBhbGxvd2VkSG9zdHM6IFsnLmFtYXpvbmF3cy5jb20nLCAnLmJ1aWx0d2l0aHJvY2tldC5uZXcnXVxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxvQkFBb0I7QUFDclcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRSxPQUFPLENBQUM7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxlQUFlO0FBQUEsTUFDZixVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxjQUFjO0FBQUEsTUFDZCxXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGNBQWMsQ0FBQyxrQkFBa0Isc0JBQXNCO0FBQUEsRUFDekQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
