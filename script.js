// Configuration
const API_BASE_URL = 'https://crud-api-4-cncd.onrender.com/api';

// State Management
let state = {
    currentSection: 'dashboard',
    products: [],
    suppliers: [],
    orders: [],
    editMode: {
        product: false,
        supplier: false,
        order: false
    },
    theme: localStorage.getItem('theme') || 'light',
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    currentDeleteAction: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StockSync Pro Initializing...');
    
    // Initialize state
    initializeState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadInitialData();
    
    // Check API connection
    checkApiStatus();
});

// Initialize State
function initializeState() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Apply sidebar state
    if (state.sidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
        updateSidebarToggleIcon();
    }
    
    // Set API URL display
    document.getElementById('api-url-display').textContent = 'Backend API';
    
    // Update navigation badges (will be updated after data loads)
    updateNavigationBadges();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                navigateToSection(section);
            }
        });
    });
    
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
    
    // Sidebar overlay (mobile)
    document.getElementById('sidebar-overlay').addEventListener('click', closeMobileMenu);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Quick action buttons
    document.querySelector('.quick-product-btn')?.addEventListener('click', () => {
        navigateToSection('products');
        setTimeout(() => document.getElementById('show-product-form').click(), 100);
    });
    
    document.querySelector('.quick-supplier-btn')?.addEventListener('click', () => {
        navigateToSection('suppliers');
        setTimeout(() => document.getElementById('show-supplier-form').click(), 100);
    });
    
    document.querySelector('.quick-order-btn')?.addEventListener('click', () => {
        navigateToSection('orders');
        setTimeout(() => document.getElementById('show-order-form').click(), 100);
    });
    
    // Quick add button
    document.getElementById('quick-add')?.addEventListener('click', () => {
        showToast('Quick add feature coming soon!', 'info');
    });
    
    // Dashboard refresh
    document.getElementById('refresh-dashboard')?.addEventListener('click', refreshDashboard);
    
    // Product form
    document.getElementById('show-product-form')?.addEventListener('click', showProductForm);
    document.getElementById('cancel-product-form')?.addEventListener('click', hideProductForm);
    document.getElementById('cancel-product-form-bottom')?.addEventListener('click', hideProductForm);
    document.getElementById('product-form')?.addEventListener('submit', handleProductSubmit);
    
    // Supplier form
    document.getElementById('show-supplier-form')?.addEventListener('click', showSupplierForm);
    document.getElementById('cancel-supplier-form')?.addEventListener('click', hideSupplierForm);
    document.getElementById('cancel-supplier-form-bottom')?.addEventListener('click', hideSupplierForm);
    document.getElementById('supplier-form')?.addEventListener('submit', handleSupplierSubmit);
    
    // Order form
    document.getElementById('show-order-form')?.addEventListener('click', showOrderForm);
    document.getElementById('cancel-order-form')?.addEventListener('click', hideOrderForm);
    document.getElementById('cancel-order-form-bottom')?.addEventListener('click', hideOrderForm);
    document.getElementById('order-form')?.addEventListener('submit', handleOrderSubmit);
    document.getElementById('add-order-item')?.addEventListener('click', addOrderItem);
    
    // Search functionality
    document.getElementById('product-search')?.addEventListener('input', filterProducts);
    document.getElementById('supplier-search')?.addEventListener('input', filterSuppliers);
    document.getElementById('order-search')?.addEventListener('input', filterOrders);
    document.getElementById('order-status-filter')?.addEventListener('change', filterOrders);
    
    // Modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', hideModal);
    });
    document.getElementById('modal-cancel')?.addEventListener('click', hideModal);
    document.getElementById('modal-confirm')?.addEventListener('click', executeDelete);
    
    // Global search
    document.getElementById('global-search')?.addEventListener('input', performGlobalSearch);
    
    // Close mobile menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
}

