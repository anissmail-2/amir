import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import productService from '../services/productService';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Button,
  InputAdornment,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Eco as EcoIcon,
} from '@mui/icons-material';

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Herbs',
  'Flowers',
  'Seeds',
  'Equipment',
  'Other',
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    is_organic: '',
  });

  useEffect(() => {
    loadProducts();
  }, [page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.is_organic !== '' && { is_organic: filters.is_organic }),
      };

      const data = await productService.getAllProducts(params);
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Fresh produce directly from local farmers
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Organic"
              value={filters.is_organic}
              onChange={(e) => handleFilterChange('is_organic', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Organic Only</MenuItem>
              <MenuItem value="false">Conventional</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Products Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="40vh"
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {product.product_name}
                        </Typography>
                        {product.is_organic && (
                          <Chip
                            icon={<EcoIcon />}
                            label="Organic"
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.category}
                      </Typography>
                      {product.description && (
                        <Typography variant="body2" mt={1}>
                          {product.description.substring(0, 100)}
                          {product.description.length > 100 && '...'}
                        </Typography>
                      )}
                      <Box mt={2}>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          ${product.price}/{product.unit}
                        </Typography>
                      </Box>
                      {product.seller && (
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Sold by: {product.seller.first_name || 'Seller'} {product.seller.last_name || ''}
                        </Typography>
                      )}
                      {product.quantity_available !== undefined && (
                        <Typography variant="caption" color={product.quantity_available > 0 ? 'success.main' : 'error.main'}>
                          {product.quantity_available > 0
                            ? `${product.quantity_available} ${product.unit} available`
                            : 'Out of stock'}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Marketplace;
