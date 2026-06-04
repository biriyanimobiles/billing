import { useState, useMemo } from "react";

// ─── BRANCHES & USERS ────────────────────────────────────────────────────────
const initialBranches = [
  { id:1, name:"Head Office – Kochi",    city:"Kochi",       phone:"9876543210", address:"MG Road, Ernakulam", active:true },
  { id:2, name:"Thrissur Branch",         city:"Thrissur",    phone:"9876541111", address:"Round South, Thrissur", active:true },
  { id:3, name:"Kozhikode Branch",        city:"Kozhikode",   phone:"9876542222", address:"SM Street, Kozhikode", active:true },
];

const initialUsers = [
  { id:1, username:"admin",      password:"admin123",   name:"Super Admin",      role:"superadmin", branchId:null,  email:"admin@mobitrack.in",    active:true },
  { id:2, username:"thrissur",   password:"branch123",  name:"Arun Menon",        role:"branch",     branchId:2,    email:"thrissur@mobitrack.in", active:true },
  { id:3, username:"kozhikode",  password:"branch123",  name:"Priya Nair",         role:"branch",     branchId:3,    email:"kozhikode@mobitrack.in",active:true },
  { id:4, username:"kochi",      password:"branch123",  name:"Rahul Dev",          role:"branch",     branchId:1,    email:"kochi@mobitrack.in",    active:true },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Mobile Phones","Chargers","Earphones","Bluetooth Speakers",
  "Power Banks","Screen Guards","Smart Watches","Mobile Covers","Accessories"
];