// Navigation
function navigateToSection(sectionId) {
    console.log(`Navigating to: ${sectionId}`);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;
        
        // Update breadcrumb
        updateBreadcrumb(sectionId);
        
        // Load section data
        loadSectionData(sectionId);
        
        // Close mobile menu if open
        if (window.innerWidth < 992) {
            closeMobileMenu();
        }
    }
}

function updateBreadcrumb(sectionId) {
    const sectionNames = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'suppliers': 'Suppliers',
        'orders': 'Orders'
    };
    
    document.getElementById('current-page').textContent = sectionNames[sectionId] || 'Dashboard';
    document.getElementById('current-subpage').textContent = 'Overview';
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    state.sidebarCollapsed = !state.sidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
    
    updateSidebarToggleIcon();
}

function updateSidebarToggleIcon() {
    const icon = document.getElementById('sidebar-toggle').querySelector('i');
    if (!icon) return;
    
    if (state.sidebarCollapsed) {
        icon.classList.remove('fa-angle-double-left');
        icon.classList.add('fa-angle-double-right');
    } else {
        icon.classList.remove('fa-angle-double-right');
        icon.classList.add('fa-angle-double-left');
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isActive = sidebar.classList.toggle('active');
    
    if (overlay) {
        overlay.style.display = isActive ? 'block' : 'none';
    }
    
    document.getElementById('mobile-menu-toggle').setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when sidebar is open
    if (isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('active');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    document.getElementById('mobile-menu-toggle').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Theme Functions
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    
    // Update theme toggle icon
    const icon = document.getElementById('theme-toggle').querySelector('i');
    if (!icon) return;
    
    if (state.theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Dashboard Functions
async function refreshDashboard() {
    const btn = document.getElementById('refresh-dashboard');
    const originalHtml = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Refreshing...';
    btn.disabled = true;
    
    try {
        await loadDashboardData();
        showToast('Dashboard refreshed successfully', 'success');
    } catch (error) {
        showToast('Error refreshing dashboard', 'error');
    } finally {
        // Restore button state
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
}

async function loadDashboardData() {
    try {
        // Show loading skeletons
        document.querySelectorAll('.stat-value').forEach(el => {
            el.classList.add('skeleton');
        });
        
        // Fetch all data
        const [productsRes, suppliersRes, ordersRes] = await Promise.allSettled([
            fetch(`${API_BASE_URL}/products`),
            fetch(`${API_BASE_URL}/suppliers`),
            fetch(`${API_BASE_URL}/orders`)
        ]);
        
        // Update counts
        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
            const products = await productsRes.value.json();
            document.getElementById('total-products').textContent = products.length;
            
            // Calculate low stock
            const lowStock = products.filter(p => p.stock < 10).length;
            document.getElementById('low-stock').textContent = lowStock;
        } else {
            document.getElementById('total-products').textContent = '0';
            document.getElementById('low-stock').textContent = '0';
        }
        
        if (suppliersRes.status === 'fulfilled' && suppliersRes.value.ok) {
            const suppliers = await suppliersRes.value.json();
            document.getElementById('total-suppliers').textContent = suppliers.length;
        } else {
            document.getElementById('total-suppliers').textContent = '0';
        }
        
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
            const orders = await ordersRes.value.json();
            document.getElementById('total-orders').textContent = orders.length;
        } else {
            document.getElementById('total-orders').textContent = '0';
        }
        
        // Update navigation badges
        updateNavigationBadges();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    } finally {
        // Remove skeletons
        document.querySelectorAll('.stat-value').forEach(el => {
            el.classList.remove('skeleton');
        });
    }
}

function updateNavigationBadges() {
    // Update badge counts based on actual data
    const badges = {
        'dashboard-badge': '',
        'products-badge': state.products.length > 0 ? state.products.length.toString() : '',
        'suppliers-badge': state.suppliers.length > 0 ? state.suppliers.length.toString() : '',
        'orders-badge': state.orders.length > 0 ? state.orders.length.toString() : ''
    };
    
    Object.entries(badges).forEach(([id, value]) => {
        const badge = document.getElementById(id);
        if (badge) {
            badge.textContent = value;
            badge.style.display = value ? 'inline-block' : 'none';
        }
    });
}

async function checkApiStatus() {
    const apiStatus = document.getElementById('api-status');
    const apiStatusFooter = document.getElementById('api-status-footer');
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
            apiStatus.textContent = 'Connected';
            apiStatus.style.color = 'var(--success-color)';
            apiStatusFooter.textContent = 'Connected';
            apiStatusFooter.style.color = 'var(--success-color)';
        } else {
            throw new Error('API not responding properly');
        }
    } catch (error) {
        apiStatus.textContent = 'Disconnected';
        apiStatus.style.color = 'var(--danger-color)';
        apiStatusFooter.textContent = 'Disconnected';
        apiStatusFooter.style.color = 'var(--danger-color)';
        showToast('Cannot connect to API. Check your connection.', 'error');
    }
}

// Initial Data Loading
async function loadInitialData() {
    await loadDashboardData();
    loadSectionData(state.currentSection);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'products':
            loadProducts();
            break;
        case 'suppliers':
            loadSuppliers();
            break;
        case 'orders':
            loadOrders();
            break;
        default:
            break;
    }
}

