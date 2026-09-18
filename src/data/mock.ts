export type Relationship = "Connected" | "Request Pending" | "Request Access";
export type Product = { id:string; name:string; brand:string; category:string; wholesalerId:string; price:number; mrp:number; moq:number; stock:number; rating:number; image:number; description:string; specs:Record<string,string> };
export type Wholesaler = { id:string; name:string; initials:string; verified:boolean; rating:number; location:string; products:number; categories:string[]; delivery:string; relationship:Relationship; about:string };
export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type Order = { id:string; date:string; status:OrderStatus; wholesalerId:string; total:number; items:{productId:string; quantity:number}[] };
export type RetailerProfile = { businessName:string; ownerName:string; phone:string; email:string; gstRegistered:boolean; gstNumber:string; businessType:string; category:string; address:string; city:string; state:string; pincode:string };
export const defaultRetailerProfile: RetailerProfile = { businessName:"Kapoor General Store", ownerName:"Amit Kapoor", phone:"+91 98765 43210", email:"amit@kapoorgeneral.example", gstRegistered:true, gstNumber:"06AABCK1234M1ZP", businessType:"Independent retailer", category:"Grocery & Staples", address:"18 Market Road", city:"Gurugram", state:"Haryana", pincode:"122001" };

export const categories = [
  ["Grocery & Staples","Rice, pulses, oils and pantry goods"],["Beverages","Tea, coffee, juices and hydration"],["Snacks & Foods","Fast-moving packaged foods"],["Home Care","Cleaning and household essentials"],["Personal Care","Everyday wellness and grooming"],["Kitchenware","Reliable tools for every kitchen"],["Stationery","Office and school supplies"],["Electricals","Appliances and daily utilities"],["Packaging","Retail-ready packing materials"],["Health & Wellness","Trusted everyday health products"],
].map(([name, description],i)=>({id:String(i+1),name,description,count:68+i*17}));

export const wholesalers: Wholesaler[] = [
 {id:"sharma",name:"Sharma Distributors",initials:"SD",verified:true,rating:4.8,location:"New Delhi",products:342,categories:["Grocery & Staples","Snacks & Foods"],delivery:"1–2 day delivery",relationship:"Connected",about:"A trusted FMCG distribution partner serving independent retailers for over 18 years."},
 {id:"gupta",name:"Gupta Wholesale Co.",initials:"GW",verified:true,rating:4.7,location:"Gurugram, Haryana",products:286,categories:["Home Care","Personal Care"],delivery:"Free over ₹15,000",relationship:"Connected",about:"Direct sourcing, dependable fulfillment and competitive wholesale pricing."},
 {id:"orbit",name:"Orbit Trade Links",initials:"OT",verified:true,rating:4.9,location:"Mumbai, Maharashtra",products:198,categories:["Electricals","Kitchenware"],delivery:"2–4 day delivery",relationship:"Request Pending",about:"Quality-tested appliances and kitchen essentials from leading manufacturers."},
 {id:"sunrise",name:"Sunrise Foods Network",initials:"SF",verified:true,rating:4.6,location:"Jaipur, Rajasthan",products:415,categories:["Snacks & Foods","Beverages"],delivery:"Next-day dispatch",relationship:"Request Access",about:"Regional food and beverage specialists with broad brand coverage."},
 {id:"paperlane",name:"Paperlane Supply House",initials:"PS",verified:true,rating:4.7,location:"Bengaluru, Karnataka",products:164,categories:["Stationery","Packaging"],delivery:"2–3 day delivery",relationship:"Connected",about:"Workplace, school and retail packaging supplies with consistent stock."},
 {id:"greenway",name:"Greenway Essentials",initials:"GE",verified:false,rating:4.4,location:"Pune, Maharashtra",products:129,categories:["Health & Wellness","Personal Care"],delivery:"3–5 day delivery",relationship:"Request Access",about:"Thoughtfully sourced wellness and everyday personal care products."},
 {id:"metro",name:"Metro Cash Network",initials:"MC",verified:true,rating:4.8,location:"Hyderabad, Telangana",products:528,categories:["Grocery & Staples","Home Care"],delivery:"Free over ₹20,000",relationship:"Connected",about:"Large-format wholesale assortment with reliable pan-city logistics."},
 {id:"northstar",name:"Northstar Merchants",initials:"NM",verified:true,rating:4.5,location:"Chandigarh",products:223,categories:["Beverages","Kitchenware"],delivery:"2–4 day delivery",relationship:"Request Pending",about:"Curated premium goods and responsive retailer support."},
];
const fallbackWholesaler = wholesalers[0];
if (!fallbackWholesaler) throw new Error("Mock wholesaler data is empty");

