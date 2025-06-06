import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import {
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiCoffee,
  FiMap,
  FiLogOut,
  FiSun,
  FiMoon,
  FiPlus,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import '../css/AdminDashboard.css';

// Import your JSON data files
import menuData from '../../services/api.json';
import offerData from '../../services/offer.json';
import restaurantData from '../../services/restaurants.json';


function AdminDashboard({ theme, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    image: '',
    resturantType: '',
    location: '',
    email: '',
    mobileNum: ''
  });

  const [editRestaurant, setEditRestaurant] = useState({ id: null, name: '', location: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all data from JSON files and API
  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('adminToken');
  //     // if (!token) {
  //     //   navigate('/admin-login');
  //     //   return;
  //     // }

  //     // Use the JSON data directly
  //     setMenuItems(menuData || []);
  //     setPromotions(offerData || []);
  //     setRestaurants(restaurantData || []);

  //     // Mock users data since it's not in your JSON files
  //     setUsers([
  //       {
  //         _id: '1',
  //         userName: 'Admin User',
  //         email: 'admin@fooddelivery.com',
  //         mobNum: '1234567890',
  //         address: 'Admin Address',
  //         dob: '1990-01-01',
  //         active: true
  //       }
  //     ]);

  //     // Mock orders data since it's not in your JSON files
  //     setOrders([
  //       {
  //         id: '1',
  //         customer: 'John Doe',
  //         total: 25.98,
  //         status: 'completed',
  //         createdAt: new Date().toISOString()
  //       },
  //       {
  //         id: '2',
  //         customer: 'Jane Smith',
  //         total: 12.99,
  //         status: 'pending',
  //         createdAt: new Date().toISOString()
  //       }
  //     ]);

  //   } catch (err) {
  //     console.error('Error in fetchData:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const fetchData = async () => {
    try {
      setLoading(true);

      // Use the JSON data directly
      setMenuItems(menuData || []);
      setPromotions(offerData || []);
      setRestaurants(restaurantData || []);

      // Mock users data
      setUsers([
        {
          _id: '1',
          userName: 'Admin User',
          email: 'admin@fooddelivery.com',
          mobNum: '1234567890',
          address: 'Admin Address',
          dob: '1990-01-01',
          active: true
        }
      ]);

      // Fetch real orders from API
      const ordersRes = await axios.get('http://localhost:8081/api/orders/');
      setOrders(ordersRes.data || []);

    } catch (err) {
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   const token = localStorage.getItem('adminToken');
  //   if (!token) {
  //     navigate('/admin-login');
  //   } else {
  //     fetchData();
  //   }
  // }, [navigate]);

  // Generate chart data
  const generateChartData = () => {
    // Use actual data from orders if available
    if (orders.length > 0) {
      const monthlySales = {};
      orders.forEach(order => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
        monthlySales[month] = (monthlySales[month] || 0) + order.total;
      });
      return {
        salesData: Object.entries(monthlySales).map(([name, sales]) => ({ name, sales })),
        orderStatusData: [
          { name: 'Completed', value: orders.filter(o => o.status === 'completed').length },
          { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
          { name: 'Canceled', value: orders.filter(o => o.status === 'canceled').length },
        ]
      };
    }

    // Fallback to mock data
    return {
      salesData: [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
      ],
      orderStatusData: [
        { name: 'Completed', value: 400 },
        { name: 'Pending', value: 300 },
        { name: 'Canceled', value: 200 },
      ]
    };
  };

  const { salesData, orderStatusData } = generateChartData();




  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Deactivate a user
  const deactivateUser = async (userId) => {
    try {
      // In a real app, you would call your API here
      setUsers(users.map(user =>
        user._id === userId ? { ...user, active: false } : user
      ));
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  };

  // Deactivate a restaurant
  const deactivateRestaurant = async (restaurantId) => {
    try {
      // In a real app, you would call your API here
      setRestaurants(restaurants.map(restaurant =>
        restaurant.id === restaurantId ? { ...restaurant, active: false } : restaurant
      ));
    } catch (err) {
      console.error('Error deactivating restaurant:', err);
    }
  };

  // Add a new restaurant
  // const handleAddRestaurant = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const newId = Math.max(...restaurants.map(r => parseInt(r.id))) + 1;
  //     const restaurantToAdd = {
  //       id: newId.toString(),
  //       name: newRestaurant.name,
  //       location: newRestaurant.location,
  //       active: true
  //     };
  //     setRestaurants([...restaurants, restaurantToAdd]);
  //     setNewRestaurant({ name: '', location: '' });
  //   } catch (err) {
  //     console.error('Error adding restaurant:', err);
  //   }
  // };


  const handleAddRestaurant = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/resturants/addResturant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRestaurant)
      });

      if (!response.ok) {
        throw new Error("Failed to add restaurant");
      }

      const data = await response.json();
      console.log("Restaurant added successfully:", data);

      // Optionally, clear form fields
      setNewRestaurant({
        name: '',
        image: '',
        resturantType: '',
        location: '',
        email: '',
        mobileNum: ''
      });

      // Optional: show success message or reload list
    } catch (error) {
      console.error("Error adding restaurant:", error);
      // Optionally show error to user
    }
  };



  // Update a restaurant
  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    try {
      setRestaurants(restaurants.map((r) =>
        r.id === editRestaurant.id ? { ...editRestaurant } : r
      ));
      setEditRestaurant({ id: null, name: '', location: '' });
    } catch (err) {
      console.error('Error updating restaurant:', err);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    axios.get('http://localhost:8081/api/users/allUser')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  //fetch all the orders data from the backend

  useEffect(() => {
    axios.get('http://localhost:8081/api/orders/allOrders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  //fetch all resturants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/resturants");
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      }
    };

    fetchRestaurants();
  }, []);

  // Render the active section
  const renderSection = () => {
    const containerClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black';
    const tableClass = theme === 'dark' ? 'table-dark' : 'table-light';
    const buttonClass = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';

    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl">{orders.length}</p>
              </div>
              {/* <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Revenue</h3>
                <p className="text-2xl">${orders.reduce((sum, order) => sum + order.total, 0)}</p>
              </div> */}
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold">Active Users</h3>
                {/* <p className="text-2xl">{users.filter((user) => user.active).length}</p> */}
                <p className="text-2xl">{users.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                <BarChart width={500} height={300} data={salesData}>
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <YAxis stroke={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </div>
              <div className={`p-4 rounded-lg shadow ${containerClass}`}>
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <PieChart width={500} height={300}>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>
        );

      case 'orders':
        // return (
        //   <div className={containerClass}>
        //     <h2 className="text-xl font-bold mb-4">Order Management</h2>
        //     <table className={`w-full rounded-lg shadow ${tableClass}`}>
        //       <thead>
        //         <tr>
        //           <th className="p-2">Order ID</th>
        //           <th className="p-2">Customer</th>
        //           <th className="p-2">Total</th>
        //           <th className="p-2">Status</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         {orders.map((order) => (
        //           <tr key={order.id}>
        //             <td className="p-2 text-center">{order.id}</td>
        //             <td className="p-2 text-center">{order.customer}</td>
        //             <td className="p-2 text-center">${order.total}</td>
        //             <td className="p-2 text-center">{order.status}</td>
        //           </tr>
        //         ))}
        //       </tbody>
        //     </table>
        //   </div>
        // );


        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Order Management</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
              <thead>
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">User Name</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2 text-center">{order._id}</td>
                    <td className="p-2 text-center">{order.user?.userName || 'N/A'}</td>
                    <td className="p-2 text-center">
                      {order.items.map(item => (
                        <div key={item._id}>
                          <span className="font-medium">Product:</span> {item.product?.name || 'N/A'}<br />
                          <span className="font-medium">Qty:</span> {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-center">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );


      // case 'menu':
      //   return (
      //     <div className={`menu-management ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      //       <div className="menu-header">
      //         <h2>Menu Management</h2>
      //         <button
      //           onClick={toggleTheme}
      //           className="theme-toggle-btn"
      //           aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      //         >
      //           {theme === 'dark' ? <FiSun className="icon" /> : <FiMoon className="icon" />}
      //         </button>
      //       </div>

      //       <div className="menu-actions">
      //         <button
      //           className={`add-item-btn ${theme === 'dark' ? 'dark' : 'light'}`}
      //           onClick={() => {/* Add new item modal */ }}
      //         >
      //           <FiPlus className="icon" />
      //           <span>Add Menu Item</span>
      //         </button>
      //       </div>

      //       <div className="menu-table-container">
      //         <table className={`menu-table ${theme === 'dark' ? 'dark-table' : 'light-table'}`}>
      //           <thead>
      //             <tr>
      //               <th className="image-col">Image</th>
      //               <th className="name-col">Name</th>
      //               <th className="price-col">Price</th>
      //               <th className="desc-col">Description</th>
      //               <th className="actions-col">Actions</th>
      //             </tr>
      //           </thead>
      //           <tbody>
      //             {menuItems.map((item) => (
      //               <tr key={item.id} className="menu-item-row">
      //                 <td className="image-cell">
      //                   {item.imageUrl && (
      //                     <img
      //                       src={item.imageUrl}
      //                       alt={item.name}
      //                       className="menu-item-image"
      //                       loading="lazy"
      //                     />
      //                   )}
      //                 </td>
      //                 <td className="name-cell">{item.name}</td>
      //                 <td className="price-cell">${item.price.toFixed(2)}</td>
      //                 <td className="desc-cell">{item.description}</td>
      //                 <td className="actions-cell">
      //                   <button
      //                     className={`edit-btn ${theme === 'dark' ? 'dark-btn' : 'light-btn'}`}
      //                     onClick={() => {/* Edit functionality */ }}
      //                   >
      //                     <FiEdit className="icon" />
      //                   </button>
      //                   <button
      //                     className={`delete-btn ${theme === 'dark' ? 'dark-btn' : 'light-btn'}`}
      //                     onClick={() => {/* Delete functionality */ }}
      //                   >
      //                     <FiTrash2 className="icon" />
      //                   </button>
      //                 </td>
      //               </tr>
      //             ))}
      //           </tbody>
      //         </table>
      //       </div>

      //     {/* Add this CSS to your AdminDashboard.css file */}
      //     <style jsx>{`
      //         .menu-management {
      //           padding: 20px;
      //           border-radius: 8px;
      //           transition: all 0.3s ease;
      //         }

      //         .dark-mode {
      //           background-color: #2d3748;
      //           color: #f7fafc;
      //         }

      //         .light-mode {
      //           background-color: #ffffff;
      //           color: #1a202c;
      //         }

      //         .menu-header {
      //           display: flex;
      //           justify-content: space-between;
      //           align-items: center;
      //           margin-bottom: 24px;
      //         }

      //         .menu-header h2 {
      //           font-size: 24px;
      //           font-weight: 600;
      //         }

      //         .theme-toggle-btn {
      //           background: none;
      //           border: none;
      //           cursor: pointer;
      //           padding: 8px;
      //           border-radius: 50%;
      //           transition: all 0.3s ease;
      //         }

      //         .theme-toggle-btn:hover {
      //           background: ${theme === 'dark' ? '#4a5568' : '#edf2f7'};
      //         }

      //         .menu-actions {
      //           margin-bottom: 20px;
      //         }

      //         .add-item-btn {
      //           display: flex;
      //           align-items: center;
      //           gap: 8px;
      //           padding: 10px 16px;
      //           border-radius: 6px;
      //           font-weight: 500;
      //           transition: all 0.2s ease;
      //           border: none;
      //           cursor: pointer;
      //         }

      //         .add-item-btn.light {
      //           background-color: #4299e1;
      //           color: white;
      //         }

      //         .add-item-btn.dark {
      //           background-color: #3182ce;
      //           color: white;
      //         }

      //         .add-item-btn:hover {
      //           transform: translateY(-1px);
      //         }

      //         .menu-table-container {
      //           overflow-x: auto;
      //         }

      //         .menu-table {
      //           width: 100%;
      //           border-collapse: collapse;
      //           border-radius: 8px;
      //           overflow: hidden;
      //         }

      //         .light-table {
      //           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      //         }

      //         .dark-table {
      //           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      //         }

      //         .menu-table th {
      //           padding: 16px;
      //           text-align: left;
      //           font-weight: 600;
      //           text-transform: uppercase;
      //           font-size: 0.75rem;
      //           letter-spacing: 0.05em;
      //         }

      //         .light-table th {
      //           background-color: #edf2f7;
      //           color: #4a5568;
      //         }

      //         .dark-table th {
      //           background-color: #4a5568;
      //           color: #f7fafc;
      //         }

      //         .menu-table td {
      //           padding: 16px;
      //           vertical-align: middle;
      //         }

      //         .light-table tr:nth-child(even) {
      //           background-color: #f7fafc;
      //         }

      //         .light-table tr:hover {
      //           background-color: #ebf8ff;
      //         }

      //         .dark-table tr:nth-child(even) {
      //           background-color: #2d3748;
      //         }

      //         .dark-table tr:hover {
      //           background-color: #4a5568;
      //         }

      //         .menu-item-image {
      //           width: 60px;
      //           height: 60px;
      //           object-fit: cover;
      //           border-radius: 4px;
      //         }

      //         .actions-cell {
      //           display: flex;
      //           gap: 8px;
      //         }

      //         .edit-btn, .delete-btn {
      //           padding: 8px;
      //           border-radius: 4px;
      //           border: none;
      //           cursor: pointer;
      //           transition: all 0.2s ease;
      //         }

      //         .edit-btn.light-btn {
      //           background-color: #bee3f8;
      //           color: #2b6cb0;
      //         }

      //         .edit-btn.dark-btn {
      //           background-color: #2b6cb0;
      //           color: #bee3f8;
      //         }

      //         .delete-btn.light-btn {
      //           background-color: #fed7d7;
      //           color: #c53030;
      //         }

      //         .delete-btn.dark-btn {
      //           background-color: #c53030;
      //           color: #fed7d7;
      //         }

      //         .edit-btn:hover, .delete-btn:hover {
      //           transform: scale(1.1);
      //         }

      //         @media (max-width: 768px) {
      //           .image-col, .image-cell {
      //             display: none;
      //           }

      //           .menu-table th, .menu-table td {
      //             padding: 12px 8px;
      //           }
      //         }
      //       `}</style>
      //   </div>
      // );

      case 'users':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
              <thead>
                <tr>
                  <th className="p-2">User ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Mobile Number</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Date of Birth</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="p-2 text-center">{user._id}</td>
                    <td className="p-2 text-center">{user.userName}</td>
                    <td className="p-2 text-center">{user.email}</td>
                    <td className="p-2 text-center">{user.mobNum}</td>
                    <td className="p-2 text-center">{user.address}</td>
                    <td className="p-2 text-center">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deactivateUser(user._id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );



      // const UserManagement = () => {
      //   const [users, setUsers] = useState([]);
      //   const containerClass = "p-4"; // Replace with your actual styles
      //   const tableClass = "bg-white"; // Replace with your actual styles

      //   // Fetch users when component mounts
      //   useEffect(() => {
      //     axios.get('http://localhost:8081/api/users/allUser')
      //       .then(res => setUsers(res.data))
      //       .catch(err => console.error('Failed to fetch users:', err));
      //   }, []);

      //   const deactivateUser = (userId) => {
      //     // Implement deactivation logic (API call or state update)
      //     console.log('Deactivate user:', userId);
      //   };

      //   return (
      //     <div className={containerClass}>
      //       <h2 className="text-xl font-bold mb-4">User Management</h2>
      //       <table className={`w-full rounded-lg shadow ${tableClass}`}>
      //         <thead>
      //           <tr>
      //             <th className="p-2">User ID</th>
      //             <th className="p-2">Name</th>
      //             <th className="p-2">Email</th>
      //             <th className="p-2">Mobile Number</th>
      //             <th className="p-2">Address</th>
      //             <th className="p-2">Date of Birth</th>
      //             <th className="p-2">Actions</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {users.map((user) => (
      //             <tr key={user._id}>
      //               <td className="p-2 text-center">{user._id}</td>
      //               <td className="p-2 text-center">{user.userName}</td>
      //               <td className="p-2 text-center">{user.email}</td>
      //               <td className="p-2 text-center">{user.mobNum}</td>
      //               <td className="p-2 text-center">{user.address}</td>
      //               <td className="p-2 text-center">
      //                 {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}
      //               </td>
      //               <td className="p-2 text-center">
      //                 <button
      //                   onClick={() => deactivateUser(user._id)}
      //                   className="text-red-500 hover:text-red-600 transition-colors"
      //                 >
      //                   Deactivate
      //                 </button>
      //               </td>
      //             </tr>
      //           ))}
      //         </tbody>
      //       </table>
      //     </div>
      //   );
      // };

      // case 'promotions':
      //   return (
      //     <div className={containerClass}>
      //       <h2 className="text-xl font-bold mb-4">Promotions</h2>
      //       <table className={`w-full rounded-lg shadow ${tableClass}`}>
      //         <thead>
      //           <tr>
      //             <th className="p-2">Title</th>
      //             <th className="p-2">Description</th>
      //             <th className="p-2">Discount</th>
      //             <th className="p-2">Status</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {promotions.map((promo, index) => (
      //             <tr key={index}>
      //               <td className="p-2 text-center">{promo.title}</td>
      //               <td className="p-2 text-center">{promo.description}</td>
      //               <td className="p-2 text-center">{promo.discountPercentage}%</td>
      //               <td className="p-2 text-center">{promo.isActive ? 'Active' : 'Inactive'}</td>
      //             </tr>
      //           ))}
      //         </tbody>
      //       </table>
      //     </div>
      //   );

      case 'restaurants':
        return (
          <div className={containerClass}>
            <h2 className="text-xl font-bold mb-4">Restaurant Management</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add New Restaurant</h3>
              <form onSubmit={handleAddRestaurant} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newRestaurant.image}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, image: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Restaurant Type"
                  value={newRestaurant.resturantType}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, resturantType: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newRestaurant.location}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newRestaurant.email}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={newRestaurant.mobileNum}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, mobileNum: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <button type="submit" className={`p-2 rounded ${buttonClass}`}>
                  Add Restaurant
                </button>
              </form>
            </div>
            {/* <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Edit Restaurant</h3>
              <form onSubmit={handleEditRestaurant} className="flex gap-2">
                <select
                  value={editRestaurant.id || ''}
                  onChange={(e) => {
                    const selectedRestaurant = restaurants.find((r) => r.id === e.target.value);
                    setEditRestaurant(selectedRestaurant ? { ...selectedRestaurant } : { id: null, name: '', location: '' });
                  }}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={editRestaurant.name}
                  onChange={(e) => setEditRestaurant({ ...editRestaurant, name: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={editRestaurant.location}
                  onChange={(e) => setEditRestaurant({ ...editRestaurant, location: e.target.value })}
                  className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  required
                />
                <button type="submit" className={`p-2 rounded ${buttonClass}`}>
                  Update Restaurant
                </button>
              </form>
            </div> */}
            <table className={`w-full rounded-lg shadow ${tableClass}`}>
              <thead>
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Cuisine</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Mobile</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody style={{ flexWrap: "wrap" }}>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="p-2 text-center">
                      {restaurant.image && (
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          // className="w-12 h-12 object-cover rounded-full mx-auto"
                          style={{ height: "300px", width: "300px", borderRadius: "10px" }}
                        />
                      )}
                    </td>
                    <td className="p-2 text-center">{restaurant.name}</td>
                    <td className="p-2 text-center">{restaurant.resturantType}</td>
                    <td className="p-2 text-center">{restaurant.location}</td>
                    <td className="p-2 text-center">{restaurant.email}</td>
                    <td className="p-2 text-center">{restaurant.mobileNum}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deactivateRestaurant(restaurant._id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className={`admin-container ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome: ADMIN</h2>
          <p>admin@fooddelivery.com</p>
        </div>

        <div className="sidebar-section">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`sidebar-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          >
            <FiHome className="icon" />
            <span>Dashboard</span>
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Management</h3>
          <button
            onClick={() => setActiveSection('orders')}
            className={`sidebar-item ${activeSection === 'orders' ? 'active' : ''}`}
          >
            <FiShoppingCart className="icon" />
            <span>Orders</span>
          </button>
          {/* <button
            onClick={() => setActiveSection('menu')}
            className={`sidebar-item ${activeSection === 'menu' ? 'active' : ''}`}
          >
            <FiCoffee className="icon" />
            <span>Menu</span>
          </button> */}
          <button
            onClick={() => setActiveSection('users')}
            className={`sidebar-item ${activeSection === 'users' ? 'active' : ''}`}
          >
            <FiUsers className="icon" />
            <span>Users</span>
          </button>
        </div>

        {/* <div className="sidebar-section">
          <h3 className="section-title">Promotions</h3>
          <button
            onClick={() => setActiveSection('promotions')}
            className={`sidebar-item ${activeSection === 'promotions' ? 'active' : ''}`}
          >
            <FiTag className="icon" />
            <span>Promotions</span>
          </button>
        </div> */}

        <div className="sidebar-section">
          <h3 className="section-title">Restaurants</h3>
          <button
            onClick={() => setActiveSection('restaurants')}
            className={`sidebar-item ${activeSection === 'restaurants' ? 'active' : ''}`}
          >
            <FiMap className="icon" />
            <span>Restaurants</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/');
            }}
            className="logout-btn"
          >
            <FiLogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>
            {activeSection === 'dashboard' && 'Dashboard Overview'}
            {activeSection === 'orders' && 'Order Management'}
            {activeSection === 'menu' && 'Menu Management'}
            {activeSection === 'users' && 'User Management'}
            {activeSection === 'promotions' && 'Promotion Management'}
            {activeSection === 'restaurants' && 'Restaurant Management'}
          </h1>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
        </div>
        <div className="content-body">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;