// Product Functions
async function loadProducts() {
    const tableBody = document.getElementById('products-table-body');
    const loadingEl = document.getElementById('products-loading');
    const emptyEl = document.getElementById('products-empty');
    const countEl = document.getElementById('product-count');
    
    if (!tableBody || !loadingEl || !emptyEl || !countEl) return;
    
    // Show loading
    loadingEl.style.display = 'block';
    emptyEl.style.display = 'none';
    tableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        state.products = await response.json();
        
        // Update count
        countEl.textContent = state.products.length;
        
        // Hide loading
        loadingEl.style.display = 'none';
        
        if (state.products.length === 0) {
            emptyEl.style.display = 'block';
            return;
        }
        
        // Render products
        state.products.forEach((product, index) => {
            const row = document.createElement('tr');
            
            // Determine stock status
            let statusClass = 'status-completed';
            let statusText = 'In Stock';
            
            if (product.stock === 0) {
                statusClass = 'status-cancelled';
                statusText = 'Out of Stock';
            } else if (product.stock < 10) {
                statusClass = 'status-pending';
                statusText = 'Low Stock';
            }
            
            row.innerHTML = `
                <td>${product.sku || 'N/A'}</td>
                <td>${product.name || 'N/A'}</td>
                <td>${product.category || 'N/A'}</td>
                <td>$${product.price ? product.price.toFixed(2) : '0.00'}</td>
                <td>${product.stock || 0}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm edit-product" 
                                data-id="${product._id}" 
                                title="Edit ${product.name}"
                                aria-label="Edit product ${product.name}">
                            <i class="fas fa-edit" aria-hidden="true"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-product" 
                                data-id="${product._id}"
                                title="Delete ${product.name}"
                                aria-label="Delete product ${product.name}">
                            <i class="fas fa-trash" aria-hidden="true"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                confirmDelete('product', productId);
            });
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        loadingEl.style.display = 'none';
        emptyEl.innerHTML = `
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h4>Error loading products</h4>
            <p>${error.message}</p>
            <p>Make sure your backend server is running at: ${API_BASE_URL}</p>
        `;
        emptyEl.style.display = 'block';
        showToast('Error loading products: ' + error.message, 'error');
    }
}

function showProductForm() {
    const formContainer = document.getElementById('product-form-container');
    const formTitle = document.getElementById('product-form-title');
    
    if (!formContainer || !formTitle) return;
    
    // Reset form
    const form = document.getElementById('product-form');
    if (form) form.reset();
    document.getElementById('product-id').value = '';
    state.editMode.product = false;
    
    // Clear errors
    clearAllFormErrors('product-form');
    
    // Update title
    formTitle.textContent = 'Add New Product';
    
    // Show form
    formContainer.style.display = 'block';
    
    // Scroll to form
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideProductForm() {
    const formContainer = document.getElementById('product-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    clearAllFormErrors('product-form');
}

function editProduct(productId) {
    const product = state.products.find(p => p._id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    // Fill form with product data
    document.getElementById('product-id').value = product._id;
    document.getElementById('sku').value = product.sku || '';
    document.getElementById('name').value = product.name || '';
    document.getElementById('price').value = product.price || '';
    document.getElementById('stock').value = product.stock || '';
    document.getElementById('category').value = product.category || '';
    
    // Update form title
    document.getElementById('product-form-title').textContent = 'Edit Product';
    state.editMode.product = true;
    
    // Show form
    document.getElementById('product-form-container').style.display = 'block';
    
    // Scroll to form
    document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllFormErrors('product-form');
    
    // Validate form
    if (!validateProductForm()) return;
    
    // Get form data
    const productData = {
        sku: document.getElementById('sku').value.trim(),
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value || undefined
    };
    
    const productId = document.getElementById('product-id').value;
    const isEdit = state.editMode.product && productId;
    
    try {
        let response;
        let url = `${API_BASE_URL}/products`;
        let method = 'POST';
        
        if (isEdit) {
            url = `${API_BASE_URL}/products/${productId}`;
            method = 'PUT';
        }
        
        response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to save product';
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        // Show success message
        showToast(`Product ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        
        // Hide form
        hideProductForm();
        
        // Reload products
        await loadProducts();
        
        // Update dashboard
        await loadDashboardData();
        
    } catch (error) {
        console.error('Error saving product:', error);
        showToast(error.message || 'Error saving product', 'error');
    }
}

function validateProductForm() {
    let isValid = true;
    
    // Validate SKU
    const sku = document.getElementById('sku').value.trim();
    if (!sku) {
        document.getElementById('sku-error').textContent = 'SKU is required';
        isValid = false;
    }
    
    // Validate name
    const name = document.getElementById('name').value.trim();
    if (!name) {
        document.getElementById('name-error').textContent = 'Product name is required';
        isValid = false;
    }
    
    // Validate price
    const price = parseFloat(document.getElementById('price').value);
    if (isNaN(price) || price < 0) {
        document.getElementById('price-error').textContent = 'Valid price is required';
        isValid = false;
    }
    
    // Validate stock
    const stock = parseInt(document.getElementById('stock').value);
    if (isNaN(stock) || stock < 0) {
        document.getElementById('stock-error').textContent = 'Valid stock quantity is required';
        isValid = false;
    }
    
    return isValid;
}

// Supplier Functions
async function loadSuppliers() {
    const tableBody = document.getElementById('suppliers-table-body');
    const loadingEl = document.getElementById('suppliers-loading');
    const emptyEl = document.getElementById('suppliers-empty');
    const countEl = document.getElementById('supplier-count');
    
    if (!tableBody || !loadingEl || !emptyEl || !countEl) return;
    
    // Show loading
    loadingEl.style.display = 'block';
    emptyEl.style.display = 'none';
    tableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        state.suppliers = await response.json();
        
        // Update count
        countEl.textContent = state.suppliers.length;
        
        // Hide loading
        loadingEl.style.display = 'none';
        
        if (state.suppliers.length === 0) {
            emptyEl.style.display = 'block';
            return;
        }
        
        // Render suppliers
        state.suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            const createdDate = supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A';
            
            row.innerHTML = `
                <td>${supplier.name || 'N/A'}</td>
                <td>${supplier.contact || 'N/A'}</td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm edit-supplier" data-id="${supplier._id}" title="Edit ${supplier.name}" aria-label="Edit supplier ${supplier.name}">
                            <i class="fas fa-edit" aria-hidden="true"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-supplier" data-id="${supplier._id}" title="Delete ${supplier.name}" aria-label="Delete supplier ${supplier.name}">
                            <i class="fas fa-trash" aria-hidden="true"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-supplier').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                editSupplier(supplierId);
            });
        });
        
        document.querySelectorAll('.delete-supplier').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                confirmDelete('supplier', supplierId);
            });
        });
        
    } catch (error) {
        console.error('Error loading suppliers:', error);
        loadingEl.style.display = 'none';
        emptyEl.innerHTML = `
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h4>Error loading suppliers</h4>
            <p>${error.message}</p>
        `;
        emptyEl.style.display = 'block';
        showToast('Error loading suppliers: ' + error.message, 'error');
    }
}

function showSupplierForm() {
    const formContainer = document.getElementById('supplier-form-container');
    const formTitle = document.getElementById('supplier-form-title');
    
    if (!formContainer || !formTitle) return;
    
    // Reset form
    const form = document.getElementById('supplier-form');
    if (form) form.reset();
    document.getElementById('supplier-id').value = '';
    state.editMode.supplier = false;
    
    // Clear errors
    clearAllFormErrors('supplier-form');
    
    // Update title
    formTitle.textContent = 'Add New Supplier';
    
    // Show form
    formContainer.style.display = 'block';
    
    // Scroll to form
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideSupplierForm() {
    const formContainer = document.getElementById('supplier-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    clearAllFormErrors('supplier-form');
}

function editSupplier(supplierId) {
    const supplier = state.suppliers.find(s => s._id === supplierId);
    if (!supplier) {
        showToast('Supplier not found', 'error');
        return;
    }
    
    // Fill form with supplier data
    document.getElementById('supplier-id').value = supplier._id;
    document.getElementById('supplier-name').value = supplier.name || '';
    document.getElementById('contact').value = supplier.contact || '';
    
    // Update form title
    document.getElementById('supplier-form-title').textContent = 'Edit Supplier';
    state.editMode.supplier = true;
    
    // Show form
    document.getElementById('supplier-form-container').style.display = 'block';
    
    // Scroll to form
    document.getElementById('supplier-form-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleSupplierSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllFormErrors('supplier-form');
    
    // Validate form
    if (!validateSupplierForm()) return;
    
    // Get form data
    const supplierData = {
        name: document.getElementById('supplier-name').value.trim(),
        contact: document.getElementById('contact').value.trim()
    };
    
    const supplierId = document.getElementById('supplier-id').value;
    const isEdit = state.editMode.supplier && supplierId;
    
    try {
        let response;
        let url = `${API_BASE_URL}/suppliers`;
        let method = 'POST';
        
        if (isEdit) {
            url = `${API_BASE_URL}/suppliers/${supplierId}`;
            method = 'PUT';
        }
        
        response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(supplierData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to save supplier';
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        // Show success message
        showToast(`Supplier ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        
        // Hide form
        hideSupplierForm();
        
        // Reload suppliers
        await loadSuppliers();
        
        // Update dashboard
        await loadDashboardData();
        
    } catch (error) {
        console.error('Error saving supplier:', error);
        showToast(error.message || 'Error saving supplier', 'error');
    }
}

function validateSupplierForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('supplier-name').value.trim();
    if (!name) {
        document.getElementById('supplier-name-error').textContent = 'Supplier name is required';
        isValid = false;
    }
    
    // Validate contact
    const contact = document.getElementById('contact').value.trim();
    if (!contact) {
        document.getElementById('contact-error').textContent = 'Contact information is required';
        isValid = false;
    }
    
    return isValid;
}

// Order Functions
async function loadOrders() {
    const tableBody = document.getElementById('orders-table-body');
    const loadingEl = document.getElementById('orders-loading');
    const emptyEl = document.getElementById('orders-empty');
    const countEl = document.getElementById('order-count');
    
    if (!tableBody || !loadingEl || !emptyEl || !countEl) return;
    
    // Show loading
    loadingEl.style.display = 'block';
    emptyEl.style.display = 'none';
    tableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        state.orders = await response.json();
        
        // Update count
        countEl.textContent = state.orders.length;
        
        // Hide loading
        loadingEl.style.display = 'none';
        
        if (state.orders.length === 0) {
            emptyEl.style.display = 'block';
            return;
        }
        
        // Render orders
        for (const order of state.orders) {
            const row = document.createElement('tr');
            const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
            
            // Calculate total
            let total = 0;
            let itemsText = '0 items';
            
            if (order.items && order.items.length > 0) {
                total = order.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
                itemsText = `${order.items.length} item(s)`;
            }
            
            // Get supplier name
            let supplierName = 'N/A';
            if (order.supplierId && typeof order.supplierId === 'object') {
                supplierName = order.supplierId.name;
            } else if (order.supplierId) {
                const supplier = state.suppliers.find(s => s._id === order.supplierId);
                if (supplier) supplierName = supplier.name;
            }
            
            // Status badge
            const statusClass = `status-${order.status || 'pending'}`;
            const statusText = (order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1);
            
            row.innerHTML = `
                <td>${order._id ? order._id.substring(0, 8) + '...' : 'N/A'}</td>
                <td>${supplierName}</td>
                <td>${itemsText}</td>
                <td>$${total.toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm view-order" data-id="${order._id}" title="View order details" aria-label="View order">
                            <i class="fas fa-eye" aria-hidden="true"></i> View
                        </button>
                        <button class="btn btn-danger btn-sm delete-order" data-id="${order._id}" title="Delete order" aria-label="Delete order">
                            <i class="fas fa-trash" aria-hidden="true"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        }
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrder(orderId);
            });
        });
        
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                confirmDelete('order', orderId);
            });
        });
        
    } catch (error) {
        console.error('Error loading orders:', error);
        loadingEl.style.display = 'none';
        emptyEl.innerHTML = `
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h4>Error loading orders</h4>
            <p>${error.message}</p>
        `;
        emptyEl.style.display = 'block';
        showToast('Error loading orders: ' + error.message, 'error');
    }
}

function showOrderForm() {
    const formContainer = document.getElementById('order-form-container');
    const formTitle = document.getElementById('order-form-title');
    
    if (!formContainer || !formTitle) return;
    
    // Reset form
    const form = document.getElementById('order-form');
    if (form) form.reset();
    document.getElementById('order-id').value = '';
    state.editMode.order = false;
    
    // Clear and add one item
    const itemsContainer = document.getElementById('order-items-container');
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        addOrderItem();
    }
    
    // Load products and suppliers for dropdowns
    loadProductsForOrderForm();
    loadSuppliersForOrderForm();
    
    // Clear errors
    clearAllFormErrors('order-form');
    
    // Update title
    formTitle.textContent = 'Create New Order';
    
    // Show form
    formContainer.style.display = 'block';
    
    // Scroll to form
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideOrderForm() {
    const formContainer = document.getElementById('order-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    clearAllFormErrors('order-form');
}

async function loadProductsForOrderForm() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        const productSelects = document.querySelectorAll('.order-product');
        
        productSelects.forEach(select => {
            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add product options
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = `${product.name} (${product.sku}) - $${product.price ? product.price.toFixed(2) : '0.00'}`;
                option.setAttribute('data-price', product.price || 0);
                select.appendChild(option);
            });
        });
        
        // Add event listeners to update price when product is selected
        productSelects.forEach(select => {
            select.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const priceInput = this.closest('.item-row').querySelector('.order-price');
                if (selectedOption && selectedOption.value && priceInput) {
                    priceInput.value = selectedOption.getAttribute('data-price') || '0.00';
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading products for order form:', error);
        showToast('Error loading products', 'error');
    }
}

async function loadSuppliersForOrderForm() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        
        const suppliers = await response.json();
        const supplierSelect = document.getElementById('order-supplier');
        
        if (!supplierSelect) return;
        
        // Clear existing options except the first one
        while (supplierSelect.options.length > 1) {
            supplierSelect.remove(1);
        }
        
        // Add supplier options
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier._id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading suppliers for order form:', error);
        showToast('Error loading suppliers', 'error');
    }
}

function addOrderItem() {
    const itemsContainer = document.getElementById('order-items-container');
    if (!itemsContainer) return;
    
    const itemIndex = itemsContainer.children.length;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    
    itemElement.innerHTML = `
        <div class="item-row">
            <div class="form-group">
                <label for="order-product-${itemIndex}" class="required">Product *</label>
                <select id="order-product-${itemIndex}" class="order-product" required title="Select product" aria-label="Product selection">
                    <option value="">Select a product</option>
                </select>
            </div>
            <div class="form-group">
                <label for="order-qty-${itemIndex}" class="required">Quantity *</label>
                <input type="number" id="order-qty-${itemIndex}" class="order-qty" min="1" value="1" required placeholder="Quantity" title="Quantity" aria-label="Quantity">
            </div>
            <div class="form-group">
                <label for="order-price-${itemIndex}" class="required">Price ($) *</label>
                <input type="number" id="order-price-${itemIndex}" class="order-price" step="0.01" min="0" required placeholder="0.00" title="Price" aria-label="Price per unit">
            </div>
            <button type="button" class="btn btn-danger remove-item" title="Remove item" aria-label="Remove item">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    itemsContainer.appendChild(itemElement);
    
    // Reload products for the new select
    loadProductsForOrderForm();
    
    // Add event listener to remove button
    const removeBtn = itemElement.querySelector('.remove-item');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (itemsContainer.children.length > 1) {
                this.closest('.order-item').remove();
            } else {
                showToast('At least one item is required', 'error');
            }
        });
    }
}