// ─── SEED DATA (tagged with branchId) ────────────────────────────────────────
const seedProducts = [
  { id:1, branchId:1, name:"Samsung Galaxy A55", brand:"Samsung", category:"Mobile Phones", imei:"356789012345678", purchasePrice:18000, sellingPrice:22500, stock:8 },
  { id:2, branchId:1, name:"iPhone 15",           brand:"Apple",   category:"Mobile Phones", imei:"490154203237518", purchasePrice:72000, sellingPrice:82000, stock:3 },
  { id:3, branchId:1, name:"65W Fast Charger",    brand:"OnePlus", category:"Chargers",      imei:"",               purchasePrice:450,   sellingPrice:799,   stock:25 },
  { id:4, branchId:2, name:"TWS Earbuds Pro",     brand:"boAt",    category:"Earphones",     imei:"",               purchasePrice:700,   sellingPrice:1299,  stock:2 },
  { id:5, branchId:2, name:"Bluetooth Speaker Mini",brand:"JBL",   category:"Bluetooth Speakers",imei:"",           purchasePrice:1200,  sellingPrice:2199,  stock:6 },
  { id:6, branchId:2, name:"20000mAh Power Bank", brand:"Mi",      category:"Power Banks",   imei:"",               purchasePrice:900,   sellingPrice:1499,  stock:1 },
  { id:7, branchId:3, name:"Tempered Glass 6.7\"",brand:"Generic", category:"Screen Guards", imei:"",               purchasePrice:30,    sellingPrice:99,    stock:80 },
  { id:8, branchId:3, name:"Redmi Note 13 Pro",   brand:"Xiaomi",  category:"Mobile Phones", imei:"354125067891234",purchasePrice:16500, sellingPrice:19999, stock:5 },
  { id:9, branchId:1, name:"Smart Watch Series 8",brand:"Fire-Boltt",category:"Smart Watches",imei:"",              purchasePrice:1800,  sellingPrice:2999,  stock:4 },
  {id:10, branchId:3, name:"Silicone Back Cover",  brand:"Generic", category:"Mobile Covers", imei:"",               purchasePrice:40,    sellingPrice:149,   stock:120 },
];
const seedPurchases = [
  { id:1, branchId:1, supplier:"Tech Distributors Pvt Ltd", invoice:"INV-2024-001", date:"2024-12-15", productId:1, productName:"Samsung Galaxy A55", quantity:5, cost:18000, total:90000 },
  { id:2, branchId:1, supplier:"Apple Premium Reseller",    invoice:"INV-2024-002", date:"2024-12-18", productId:2, productName:"iPhone 15",           quantity:2, cost:72000, total:144000 },
  { id:3, branchId:2, supplier:"Mobile World Wholesale",    invoice:"INV-2024-003", date:"2024-12-20", productId:4, productName:"TWS Earbuds Pro",      quantity:10,cost:700,   total:7000 },
  { id:4, branchId:3, supplier:"Audio Gadgets Hub",         invoice:"INV-2024-004", date:"2024-12-22", productId:7, productName:"Tempered Glass 6.7\"", quantity:50,cost:30,    total:1500 },
];
const seedSales = [
  { id:1, branchId:1, customer:"Rahul Kumar",       date:"2024-12-23", productId:1, productName:"Samsung Galaxy A55",    quantity:1, price:22500, cost:18000, profit:4500 },
  { id:2, branchId:1, customer:"Walk-in Customer",  date:"2024-12-23", productId:3, productName:"65W Fast Charger",       quantity:2, price:799,   cost:450,   profit:698 },
  { id:3, branchId:2, customer:"Priya Sharma",      date:"2024-12-24", productId:5, productName:"Bluetooth Speaker Mini", quantity:1, price:2199,  cost:1200,  profit:999 },
  { id:4, branchId:3, customer:"Walk-in Customer",  date:"2024-12-24", productId:7, productName:"Tempered Glass 6.7\"",  quantity:3, price:99,    cost:30,    profit:207 },
  { id:5, branchId:2, customer:"Anjali Singh",      date:"2024-12-25", productId:9, productName:"Smart Watch Series 8",  quantity:1, price:2999,  cost:1800,  profit:1199 },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const icons = {
  dashboard:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  box:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  purchase:"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  sale:"M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  report:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings:"M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  plus:"M12 5v14 M5 12h14",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  search:"M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  alert:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  trend:"M23 6l-9.5 9.5-5-5L1 18",
  check:"M20 6L9 17l-5-5",
  x:"M18 6L6 18 M6 6l12 12",
  menu:"M3 12h18 M3 6h18 M3 18h18",
  phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13 19.79 19.79 0 0 1 1.08 4.4 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22",
  branch:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  map:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  globe:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
};

const Ico = ({ d, size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];

// ─── BRANCH COLORS ───────────────────────────────────────────────────────────
const BRANCH_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
const branchColor = id => BRANCH_COLORS[(id-1) % BRANCH_COLORS.length];

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]     = useState(null); // { user, branch }
  const [page, setPage]           = useState("dashboard");
  const [sideOpen, setSideOpen]   = useState(false);

  const [branches, setBranches]   = useState(initialBranches);
  const [users, setUsers]         = useState(initialUsers);
  const [products, setProducts]   = useState(seedProducts);
  const [purchases, setPurchases] = useState(seedPurchases);
  const [sales, setSales]         = useState(seedSales);

  if (!session) return (
    <Login
      users={users}
      branches={branches}
      onLogin={(user, branch) => { setSession({ user, branch }); setPage("dashboard"); }}
    />
  );

  const { user, branch } = session;
  const isSuperAdmin = user.role === "superadmin";

  // Scope data to branch (superadmin sees all)
  const scopedBranchId = isSuperAdmin ? null : branch.id;
  const scopedProducts  = scopedBranchId ? products.filter(p=>p.branchId===scopedBranchId)  : products;
  const scopedPurchases = scopedBranchId ? purchases.filter(p=>p.branchId===scopedBranchId) : purchases;
  const scopedSales     = scopedBranchId ? sales.filter(s=>s.branchId===scopedBranchId)     : sales;

  // Nav — superadmin gets extra Branches & Users pages
  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:icons.dashboard },
    { key:"products",  label:"Products",  icon:icons.box },
    { key:"purchases", label:"Purchases", icon:icons.purchase },
    { key:"sales",     label:"Sales",     icon:icons.sale },
    { key:"reports",   label:"Reports",   icon:icons.report },
    ...(isSuperAdmin ? [
      { key:"branches", label:"Branches", icon:icons.globe },
      { key:"users",    label:"Users",    icon:icons.users },
    ] : []),
    { key:"settings",  label:"Settings",  icon:icons.settings },
  ];

  const shared = {
    products, setProducts, purchases, setPurchases, sales, setSales,
    branches, setBranches, users, setUsers,
    scopedProducts, scopedPurchases, scopedSales,
    isSuperAdmin, session,
    currentBranchId: scopedBranchId || (isSuperAdmin ? null : branch.id),
  };

  const initials = user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f0f4f8", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{globalCSS}</style>

      <div className={`overlay ${sideOpen?"open":""}`} onClick={()=>setSideOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sideOpen?"open":""}`}>
        {/* Logo */}
        <div style={{ padding:"18px 18px 14px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ico d={icons.phone} size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:"#0f172a" }}>MobiTrack</div>
              <div style={{ fontSize:10.5, color:"#94a3b8", fontWeight:500 }}>Stock Manager</div>
            </div>
          </div>
        </div>

        {/* Branch badge */}
        {!isSuperAdmin && (
          <div style={{ margin:"10px 12px", padding:"9px 12px", borderRadius:10, background:`${branchColor(branch.id)}18`, border:`1px solid ${branchColor(branch.id)}30` }}>
            <div style={{ fontSize:10, fontWeight:700, color:branchColor(branch.id), textTransform:"uppercase", letterSpacing:.6, marginBottom:2 }}>Current Branch</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{branch.name}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>{branch.city}</div>
          </div>
        )}
        {isSuperAdmin && (
          <div style={{ margin:"10px 12px", padding:"9px 12px", borderRadius:10, background:"#fef3c7", border:"1px solid #fcd34d" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#d97706", textTransform:"uppercase", letterSpacing:.6, marginBottom:1 }}>All Branches</div>
            <div style={{ fontSize:12.5, fontWeight:600, color:"#92400e" }}>Super Admin View</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:"8px 12px", display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(n=>(
            <button key={n.key} className={`nav-item ${page===n.key?"active":""}`} onClick={()=>{ setPage(n.key); setSideOpen(false); }}>
              <Ico d={n.icon} size={16} /> {n.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding:"10px 12px", borderTop:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, marginBottom:6, background:"#f8fafc" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${branchColor(user.branchId||1)},${branchColor((user.branchId||1)+2)})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800 }}>{initials}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:"#1e293b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
              <div style={{ fontSize:10.5, color:"#94a3b8" }}>{isSuperAdmin?"Super Admin":"Branch Manager"}</div>
            </div>
          </div>
          <button className="nav-item" style={{ color:"#ef4444" }} onClick={()=>setSession(null)}>
            <Ico d={icons.logout} size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content" style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <header style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="menu-btn" onClick={()=>setSideOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", display:"none", padding:4, borderRadius:6 }} id="menu-btn">
              <Ico d={icons.menu} size={22} />
            </button>
            <style>{`@media(max-width:768px){#menu-btn{display:flex!important;}}`}</style>
            <span style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{navItems.find(n=>n.key===page)?.label}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isSuperAdmin && (
              <span style={{ fontSize:11.5, background:"#fef3c7", color:"#d97706", fontWeight:700, padding:"3px 10px", borderRadius:99 }}>
                SUPER ADMIN
              </span>
            )}
            <span style={{ fontSize:12, color:"#94a3b8" }}>{new Date().toLocaleDateString("en-IN",{ weekday:"short", day:"numeric", month:"short" })}</span>
          </div>
        </header>

        <main style={{ flex:1, padding:"22px", maxWidth:1400, width:"100%" }}>
          {page==="dashboard" && <Dashboard {...shared} />}
          {page==="products"  && <Products  {...shared} />}
          {page==="purchases" && <Purchases {...shared} />}
          {page==="sales"     && <SalesPage {...shared} />}
          {page==="reports"   && <Reports   {...shared} />}
          {page==="branches"  && isSuperAdmin && <BranchesPage {...shared} products={products} sales={sales} purchases={purchases} />}
          {page==="users"     && isSuperAdmin && <UsersPage    {...shared} />}
          {page==="settings"  && <Settings  {...shared} />}
        </main>
      </div>
    </div>
  );
}

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}
  input,select,textarea{font-family:inherit;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;cursor:pointer;transition:all .18s;color:#64748b;font-size:13.5px;font-weight:500;border:none;background:none;width:100%;text-align:left;}
  .nav-item:hover{background:#f1f5f9;color:#1e293b;}
  .nav-item.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 4px 12px rgba(99,102,241,.3);}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:inherit;}
  .btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 2px 8px rgba(99,102,241,.3);}
  .btn-primary:hover{box-shadow:0 4px 16px rgba(99,102,241,.4);transform:translateY(-1px);}
  .btn-danger{background:#fee2e2;color:#dc2626;} .btn-danger:hover{background:#fecaca;}
  .btn-secondary{background:#f1f5f9;color:#475569;} .btn-secondary:hover{background:#e2e8f0;}
  .btn-success{background:#dcfce7;color:#16a34a;} .btn-success:hover{background:#bbf7d0;}
  .btn-warning{background:#fef3c7;color:#d97706;} .btn-warning:hover{background:#fde68a;}
  .card{background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);}
  .input{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13.5px;outline:none;transition:border .18s;background:#fff;}
  .input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
  .label{display:block;font-size:11.5px;font-weight:600;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;}
  .table{width:100%;border-collapse:collapse;font-size:13px;}
  .table th{padding:10px 14px;text-align:left;font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;background:#f8fafc;border-bottom:1px solid #e2e8f0;}
  .table td{padding:11px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:#334155;}
  .table tr:last-child td{border-bottom:none;} .table tr:hover td{background:#fafbff;}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;}
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;backdrop-filter:blur(4px);}
  .modal{background:#fff;border-radius:20px;padding:26px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.15);}
  .stat-card{background:#fff;border-radius:16px;padding:18px;box-shadow:0 1px 3px rgba(0,0,0,.06);border:1px solid #f1f5f9;transition:transform .2s;}
  .stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.08);}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:40;display:none;}
  @media(max-width:768px){.overlay.open{display:block;}}
  .sidebar{position:fixed;left:0;top:0;bottom:0;width:236px;z-index:50;transition:transform .3s;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;}
  @media(max-width:768px){.sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}}
  .main-content{margin-left:236px;}
  @media(max-width:768px){.main-content{margin-left:0;}}
  .page-title{font-family:'Sora',sans-serif;font-size:21px;font-weight:800;color:#0f172a;}
  .section-title{font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#0f172a;}
  select.input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:30px;}
  .profit-badge{background:#dcfce7;color:#15803d;} .loss-badge{background:#fee2e2;color:#dc2626;}
  .tab{padding:7px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;border:none;background:none;font-family:inherit;color:#64748b;transition:all .2s;}
  .tab.active{background:#6366f1;color:#fff;}
  .switch{position:relative;display:inline-block;width:40px;height:22px;}
  .switch input{opacity:0;width:0;height:0;}
  .slider{position:absolute;cursor:pointer;inset:0;background:#cbd5e1;border-radius:22px;transition:.3s;}
  .slider:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;}
  input:checked+.slider{background:#6366f1;}
  input:checked+.slider:before{transform:translateX(18px);}
`;

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({ users, branches, onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const submit = () => {
    const user = users.find(us => us.username === u && us.password === p && us.active);
    if (!user) { setErr("Invalid username or password."); return; }
    const branch = user.branchId ? branches.find(b=>b.id===user.branchId) : null;
    onLogin(user, branch);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');*{box-sizing:border-box;}`}</style>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, width:"100%", maxWidth:400 }}>
        {/* Brand */}
        <div style={{ textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:18, background:"rgba(255,255,255,.2)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.3)", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ico d={icons.phone} size={28} color="#fff" />
          </div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:"#fff" }}>MobiTrack</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:3 }}>Mobile & Accessories Stock Manager</div>
        </div>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:24, padding:32, width:"100%", boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:20 }}>Sign in to your account</h2>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#64748b", marginBottom:5, textTransform:"uppercase", letterSpacing:.5 }}>Username</label>
            <input style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:14, outline:"none", fontFamily:"inherit" }} placeholder="Enter username" value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#64748b", marginBottom:5, textTransform:"uppercase", letterSpacing:.5 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={show?"text":"password"} style={{ width:"100%", padding:"10px 40px 10px 13px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:14, outline:"none", fontFamily:"inherit" }} placeholder="••••••••" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
              <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}>
                <Ico d={show?icons.eyeOff:icons.eye} size={17} color="#94a3b8" />
              </button>
            </div>
          </div>
          {err && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"8px 12px", borderRadius:8, fontSize:13, marginBottom:14 }}>{err}</div>}
          <button onClick={submit} style={{ width:"100%", padding:"11px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(99,102,241,.4)" }}>
            Sign In
          </button>

          {/* Demo accounts */}
          <div style={{ marginTop:20, padding:14, background:"#f8fafc", borderRadius:12, border:"1px solid #e2e8f0" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>Demo Accounts</div>
            {[
              { u:"admin",     p:"admin123",  label:"Super Admin",       badge:"All Branches", color:"#d97706", bg:"#fef3c7" },
              { u:"kochi",     p:"branch123", label:"Head Office – Kochi", badge:"Branch",     color:"#6366f1", bg:"#eef2ff" },
              { u:"thrissur",  p:"branch123", label:"Thrissur Branch",    badge:"Branch",      color:"#0ea5e9", bg:"#f0f9ff" },
              { u:"kozhikode", p:"branch123", label:"Kozhikode Branch",   badge:"Branch",      color:"#10b981", bg:"#f0fdf4" },
            ].map(a=>(
              <button key={a.u} onClick={()=>{ setU(a.u); setP(a.p); setErr(""); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"7px 10px", marginBottom:4, borderRadius:8, border:"1px solid #e2e8f0", background:u===a.u?"#eef2ff":"#fff", cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                <span style={{ fontSize:12.5, fontWeight:600, color:"#334155" }}>{a.label}</span>
                <span style={{ fontSize:10.5, fontWeight:700, padding:"2px 7px", borderRadius:99, background:a.bg, color:a.color }}>{a.badge}</span>
              </button>
            ))}
            <div style={{ fontSize:11, color:"#94a3b8", marginTop:6 }}>Click an account to pre-fill, then Sign In</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function BranchBadge({ branchId, branches }) {
  const b = branches.find(x=>x.id===branchId);
  if (!b) return null;
  const c = branchColor(branchId);
  return <span className="badge" style={{ background:`${c}18`, color:c, border:`1px solid ${c}30` }}>{b.city}</span>;
}

function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total/perPage);
  if (pages<=1) return null;
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:6, padding:14, borderTop:"1px solid #f1f5f9" }}>
      {Array.from({length:pages},(_,i)=>i+1).map(n=>(
        <button key={n} onClick={()=>onChange(n)} style={{ width:30, height:30, borderRadius:7, border:"1.5px solid", borderColor:n===page?"#6366f1":"#e2e8f0", background:n===page?"#6366f1":"#fff", color:n===page?"#fff":"#64748b", fontWeight:600, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>{n}</button>
      ))}
    </div>
  );
}

function ModalWrap({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">{children}</div>
    </div>
  );
}
function ModalHeader({ title, onClose }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
      <h2 className="section-title">{title}</h2>
      <button onClick={onClose} style={{ background:"#f1f5f9", border:"none", width:30, height:30, borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ico d={icons.x} size={15} color="#64748b" />
      </button>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ scopedProducts, scopedPurchases, scopedSales, branches, isSuperAdmin }) {
  const totalStock  = scopedProducts.reduce((s,p)=>s+p.stock,0);
  const stockValue  = scopedProducts.reduce((s,p)=>s+p.stock*p.sellingPrice,0);
  const todaySales  = scopedSales.filter(s=>s.date===today()).reduce((a,s)=>a+s.price*s.quantity,0);
  const totalProfit = scopedSales.reduce((a,s)=>a+s.profit,0);
  const lowStock    = scopedProducts.filter(p=>p.stock<=3);

  const stats = [
    { label:"Total Products",   value:scopedProducts.length,         icon:icons.box,       color:"#6366f1", bg:"#eef2ff" },
    { label:"Total Stock Qty",  value:totalStock.toLocaleString(),   icon:icons.trend,     color:"#0ea5e9", bg:"#f0f9ff" },
    { label:"Stock Value",      value:fmt(stockValue),               icon:icons.sale,      color:"#10b981", bg:"#f0fdf4" },
    { label:"Today's Sales",    value:fmt(todaySales),               icon:icons.report,    color:"#f59e0b", bg:"#fffbeb" },
    { label:"Total Profit",     value:fmt(totalProfit),              icon:icons.check,     color:"#8b5cf6", bg:"#faf5ff" },
    { label:"Low Stock Items",  value:lowStock.length,               icon:icons.alert,     color:"#ef4444", bg:"#fef2f2" },
  ];

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color:"#64748b", fontSize:13, marginTop:3 }}>
          {isSuperAdmin ? `Viewing all ${branches.length} branches` : "Your branch at a glance"}
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:14, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:7 }}>{s.label}</div>
                <div style={{ fontSize:21, fontWeight:800, color:"#0f172a", fontFamily:"'Sora',sans-serif" }}>{s.value}</div>
              </div>
              <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ico d={s.icon} size={17} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Super Admin branch overview */}
      {isSuperAdmin && (
        <div className="card" style={{ padding:20, marginBottom:20 }}>
          <h2 className="section-title" style={{ marginBottom:14 }}>Branch Performance Overview</h2>
          <div style={{ overflowX:"auto" }}>
            <table className="table">
              <thead><tr><th>Branch</th><th>Products</th><th>Stock Qty</th><th>Stock Value</th><th>Total Sales</th><th>Total Profit</th></tr></thead>
              <tbody>
                {branches.map(b=>{
                  const bProds  = scopedProducts.filter(p=>p.branchId===b.id);
                  const bSales  = scopedSales.filter(s=>s.branchId===b.id);
                  const bStock  = bProds.reduce((a,p)=>a+p.stock,0);
                  const bValue  = bProds.reduce((a,p)=>a+p.stock*p.sellingPrice,0);
                  const bRev    = bSales.reduce((a,s)=>a+s.price*s.quantity,0);
                  const bProfit = bSales.reduce((a,s)=>a+s.profit,0);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:99, background:branchColor(b.id) }} />
                          <div>
                            <div style={{ fontWeight:700, fontSize:13 }}>{b.name}</div>
                            <div style={{ fontSize:11, color:"#94a3b8" }}>{b.city}</div>
                          </div>
                        </div>
                      </td>
                      <td>{bProds.length}</td>
                      <td>{bStock}</td>
                      <td style={{ fontWeight:600 }}>{fmt(bValue)}</td>
                      <td style={{ fontWeight:600 }}>{fmt(bRev)}</td>
                      <td><span className="badge profit-badge">{fmt(bProfit)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:18 }}>
        {/* Low Stock */}
        <div className="card" style={{ padding:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
            <Ico d={icons.alert} size={16} color="#ef4444" />
            <h2 className="section-title" style={{ color:"#ef4444" }}>Low Stock Alerts</h2>
          </div>
          {lowStock.length===0 ? <p style={{ color:"#64748b", fontSize:13 }}>All products are well stocked ✓</p>
            : lowStock.map(p=>(
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{p.brand}</div>
                </div>
                <span className="badge loss-badge">{p.stock} left</span>
              </div>
            ))
          }
        </div>

        {/* Recent Sales */}
        <div className="card" style={{ padding:18 }}>
          <h2 className="section-title" style={{ marginBottom:14 }}>Recent Sales</h2>
          {[...scopedSales].reverse().slice(0,5).map(s=>(
            <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{s.productName}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>{s.customer} · {s.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{fmt(s.price*s.quantity)}</div>
                <div style={{ fontSize:11, color:"#16a34a", fontWeight:600 }}>+{fmt(s.profit)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Purchases */}
        <div className="card" style={{ padding:18 }}>
          <h2 className="section-title" style={{ marginBottom:14 }}>Recent Purchases</h2>
          {[...scopedPurchases].reverse().slice(0,5).map(p=>(
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{p.productName}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>{p.supplier} · {p.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{fmt(p.total)}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>×{p.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
function Products({ products, setProducts, scopedProducts, branches, isSuperAdmin, currentBranchId, session }) {
  const [search, setSearch]   = useState("");
  const [catF, setCatF]       = useState("All");
  const [branchF, setBranchF] = useState("All");
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({});
  const [pg, setPg]           = useState(1);
  const PER = 8;

  const base = isSuperAdmin ? products : scopedProducts;
  const filtered = useMemo(()=>base.filter(p=>{
    const q=search.toLowerCase();
    const ms = !q||(p.name+p.brand+p.imei).toLowerCase().includes(q);
    const mc = catF==="All"||p.category===catF;
    const mb = !isSuperAdmin||branchF==="All"||p.branchId===+branchF;
    return ms&&mc&&mb;
  }),[base,search,catF,branchF]);
  const paged = filtered.slice((pg-1)*PER, pg*PER);

  const openAdd  = () => { setForm({ name:"", brand:"", category:CATEGORIES[0], imei:"", purchasePrice:"", sellingPrice:"", stock:"", branchId: isSuperAdmin ? (branches[0]?.id||1) : currentBranchId }); setModal("add"); };
  const openEdit = p => { setForm({...p}); setModal(p); };
  const save = () => {
    if(!form.name||!form.brand) return;
    const rec = {...form, purchasePrice:+form.purchasePrice, sellingPrice:+form.sellingPrice, stock:+form.stock, branchId:+form.branchId};
    if(modal==="add") setProducts(ps=>[...ps,{...rec,id:Date.now()}]);
    else setProducts(ps=>ps.map(p=>p.id===rec.id?rec:p));
    setModal(null);
  };
  const del = id => { if(confirm("Delete this product?")) setProducts(ps=>ps.filter(p=>p.id!==id)); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h1 className="page-title">Products</h1>
        <button className="btn btn-primary" onClick={openAdd}><Ico d={icons.plus} size={14} color="#fff" /> Add Product</button>
      </div>

      <div className="card" style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <Ico d={icons.search} size={15} color="#94a3b8" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }} />
            <input className="input" style={{ paddingLeft:32 }} placeholder="Search name, brand, IMEI…" value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}} />
          </div>
          <select className="input" style={{ maxWidth:190 }} value={catF} onChange={e=>{setCatF(e.target.value);setPg(1);}}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          {isSuperAdmin && (
            <select className="input" style={{ maxWidth:180 }} value={branchF} onChange={e=>{setBranchF(e.target.value);setPg(1);}}>
              <option value="All">All Branches</option>
              {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="table">
            <thead><tr><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Category</th><th>Buy Price</th><th>Sell Price</th><th>Margin</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.map(p=>{
                const margin = p.purchasePrice ? ((p.sellingPrice-p.purchasePrice)/p.purchasePrice*100).toFixed(1) : 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{p.brand}{p.imei&&` · ···${p.imei.slice(-4)}`}</div>
                    </td>
                    {isSuperAdmin&&<td><BranchBadge branchId={p.branchId} branches={branches} /></td>}
                    <td><span className="badge" style={{ background:"#eef2ff", color:"#6366f1" }}>{p.category}</span></td>
                    <td style={{ fontWeight:600 }}>{fmt(p.purchasePrice)}</td>
                    <td style={{ fontWeight:600 }}>{fmt(p.sellingPrice)}</td>
                    <td><span className="badge profit-badge">+{margin}%</span></td>
                    <td><span className={`badge ${p.stock<=3?"loss-badge":"profit-badge"}`}>{p.stock}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:5 }}>
                        <button className="btn btn-secondary" style={{ padding:"5px 9px" }} onClick={()=>openEdit(p)}><Ico d={icons.edit} size={13} /></button>
                        <button className="btn btn-danger"    style={{ padding:"5px 9px" }} onClick={()=>del(p.id)}><Ico d={icons.trash} size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length===0&&<tr><td colSpan={9} style={{ textAlign:"center", color:"#94a3b8", padding:28 }}>No products found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pg} total={filtered.length} perPage={PER} onChange={setPg} />
      </div>

      {modal && (
        <ModalWrap onClose={()=>setModal(null)}>
          <ModalHeader title={modal==="add"?"Add Product":"Edit Product"} onClose={()=>setModal(null)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            {isSuperAdmin && (
              <div style={{ gridColumn:"1/-1" }}>
                <label className="label">Branch *</label>
                <select className="input" value={form.branchId||""} onChange={e=>setForm(f=>({...f,branchId:+e.target.value}))}>
                  {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Product Name *</label>
              <input className="input" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Samsung Galaxy A55" />
            </div>
            <div>
              <label className="label">Brand *</label>
              <input className="input" value={form.brand||""} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category||CATEGORIES[0]} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">IMEI (Mobiles only)</label>
              <input className="input" value={form.imei||""} onChange={e=>setForm(f=>({...f,imei:e.target.value}))} placeholder="15-digit IMEI" />
            </div>
            <div>
              <label className="label">Purchase Price ₹ *</label>
              <input className="input" type="number" value={form.purchasePrice||""} onChange={e=>setForm(f=>({...f,purchasePrice:e.target.value}))} />
            </div>
            <div>
              <label className="label">Selling Price ₹ *</label>
              <input className="input" type="number" value={form.sellingPrice||""} onChange={e=>setForm(f=>({...f,sellingPrice:e.target.value}))} />
            </div>
            <div>
              <label className="label">Stock Qty *</label>
              <input className="input" type="number" value={form.stock||""} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />
            </div>
            {form.purchasePrice&&form.sellingPrice&&(
              <div style={{ display:"flex", alignItems:"flex-end" }}>
                <span className="badge profit-badge" style={{ padding:"8px 12px" }}>
                  Margin: {((+form.sellingPrice-+form.purchasePrice)/+form.purchasePrice*100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary"   style={{ flex:1 }} onClick={save}>{modal==="add"?"Add Product":"Save"}</button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

// ─── PURCHASES ───────────────────────────────────────────────────────────────
function Purchases({ products, setProducts, purchases, setPurchases, scopedPurchases, scopedProducts, branches, isSuperAdmin, currentBranchId }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [branchF, setBranchF] = useState("All");
  const [form, setForm] = useState({ supplier:"", invoice:"", date:today(), productId:"", quantity:1, cost:"", branchId: currentBranchId || (branches[0]?.id||1) });
  const [pg, setPg] = useState(1); const PER=8;

  const base = isSuperAdmin ? purchases : scopedPurchases;
  const filtered = base.filter(p=>{
    const ms = !search||(p.supplier+p.productName+p.invoice).toLowerCase().includes(search.toLowerCase());
    const mb = !isSuperAdmin||branchF==="All"||p.branchId===+branchF;
    return ms&&mb;
  });
  const paged = [...filtered].reverse().slice((pg-1)*PER, pg*PER);

  const availableProducts = isSuperAdmin
    ? products.filter(p=>form.branchId?p.branchId===+form.branchId:true)
    : scopedProducts;
  const selProd = availableProducts.find(p=>p.id===+form.productId);

  const save = () => {
    if(!form.supplier||!form.productId||!form.quantity||!form.cost) return;
    const prod = products.find(p=>p.id===+form.productId);
    if(!prod) return;
    const bId = isSuperAdmin ? +form.branchId : currentBranchId;
    const entry = { id:Date.now(), branchId:bId, supplier:form.supplier, invoice:form.invoice||`INV-${Date.now()}`, date:form.date, productId:+form.productId, productName:prod.name, quantity:+form.quantity, cost:+form.cost, total:+form.quantity*(+form.cost) };
    setPurchases(ps=>[...ps,entry]);
    setProducts(prods=>prods.map(p=>p.id===+form.productId?{...p,stock:p.stock+(+form.quantity)}:p));
    setModal(false);
    setForm({ supplier:"", invoice:"", date:today(), productId:"", quantity:1, cost:"", branchId:bId });
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h1 className="page-title">Purchases</h1>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><Ico d={icons.plus} size={14} color="#fff" /> Add Purchase</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:13, marginBottom:18 }}>
        {[
          { label:"Total Purchases", value:base.length },
          { label:"Total Spent",     value:fmt(base.reduce((a,p)=>a+p.total,0)) },
          { label:"Units Bought",    value:base.reduce((a,p)=>a+p.quantity,0) },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Sora',sans-serif", color:"#0f172a" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:13, marginBottom:13 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <Ico d={icons.search} size={15} color="#94a3b8" />
            <input className="input" style={{ paddingLeft:32 }} placeholder="Search…" value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}} />
          </div>
          {isSuperAdmin && (
            <select className="input" style={{ maxWidth:180 }} value={branchF} onChange={e=>{setBranchF(e.target.value);setPg(1);}}>
              <option value="All">All Branches</option>
              {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="table">
            <thead><tr><th>Date</th><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Supplier</th><th>Invoice</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
            <tbody>
              {paged.map(p=>(
                <tr key={p.id}>
                  <td style={{ color:"#64748b", fontSize:12 }}>{p.date}</td>
                  <td style={{ fontWeight:600 }}>{p.productName}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={p.branchId} branches={branches} /></td>}
                  <td style={{ fontSize:12.5 }}>{p.supplier}</td>
                  <td><span style={{ fontFamily:"monospace", fontSize:11.5, background:"#f8fafc", padding:"2px 7px", borderRadius:5 }}>{p.invoice}</span></td>
                  <td style={{ fontWeight:600 }}>{p.quantity}</td>
                  <td>{fmt(p.cost)}</td>
                  <td style={{ fontWeight:700 }}>{fmt(p.total)}</td>
                </tr>
              ))}
              {paged.length===0&&<tr><td colSpan={9} style={{ textAlign:"center", color:"#94a3b8", padding:28 }}>No purchases found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pg} total={filtered.length} perPage={PER} onChange={setPg} />
      </div>

      {modal && (
        <ModalWrap onClose={()=>setModal(false)}>
          <ModalHeader title="Add Purchase Entry" onClose={()=>setModal(false)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            {isSuperAdmin && (
              <div style={{ gridColumn:"1/-1" }}>
                <label className="label">Branch *</label>
                <select className="input" value={form.branchId} onChange={e=>setForm(f=>({...f,branchId:+e.target.value,productId:"",cost:""}))}>
                  {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label">Supplier Name *</label>
              <input className="input" value={form.supplier} onChange={e=>setForm(f=>({...f,supplier:e.target.value}))} />
            </div>
            <div>
              <label className="label">Invoice No.</label>
              <input className="input" value={form.invoice} onChange={e=>setForm(f=>({...f,invoice:e.target.value}))} placeholder="INV-001" />
            </div>
            <div>
              <label className="label">Date *</label>
              <input className="input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            </div>
            <div>
              <label className="label">Product *</label>
              <select className="input" value={form.productId} onChange={e=>setForm(f=>({...f,productId:e.target.value,cost:availableProducts.find(p=>p.id===+e.target.value)?.purchasePrice||""}))}>
                <option value="">Select product</option>
                {availableProducts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} />
            </div>
            <div>
              <label className="label">Cost per Unit ₹ *</label>
              <input className="input" type="number" value={form.cost} onChange={e=>setForm(f=>({...f,cost:e.target.value}))} />
            </div>
            {form.quantity&&form.cost&&(
              <div style={{ gridColumn:"1/-1", background:"#f8fafc", borderRadius:10, padding:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                  <span style={{ color:"#64748b" }}>Total:</span>
                  <span style={{ fontWeight:800, fontSize:15 }}>{fmt(+form.quantity*(+form.cost))}</span>
                </div>
                {selProd&&<div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>Stock: {selProd.stock} → {selProd.stock+(+form.quantity)}</div>}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary"   style={{ flex:1 }} onClick={save}>Save Purchase</button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

// ─── SALES ───────────────────────────────────────────────────────────────────
function SalesPage({ products, setProducts, sales, setSales, scopedSales, scopedProducts, branches, isSuperAdmin, currentBranchId }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [branchF, setBranchF] = useState("All");
  const [form, setForm] = useState({ customer:"", date:today(), productId:"", quantity:1, price:"", branchId: currentBranchId||(branches[0]?.id||1) });
  const [pg, setPg] = useState(1); const PER=8;

  const base = isSuperAdmin ? sales : scopedSales;
  const filtered = base.filter(s=>{
    const ms=!search||(s.customer+s.productName).toLowerCase().includes(search.toLowerCase());
    const mb=!isSuperAdmin||branchF==="All"||s.branchId===+branchF;
    return ms&&mb;
  });
  const paged = [...filtered].reverse().slice((pg-1)*PER,pg*PER);

  const availableProducts = isSuperAdmin
    ? products.filter(p=>p.stock>0&&(form.branchId?p.branchId===+form.branchId:true))
    : scopedProducts.filter(p=>p.stock>0);
  const selProd = availableProducts.find(p=>p.id===+form.productId);

  const save = () => {
    if(!form.productId||!form.quantity||!form.price) return;
    const prod = products.find(p=>p.id===+form.productId);
    if(!prod||prod.stock<+form.quantity) { alert("Insufficient stock!"); return; }
    const bId = isSuperAdmin ? +form.branchId : currentBranchId;
    const profit = (+form.price-prod.purchasePrice)*(+form.quantity);
    const entry = { id:Date.now(), branchId:bId, customer:form.customer||"Walk-in Customer", date:form.date, productId:+form.productId, productName:prod.name, quantity:+form.quantity, price:+form.price, cost:prod.purchasePrice, profit };
    setSales(ss=>[...ss,entry]);
    setProducts(prods=>prods.map(p=>p.id===+form.productId?{...p,stock:p.stock-(+form.quantity)}:p));
    setModal(false);
    setForm({ customer:"", date:today(), productId:"", quantity:1, price:"", branchId:bId });
  };

  const totalRevenue = base.reduce((a,s)=>a+s.price*s.quantity,0);
  const totalProfit  = base.reduce((a,s)=>a+s.profit,0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h1 className="page-title">Sales</h1>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><Ico d={icons.plus} size={14} color="#fff" /> New Sale</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:13, marginBottom:18 }}>
        {[
          { label:"Total Sales",     value:base.length },
          { label:"Total Revenue",   value:fmt(totalRevenue) },
          { label:"Total Profit",    value:fmt(totalProfit) },
          { label:"Avg Profit/Sale", value:base.length?fmt(Math.round(totalProfit/base.length)):"₹0" },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Sora',sans-serif", color:"#0f172a" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:13, marginBottom:13 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <input className="input" style={{ paddingLeft:32 }} placeholder="Search sales…" value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}} />
          </div>
          {isSuperAdmin && (
            <select className="input" style={{ maxWidth:180 }} value={branchF} onChange={e=>{setBranchF(e.target.value);setPg(1);}}>
              <option value="All">All Branches</option>
              {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="table">
            <thead><tr><th>Date</th><th>Customer</th><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Qty</th><th>Sell Price</th><th>Revenue</th><th>Profit</th></tr></thead>
            <tbody>
              {paged.map(s=>(
                <tr key={s.id}>
                  <td style={{ color:"#64748b", fontSize:12 }}>{s.date}</td>
                  <td style={{ fontSize:12.5 }}>{s.customer}</td>
                  <td style={{ fontWeight:600 }}>{s.productName}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={s.branchId} branches={branches} /></td>}
                  <td>{s.quantity}</td>
                  <td>{fmt(s.price)}</td>
                  <td style={{ fontWeight:700 }}>{fmt(s.price*s.quantity)}</td>
                  <td><span className={`badge ${s.profit>=0?"profit-badge":"loss-badge"}`}>{s.profit>=0?"+":""}{fmt(s.profit)}</span></td>
                </tr>
              ))}
              {paged.length===0&&<tr><td colSpan={9} style={{ textAlign:"center", color:"#94a3b8", padding:28 }}>No sales found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pg} total={filtered.length} perPage={PER} onChange={setPg} />
      </div>

      {modal && (
        <ModalWrap onClose={()=>setModal(false)}>
          <ModalHeader title="New Sale Entry" onClose={()=>setModal(false)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            {isSuperAdmin && (
              <div style={{ gridColumn:"1/-1" }}>
                <label className="label">Branch *</label>
                <select className="input" value={form.branchId} onChange={e=>setForm(f=>({...f,branchId:+e.target.value,productId:"",price:""}))}>
                  {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label">Customer Name</label>
              <input className="input" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))} placeholder="Walk-in Customer" />
            </div>
            <div>
              <label className="label">Sale Date *</label>
              <input className="input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Product *</label>
              <select className="input" value={form.productId} onChange={e=>setForm(f=>({...f,productId:e.target.value,price:availableProducts.find(p=>p.id===+e.target.value)?.sellingPrice||""}))}>
                <option value="">Select product</option>
                {availableProducts.map(p=><option key={p.id} value={p.id}>{p.name} ({p.brand}) — Stock: {p.stock}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input className="input" type="number" min="1" max={selProd?.stock||999} value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} />
              {selProd&&<div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>Available: {selProd.stock}</div>}
            </div>
            <div>
              <label className="label">Selling Price ₹ *</label>
              <input className="input" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
            </div>
            {form.quantity&&form.price&&selProd&&(
              <div style={{ gridColumn:"1/-1", background:"#f0fdf4", borderRadius:10, padding:12, border:"1px solid #bbf7d0" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, textAlign:"center" }}>
                  {[["Revenue",fmt(+form.price*(+form.quantity))],["Cost",fmt(selProd.purchasePrice*(+form.quantity))],["Profit",fmt((+form.price-selProd.purchasePrice)*(+form.quantity))]].map(([l,v])=>(
                    <div key={l}><div style={{ fontSize:11, color:"#64748b", marginBottom:2 }}>{l}</div><div style={{ fontWeight:800, fontSize:14 }}>{v}</div></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary"   style={{ flex:1 }} onClick={save}>Confirm Sale</button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
function Reports({ products, purchases, sales, scopedProducts, scopedPurchases, scopedSales, branches, isSuperAdmin }) {
  const [tab, setTab] = useState("stock");
  const [search, setSearch] = useState("");
  const [branchF, setBranchF] = useState("All");

  const bFilter = id => !isSuperAdmin||branchF==="All"||id===+branchF;
  const fProds  = (isSuperAdmin?products:scopedProducts).filter(p=>bFilter(p.branchId));
  const fSales  = (isSuperAdmin?sales:scopedSales).filter(s=>bFilter(s.branchId));
  const fPurch  = (isSuperAdmin?purchases:scopedPurchases).filter(p=>bFilter(p.branchId));

  const totalRevenue = fSales.reduce((a,s)=>a+s.price*s.quantity,0);
  const totalCost    = fSales.reduce((a,s)=>a+s.cost*s.quantity,0);
  const totalProfit  = fSales.reduce((a,s)=>a+s.profit,0);

  const tabs=[
    {key:"stock",label:"Current Stock"},{key:"lowstock",label:"Low Stock"},
    {key:"purchases",label:"Purchase History"},{key:"saleshistory",label:"Sales History"},
    {key:"profit",label:"Profit Summary"},
  ];

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <h1 className="page-title">Reports & Inventory</h1>
      </div>

      {tab==="profit"&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:13, marginBottom:18 }}>
          {[
            {label:"Revenue",      value:fmt(totalRevenue), color:"#0ea5e9"},
            {label:"COGS",         value:fmt(totalCost),    color:"#f59e0b"},
            {label:"Gross Profit", value:fmt(totalProfit),  color:"#10b981"},
            {label:"Margin",       value:totalRevenue?`${(totalProfit/totalRevenue*100).toFixed(1)}%`:"0%", color:"#8b5cf6"},
          ].map((s,i)=>(
            <div key={i} className="stat-card">
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{s.label}</div>
              <div style={{ fontSize:19, fontWeight:800, fontFamily:"'Sora',sans-serif", color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding:13, marginBottom:13, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
          {tabs.map(t=><button key={t.key} className={`tab ${tab===t.key?"active":""}`} onClick={()=>setTab(t.key)}>{t.label}</button>)}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {isSuperAdmin&&(
            <select className="input" style={{ maxWidth:170 }} value={branchF} onChange={e=>setBranchF(e.target.value)}>
              <option value="All">All Branches</option>
              {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
          <input className="input" style={{ maxWidth:200 }} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          {tab==="stock"&&(
            <table className="table">
              <thead><tr><th>Product</th><th>Brand</th>{isSuperAdmin&&<th>Branch</th>}<th>Category</th><th>Stock</th><th>Buy Price</th><th>Sell Price</th><th>Stock Value</th></tr></thead>
              <tbody>{fProds.filter(p=>!search||(p.name+p.brand+p.imei).toLowerCase().includes(search.toLowerCase())).map(p=>(
                <tr key={p.id}>
                  <td><div style={{ fontWeight:600 }}>{p.name}</div>{p.imei&&<div style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{p.imei}</div>}</td>
                  <td>{p.brand}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={p.branchId} branches={branches} /></td>}
                  <td><span className="badge" style={{ background:"#eef2ff", color:"#6366f1" }}>{p.category}</span></td>
                  <td><span className={`badge ${p.stock<=3?"loss-badge":"profit-badge"}`}>{p.stock}</span></td>
                  <td>{fmt(p.purchasePrice)}</td>
                  <td>{fmt(p.sellingPrice)}</td>
                  <td style={{ fontWeight:700 }}>{fmt(p.stock*p.sellingPrice)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab==="lowstock"&&(
            <table className="table">
              <thead><tr><th>Product</th><th>Brand</th>{isSuperAdmin&&<th>Branch</th>}<th>Category</th><th>Stock</th><th>Status</th></tr></thead>
              <tbody>{fProds.filter(p=>p.stock<=5).filter(p=>!search||(p.name+p.brand).toLowerCase().includes(search.toLowerCase())).map(p=>(
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td>{p.brand}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={p.branchId} branches={branches} /></td>}
                  <td><span className="badge" style={{ background:"#eef2ff", color:"#6366f1" }}>{p.category}</span></td>
                  <td><span className="badge loss-badge">{p.stock}</span></td>
                  <td><span className="badge" style={{ background:p.stock===0?"#1e1b4b":"#fff7ed", color:p.stock===0?"#e0e7ff":"#c2410c" }}>{p.stock===0?"Out of Stock":"Low Stock"}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab==="purchases"&&(
            <table className="table">
              <thead><tr><th>Date</th><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Supplier</th><th>Invoice</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
              <tbody>{[...fPurch].reverse().filter(p=>!search||(p.productName+p.supplier+p.invoice).toLowerCase().includes(search.toLowerCase())).map(p=>(
                <tr key={p.id}>
                  <td style={{ color:"#64748b", fontSize:12 }}>{p.date}</td>
                  <td style={{ fontWeight:600 }}>{p.productName}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={p.branchId} branches={branches} /></td>}
                  <td>{p.supplier}</td>
                  <td><span style={{ fontFamily:"monospace", fontSize:11.5, background:"#f8fafc", padding:"2px 6px", borderRadius:5 }}>{p.invoice}</span></td>
                  <td>{p.quantity}</td>
                  <td>{fmt(p.cost)}</td>
                  <td style={{ fontWeight:700 }}>{fmt(p.total)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab==="saleshistory"&&(
            <table className="table">
              <thead><tr><th>Date</th><th>Customer</th><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Qty</th><th>Price</th><th>Revenue</th><th>Profit</th></tr></thead>
              <tbody>{[...fSales].reverse().filter(s=>!search||(s.customer+s.productName).toLowerCase().includes(search.toLowerCase())).map(s=>(
                <tr key={s.id}>
                  <td style={{ color:"#64748b", fontSize:12 }}>{s.date}</td>
                  <td>{s.customer}</td>
                  <td style={{ fontWeight:600 }}>{s.productName}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={s.branchId} branches={branches} /></td>}
                  <td>{s.quantity}</td>
                  <td>{fmt(s.price)}</td>
                  <td style={{ fontWeight:700 }}>{fmt(s.price*s.quantity)}</td>
                  <td><span className={`badge ${s.profit>=0?"profit-badge":"loss-badge"}`}>{s.profit>=0?"+":""}{fmt(s.profit)}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {tab==="profit"&&(
            <table className="table">
              <thead><tr><th>Product</th>{isSuperAdmin&&<th>Branch</th>}<th>Units Sold</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>Margin</th></tr></thead>
              <tbody>{Object.values(fSales.reduce((acc,s)=>{
                const key=`${s.productId}-${s.branchId}`;
                if(!acc[key]) acc[key]={name:s.productName,branchId:s.branchId,qty:0,rev:0,cost:0,profit:0};
                acc[key].qty+=s.quantity; acc[key].rev+=s.price*s.quantity; acc[key].cost+=s.cost*s.quantity; acc[key].profit+=s.profit;
                return acc;
              },{})).filter(s=>!search||s.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.profit-a.profit).map((s,i)=>(
                <tr key={i}>
                  <td style={{ fontWeight:600 }}>{s.name}</td>
                  {isSuperAdmin&&<td><BranchBadge branchId={s.branchId} branches={branches} /></td>}
                  <td>{s.qty}</td>
                  <td>{fmt(s.rev)}</td>
                  <td>{fmt(s.cost)}</td>
                  <td><span className="badge profit-badge">{fmt(s.profit)}</span></td>
                  <td>{s.rev?`${(s.profit/s.rev*100).toFixed(1)}%`:"—"}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BRANCHES PAGE (super admin only) ────────────────────────────────────────
function BranchesPage({ branches, setBranches, users }) {
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({});

  const openAdd  = () => { setForm({ name:"", city:"", phone:"", address:"", active:true }); setModal("add"); };
  const openEdit = b => { setForm({...b}); setModal(b); };
  const save = () => {
    if(!form.name||!form.city) return;
    if(modal==="add") setBranches(bs=>[...bs,{...form,id:Date.now()}]);
    else setBranches(bs=>bs.map(b=>b.id===form.id?form:b));
    setModal(null);
  };
  const del  = id => { if(confirm("Delete this branch? This will not delete associated data.")) setBranches(bs=>bs.filter(b=>b.id!==id)); };
  const toggle = id => setBranches(bs=>bs.map(b=>b.id===id?{...b,active:!b.active}:b));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 className="page-title">Branches</h1>
          <p style={{ color:"#64748b", fontSize:13, marginTop:3 }}>Manage all shop branches and their details</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Ico d={icons.plus} size={14} color="#fff" /> Add Branch</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16, marginBottom:24 }}>
        {branches.map(b=>{
          const bUsers = users.filter(u=>u.branchId===b.id);
          const color  = branchColor(b.id);
          return (
            <div key={b.id} className="card" style={{ padding:20, borderTop:`3px solid ${color}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Ico d={icons.map} size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:14.5, color:"#0f172a" }}>{b.name}</div>
                    <div style={{ fontSize:12, color:"#64748b" }}>{b.city}</div>
                  </div>
                </div>
                <label className="switch" title={b.active?"Active":"Inactive"}>
                  <input type="checkbox" checked={b.active} onChange={()=>toggle(b.id)} />
                  <span className="slider" />
                </label>
              </div>
              <div style={{ fontSize:12.5, color:"#64748b", marginBottom:4 }}><span style={{ fontWeight:600 }}>📞</span> {b.phone||"—"}</div>
              <div style={{ fontSize:12.5, color:"#64748b", marginBottom:12 }}><span style={{ fontWeight:600 }}>📍</span> {b.address||"—"}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#94a3b8" }}>{bUsers.length} user{bUsers.length!==1?"s":""}</span>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="btn btn-secondary" style={{ padding:"5px 10px" }} onClick={()=>openEdit(b)}><Ico d={icons.edit} size={13} /></button>
                  <button className="btn btn-danger"    style={{ padding:"5px 10px" }} onClick={()=>del(b.id)}><Ico d={icons.trash} size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <ModalWrap onClose={()=>setModal(null)}>
          <ModalHeader title={modal==="add"?"Add New Branch":"Edit Branch"} onClose={()=>setModal(null)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Branch Name *</label>
              <input className="input" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Thrissur Branch" />
            </div>
            <div>
              <label className="label">City *</label>
              <input className="input" value={form.city||""} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="Thrissur" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="9876500000" />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Address</label>
              <textarea className="input" style={{ resize:"vertical", minHeight:70 }} value={form.address||""} onChange={e=>setForm(f=>({...f,address:e.target.value}))} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label className="switch">
                <input type="checkbox" checked={form.active!==false} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} />
                <span className="slider" />
              </label>
              <span style={{ fontSize:13, color:"#475569" }}>Branch Active</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary"   style={{ flex:1 }} onClick={save}>{modal==="add"?"Create Branch":"Save Changes"}</button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

// ─── USERS PAGE (super admin only) ───────────────────────────────────────────
function UsersPage({ users, setUsers, branches }) {
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({});
  const [showPw, setShowPw] = useState(false);

  const openAdd  = () => { setForm({ name:"", username:"", password:"", email:"", role:"branch", branchId:branches[0]?.id||1, active:true }); setModal("add"); };
  const openEdit = u => { setForm({...u}); setModal(u); };
  const save = () => {
    if(!form.name||!form.username||!form.password) return;
    if(modal==="add") {
      if(users.find(u=>u.username===form.username)) { alert("Username already taken"); return; }
      setUsers(us=>[...us,{...form,id:Date.now(),branchId:form.role==="superadmin"?null:+form.branchId}]);
    } else {
      setUsers(us=>us.map(u=>u.id===form.id?{...form,branchId:form.role==="superadmin"?null:+form.branchId}:u));
    }
    setModal(null);
  };
  const del    = id => { if(id===1){alert("Cannot delete main admin");return;} if(confirm("Delete user?")) setUsers(us=>us.filter(u=>u.id!==id)); };
  const toggle = id => { if(id===1){alert("Cannot deactivate main admin");return;} setUsers(us=>us.map(u=>u.id===id?{...u,active:!u.active}:u)); };

  const roleColor = r => r==="superadmin"?{bg:"#fef3c7",color:"#d97706"}:{bg:"#eef2ff",color:"#6366f1"};

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 className="page-title">Users & Access</h1>
          <p style={{ color:"#64748b", fontSize:13, marginTop:3 }}>Manage login accounts and branch assignments</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Ico d={icons.plus} size={14} color="#fff" /> Add User</button>
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="table">
            <thead><tr><th>User</th><th>Username</th><th>Role</th><th>Branch</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>{
                const branch = u.branchId ? branches.find(b=>b.id===u.branchId) : null;
                const rc = roleColor(u.role);
                const initials = u.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
                const color = branchColor(u.branchId||1);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${color},${branchColor((u.branchId||1)+1)})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, flexShrink:0 }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13 }}>{u.name}</div>
                          <div style={{ fontSize:11, color:"#94a3b8" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize:12.5, background:"#f8fafc", padding:"2px 8px", borderRadius:5 }}>{u.username}</code></td>
                    <td><span className="badge" style={{ background:rc.bg, color:rc.color }}>{u.role==="superadmin"?"Super Admin":"Branch Manager"}</span></td>
                    <td>{branch ? <BranchBadge branchId={branch.id} branches={branches} /> : <span style={{ color:"#94a3b8", fontSize:12 }}>All Branches</span>}</td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={u.active} onChange={()=>toggle(u.id)} />
                        <span className="slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:5 }}>
                        <button className="btn btn-secondary" style={{ padding:"5px 9px" }} onClick={()=>openEdit(u)}><Ico d={icons.edit} size={13} /></button>
                        <button className="btn btn-danger"    style={{ padding:"5px 9px" }} onClick={()=>del(u.id)}><Ico d={icons.trash} size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ModalWrap onClose={()=>setModal(null)}>
          <ModalHeader title={modal==="add"?"Add New User":"Edit User"} onClose={()=>setModal(null)} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Full Name *</label>
              <input className="input" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Arun Menon" />
            </div>
            <div>
              <label className="label">Username *</label>
              <input className="input" value={form.username||""} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="thrissur_mgr" />
            </div>
            <div>
              <label className="label">Password *</label>
              <div style={{ position:"relative" }}>
                <input className="input" type={showPw?"text":"password"} style={{ paddingRight:36 }} value={form.password||""} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" />
                <button onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer" }}>
                  <Ico d={showPw?icons.eyeOff:icons.eye} size={15} color="#94a3b8" />
                </button>
              </div>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email||""} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="user@mobitrack.in" />
            </div>
            <div>
              <label className="label">Role *</label>
              <select className="input" value={form.role||"branch"} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="branch">Branch Manager</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            {form.role!=="superadmin" && (
              <div>
                <label className="label">Assign Branch *</label>
                <select className="input" value={form.branchId||""} onChange={e=>setForm(f=>({...f,branchId:+e.target.value}))}>
                  {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label className="switch">
                <input type="checkbox" checked={form.active!==false} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} />
                <span className="slider" />
              </label>
              <span style={{ fontSize:13, color:"#475569" }}>Account Active</span>
            </div>
          </div>
          {form.role==="superadmin" && (
            <div style={{ marginTop:12, padding:10, background:"#fffbeb", borderRadius:8, border:"1px solid #fcd34d", fontSize:12.5, color:"#92400e" }}>
              ⚠️ Super Admin can access all branches and manage users.
            </div>
          )}
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary"   style={{ flex:1 }} onClick={save}>{modal==="add"?"Create User":"Save Changes"}</button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings({ session, isSuperAdmin }) {
  const [shop, setShop] = useState({ name:"MobiTrack Store", phone:"9876543210", address:"123 Main Street, Kochi, Kerala", gst:"29ABCDE1234F1Z5", currency:"₹" });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),3000); };

  return (
    <div>
      <div style={{ marginBottom:20 }}><h1 className="page-title">Settings</h1></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:18 }}>
        <div className="card" style={{ padding:22 }}>
          <h2 className="section-title" style={{ marginBottom:14 }}>Shop Information</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[{key:"name",label:"Shop Name",type:"text"},{key:"phone",label:"Phone",type:"tel"},{key:"gst",label:"GST Number",type:"text"},{key:"currency",label:"Currency Symbol",type:"text"}].map(f=>(
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input" type={f.type} value={shop[f.key]} onChange={e=>setShop(s=>({...s,[f.key]:e.target.value}))} />
              </div>
            ))}
            <div>
              <label className="label">Address</label>
              <textarea className="input" style={{ resize:"vertical", minHeight:72 }} value={shop.address} onChange={e=>setShop(s=>({...s,address:e.target.value}))} />
            </div>
            <button className="btn btn-primary" onClick={save} style={{ justifyContent:"center" }}>
              {saved?<><Ico d={icons.check} size={14} color="#fff" /> Saved!</>:"Save Settings"}
            </button>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="card" style={{ padding:22 }}>
            <h2 className="section-title" style={{ marginBottom:14 }}>Change Password</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {["Current Password","New Password","Confirm Password"].map(l=>(
                <div key={l}><label className="label">{l}</label><input className="input" type="password" placeholder="••••••••" /></div>
              ))}
              <button className="btn btn-secondary" style={{ justifyContent:"center" }}>Update Password</button>
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <h2 className="section-title" style={{ marginBottom:10 }}>Low Stock Threshold</h2>
            <p style={{ fontSize:13, color:"#64748b", marginBottom:10 }}>Alert when stock falls at or below:</p>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <input className="input" type="number" defaultValue="3" style={{ maxWidth:90 }} />
              <span style={{ fontSize:13, color:"#64748b" }}>units</span>
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <h2 className="section-title" style={{ marginBottom:10 }}>Your Account</h2>
            {[["Name",session?.user?.name],["Username",session?.user?.username],["Role",session?.user?.role==="superadmin"?"Super Admin":"Branch Manager"],["Access",isSuperAdmin?"All Branches":session?.branch?.name||"—"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9", fontSize:13 }}>
                <span style={{ color:"#64748b" }}>{k}</span>
                <span style={{ fontWeight:600, color:"#0f172a" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