const names = [
 ["Classic Electric Kettle 1.7L","Vesta","Electricals",899,1499,4,38],["Premium Snack Variety Carton","Munchery","Snacks & Foods",1180,1699,6,82],["Vacuum Flask Twin Pack","TerraSip","Kitchenware",760,1199,8,46],["Hardbound Notebook Set","Paperwell","Stationery",420,699,10,120],["Adjustable LED Desk Lamp","Luma","Electricals",675,1099,5,29],["Plant-Based Home Care Kit","PureNest","Home Care",540,899,6,64],
 ["Basmati Rice Premium 10kg","Royal Fields","Grocery & Staples",920,1299,5,55],["Cold Pressed Mustard Oil 5L","Harvest Gold","Grocery & Staples",710,949,4,32],["Masala Chai Retail Pack","Chaigram","Beverages",360,540,12,140],["Fruit Juice Mixed Case","Orchard Day","Beverages",840,1140,4,21],["Herbal Hand Wash Case","PureNest","Personal Care",610,840,6,76],["Daily Shampoo 12-Pack","Serein","Personal Care",1080,1540,3,44],
 ["Corrugated Shipping Inventory2","Packsmith","Packaging",580,820,20,190],["Paper Carry Bags Bundle","EcoFold","Packaging",340,500,25,250],["Gel Pen Counter Display","WritePro","Stationery",480,720,10,95],["A4 Copier Paper Carton","Paperwell","Stationery",1320,1650,3,28],["Non-Stick Cookware Set","Vesta","Kitchenware",1440,2199,2,18],["Stainless Storage Set","TerraSip","Kitchenware",820,1299,4,52],
 ["Floor Cleaner 5L Case","PureNest","Home Care",690,960,4,66],["Laundry Liquid Twin Pack","KleenCo","Home Care",510,760,6,88],["Turmeric Powder 1kg Pack","Spice Route","Grocery & Staples",285,390,10,130],["Roasted Nuts Gift Carton","Munchery","Snacks & Foods",1490,1990,3,16],["Protein Snack Bars Case","VitalBite","Health & Wellness",1280,1799,4,34],["Vitamin C Tablets 6-Pack","Wellwise","Health & Wellness",780,1140,6,49],
 ["Ceramic Mug Set of 12","Clay & Co.","Kitchenware",960,1499,3,27],["Extension Board 4-Socket","Luma","Electricals",390,649,8,68],["Instant Coffee Jar Case","Chaigram","Beverages",1160,1480,4,39],["Sparkling Water 24-Pack","TerraSip","Beverages",620,840,5,74],["Facial Tissue Bulk Case","KleenCo","Personal Care",740,990,6,84],["Natural Soap Retail Box","Greenway","Personal Care",680,960,8,102],
 ["Retail Billing Rolls Pack","Paperlane","Stationery",310,450,20,230],["Food Storage Containers","Packsmith","Packaging",860,1240,4,57],["Whole Wheat Biscuits Case","Munchery","Snacks & Foods",920,1260,5,72],["Organic Lentils Mixed Case","Royal Fields","Grocery & Staples",1040,1390,4,43],["First Aid Retail Kit","Wellwise","Health & Wellness",570,850,5,61],["Cotton Tote Bags Bundle","EcoFold","Packaging",780,1080,10,90],
] as const;
 export const products: Product[] = names.map((p,i)=>({id:`p${i+1}`,name:p[0],brand:p[1],category:p[2],wholesalerId:wholesalers[i%wholesalers.length]?.id ?? fallbackWholesaler.id,price:p[3],mrp:p[4],moq:p[5],stock:p[6],rating:Number((4.2+(i%8)/10).toFixed(1)),image:i%6,description:`Retail-ready ${p[0].toLowerCase()} with dependable quality and consistent wholesale availability. Ideal for fast-moving neighborhood stores.`,specs:{"Pack size":`${p[5]} units`,"Dispatch":"Within 24 hours","Country of origin":"India","Shelf life":"12 months"}}));