function viewOrder(orderId) {
    const order = state.orders.find(o => o._id === orderId);
    if (!order) {
        showToast('Order not found', 'error');
        return;
    }
    
    let message = `Order Details:\n\n`;
    message += `Order ID: ${order._id}\n`;
    message += `Status: ${order.status}\n`;
    
    if (order.items && order.items.length > 0) {
        message += `\nItems:\n`;
        order.items.forEach((item, index) => {
            message += `${index + 1}. Product ID: ${item.productId}, Qty: ${item.qty}, Price: $${item.price}\n`;
        });
        
        const total = order.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        message += `\nTotal: $${total.toFixed(2)}\n`;
    }
    
    alert(message);
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAllFormErrors('order-form');
    
    // Validate form
    if (!validateOrderForm()) return;
    
    // Get form data
    const orderData = {
        supplierId: document.getElementById('order-supplier').value,
        status: document.getElementById('order-status').value,
        items: []
    };
    
    // Get order items
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        const productSelect = item.querySelector('.order-product');
        const qtyInput = item.querySelector('.order-qty');
        const priceInput = item.querySelector('.order-price');
        
        if (productSelect && qtyInput && priceInput) {
            const productId = productSelect.value;
            const qty = parseInt(qtyInput.value);
            const price = parseFloat(priceInput.value);
            
            if (productId && qty && price) {
                orderData.items.push({
                    productId: productId,
                    qty: qty,
                    price: price
                });
            }
        }
    });
    
    const orderId = document.getElementById('order-id').value;
    const isEdit = state.editMode.order && orderId;
    
    try {
        let response;
        let url = `${API_BASE_URL}/orders`;
        let method = 'POST';
        
        if (isEdit) {
            url = `${API_BASE_URL}/orders/${orderId}`;
            method = 'PUT';
        }
        
        response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to save order';
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        // Show success message
        showToast(`Order ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        
        // Hide form
        hideOrderForm();
        
        // Reload orders
        await loadOrders();
        
        // Update dashboard
        await loadDashboardData();
        
    } catch (error) {
        console.error('Error saving order:', error);
        showToast(error.message || 'Error saving order', 'error');
    }
}

function validateOrderForm() {
    let isValid = true;
    
    // Validate supplier
    const supplier = document.getElementById('order-supplier').value;
    if (!supplier) {
        document.getElementById('order-supplier-error').textContent = 'Supplier is required';
        isValid = false;
    }
    
    // Validate items
    const orderItems = document.querySelectorAll('.order-item');
    if (orderItems.length === 0) {
        showToast('At least one item is required', 'error');
        isValid = false;
    }
    
    // Validate each item
    orderItems.forEach((item, index) => {
        const product = item.querySelector('.order-product')?.value;
        const qty = item.querySelector('.order-qty')?.value;
        const price = item.querySelector('.order-price')?.value;
        
        if (!product || !qty || !price) {
            showToast(`Item ${index + 1} is incomplete`, 'error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Search and Filter Functions
function filterProducts() {
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('#products-table-body tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    document.getElementById('product-count').textContent = visibleCount;
}

function filterSuppliers() {
    const searchTerm = document.getElementById('supplier-search')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('#suppliers-table-body tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    document.getElementById('supplier-count').textContent = visibleCount;
}

function filterOrders() {
    const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('order-status-filter')?.value || '';
    const rows = document.querySelectorAll('#orders-table-body tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusBadge = row.querySelector('.status-badge');
        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
        
        const matchesSearch = text.includes(searchTerm);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    document.getElementById('order-count').textContent = visibleCount;
}

function performGlobalSearch(e) {
    const term = e.target.value.toLowerCase();
    if (term.length < 2) return;
    
    // Search in current section
    switch(state.currentSection) {
        case 'products':
            document.getElementById('product-search').value = term;
            filterProducts();
            break;
        case 'suppliers':
            document.getElementById('supplier-search').value = term;
            filterSuppliers();
            break;
        case 'orders':
            document.getElementById('order-search').value = term;
            filterOrders();
            break;
    }
}

// DELETE FUNCTIONS
function confirmDelete(type, id) {
    const modal = document.getElementById('confirmation-modal');
    const message = document.getElementById('modal-message');
    
    if (!modal || !message) return;
    
    // Set message based on type
    let itemName = '';
    switch(type) {
        case 'product':
            const product = state.products.find(p => p._id === id);
            itemName = product ? `"${product.name}"` : 'this product';
            break;
        case 'supplier':
            const supplier = state.suppliers.find(s => s._id === id);
            itemName = supplier ? `"${supplier.name}"` : 'this supplier';
            break;
        case 'order':
            itemName = 'this order';
            break;
    }
    
    message.textContent = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
    
    // Store delete action
    state.currentDeleteAction = { type, id };
    
    // Show modal
    modal.classList.add('active');
}

function hideModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    state.currentDeleteAction = null;
}

async function executeDelete() {
    if (!state.currentDeleteAction) {
        hideModal();
        return;
    }
    
    const { type, id } = state.currentDeleteAction;
    
    try {
        let endpoint = '';
        switch(type) {
            case 'product':
                endpoint = `${API_BASE_URL}/products/${id}`;
                break;
            case 'supplier':
                endpoint = `${API_BASE_URL}/suppliers/${id}`;
                break;
            case 'order':
                endpoint = `${API_BASE_URL}/orders/${id}`;
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        // Show success message
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
        
        // Hide modal
        hideModal();
        
        // Reload data
        switch(type) {
            case 'product':
                await loadProducts();
                break;
            case 'supplier':
                await loadSuppliers();
                break;
            case 'order':
                await loadOrders();
                break;
        }
        
        // Update dashboard
        await loadDashboardData();
        
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        showToast(`Error deleting ${type}: ${error.message}`, 'error');
        hideModal();
    }
}

// UTILITY FUNCTIONS
function clearAllFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
    });
}

// Toast Notification System
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return null;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    
    // Set icon based on type
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const icon = icons[type] || 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon} toast-icon" aria-hidden="true"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close" aria-label="Close notification" title="Close notification">
            &times;
        </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Add close button event
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideToast(toast);
        });
    }
    
    // Auto-hide
    setTimeout(() => {
        hideToast(toast);
    }, duration);
    
    return toast;
}

function hideToast(toast) {
    if (!toast) return;
    
    toast.classList.remove('show');
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

console.log('✅ StockSync Pro Initialized Successfully');