export const orders: Order[] = [
 {id:"NX-240918",date:"18 Sep 2026",status:"Processing",wholesalerId:"sharma",total:8460,items:[{productId:"p2",quantity:6},{productId:"p7",quantity:5}]},
 {id:"NX-240902",date:"14 Sep 2026",status:"Shipped",wholesalerId:"gupta",total:6220,items:[{productId:"p6",quantity:6},{productId:"p11",quantity:6}]},
 {id:"NX-240881",date:"10 Sep 2026",status:"Confirmed",wholesalerId:"paperlane",total:3960,items:[{productId:"p16",quantity:3}]},
 {id:"NX-240754",date:"02 Sep 2026",status:"Delivered",wholesalerId:"metro",total:10450,items:[{productId:"p8",quantity:5},{productId:"p19",quantity:4}]},
 {id:"NX-240711",date:"26 Aug 2026",status:"Delivered",wholesalerId:"sharma",total:7180,items:[{productId:"p21",quantity:10},{productId:"p33",quantity:5}]},
 {id:"NX-240650",date:"18 Aug 2026",status:"Cancelled",wholesalerId:"orbit",total:2880,items:[{productId:"p17",quantity:2}]},
 {id:"NX-240601",date:"12 Aug 2026",status:"Pending",wholesalerId:"northstar",total:5360,items:[{productId:"p28",quantity:5}]},
 {id:"NX-240544",date:"05 Aug 2026",status:"Delivered",wholesalerId:"gupta",total:4520,items:[{productId:"p29",quantity:6}]},
 {id:"NX-240498",date:"29 Jul 2026",status:"Delivered",wholesalerId:"metro",total:8920,items:[{productId:"p34",quantity:4}]},
];
export const notifications = [
 {id:"n1",title:"Order NX-240902 has shipped",body:"Gupta Wholesale Co. expects delivery by 20 Sep.",time:"12 min ago",unread:true},
 {id:"n2",title:"Access request approved",body:"You can now shop the full Paperlane Supply House catalogue.",time:"2 hours ago",unread:true},
 {id:"n3",title:"Price drop on your wishlist",body:"Classic Electric Kettle is now ₹899 per unit.",time:"Yesterday",unread:true},
 {id:"n4",title:"Order delivered",body:"Your Metro Cash Network order was delivered successfully.",time:"2 days ago",unread:false},
];
export const addresses = [
 {id:"a1",label:"Main Store",name:"Kapoor General Store",line:"18 Market Road, Sector 15, Gurugram, Haryana 122001",phone:"+91 98765 43210",primary:true},
 {id:"a2",label:"Warehouse",name:"Kapoor Retail Warehouse",line:"Plot 42, Udyog Vihar Phase IV, Gurugram, Haryana 122015",phone:"+91 98765 43210",primary:false},
];
export const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fallbackProduct = products[0];
if (!fallbackProduct) throw new Error("Mock product data is empty");
export const getWholesaler=(id:string):Wholesaler=>wholesalers.find(w=>w.id===id) ?? fallbackWholesaler;
export const getProduct=(id:string):Product=>products.find(p=>p.id===id) ?? fallbackProduct;
