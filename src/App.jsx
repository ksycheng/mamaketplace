import { useState, useEffect, useRef } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://vbjosjlknavqpvkjkyyg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiam9zamxrbmF2cXB2a2preXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTExOTcsImV4cCI6MjA5NDQ2NzE5N30.j7DJh27lk-Nr5H8NL44Ra376jA9fdr5Mto91q2KzprE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { id: "clothing", label: "Clothing & Shoes", emoji: "👕", color: "#F4845F", bg: "#FEE8E2" },
  { id: "toys", label: "Toys & Games", emoji: "🧸", color: "#6BBF7A", bg: "#E8F7EC" },
  { id: "furniture", label: "Furniture", emoji: "🪑", color: "#7B8FD4", bg: "#EEF1FB" },
  { id: "gear", label: "Gear & Strollers", emoji: "🛻", color: "#F7C948", bg: "#FEF8E2" },
  { id: "books", label: "Books & Learning", emoji: "📚", color: "#C0392B", bg: "#FDECEA" },
  { id: "classes", label: "Classes & Tutoring", emoji: "🎨", color: "#9B59B6", bg: "#F5EEF8" },
  { id: "camps", label: "Camps & Activities", emoji: "⛺", color: "#16A085", bg: "#E8F8F5" },
  { id: "parties", label: "Party & Events", emoji: "🎉", color: "#E67E22", bg: "#FEF0E7" },
  { id: "other", label: "Other", emoji: "📦", color: "#888780", bg: "#F5F5F5" },
];

const CONDITIONS = ["Brand new", "Like new", "Gently used", "Well loved"];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FDF9F4; font-family: 'Nunito', sans-serif; color: #2C2C2A; }
  :root {
    --coral: #F4845F; --coral-dark: #D4613C; --coral-light: #FEE8E2;
    --green: #6BBF7A; --green-dark: #4A9E59; --green-light: #E8F7EC;
    --yellow: #F7C948; --cream: #FDF9F4; --card: #ffffff;
    --border: #E8E0D8; --text: #2C2C2A; --muted: #888780;
    --shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  }
  .fade-in { animation: fadeIn 0.4s ease both; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .slide-up { animation: slideUp 0.3s ease both; }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:12px; padding:12px 24px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.18s; }
  .btn-primary { background:var(--coral); color:#fff; box-shadow:0 4px 14px rgba(244,132,95,0.35); }
  .btn-primary:hover { background:var(--coral-dark); transform:translateY(-1px); box-shadow:0 6px 20px rgba(244,132,95,0.4); }
  .btn-primary:disabled { background:#ccc; box-shadow:none; cursor:not-allowed; transform:none; }
  .btn-outline { background:#fff; color:var(--coral); border:2px solid var(--coral); }
  .btn-outline:hover { background:var(--coral-light); }
  .btn-ghost { background:none; color:var(--muted); border:1.5px solid var(--border); border-radius:10px; padding:10px 18px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.18s; }
  .btn-ghost:hover { border-color:var(--coral); color:var(--coral); }
  .input { width:100%; border:2px solid var(--border); border-radius:12px; padding:12px 16px; font-size:15px; font-family:'Nunito',sans-serif; background:#fff; color:var(--text); outline:none; transition:border 0.18s; font-weight:500; }
  .input:focus { border-color:var(--coral); }
  .card { background:var(--card); border-radius:16px; border:1px solid var(--border); box-shadow:var(--shadow); }
  .tag { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:700; }
  .nav { background:#fff; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .nav-inner { max-width:1100px; margin:0 auto; padding:0 24px; display:flex; align-items:center; height:64px; gap:16px; }
  .nav-logo { font-family:'Fredoka One',cursive; font-size:24px; color:var(--coral); cursor:pointer; flex-shrink:0; }
  .nav-links { display:flex; gap:4px; flex:1; }
  .nav-link { padding:8px 16px; border-radius:10px; font-size:14px; font-weight:700; color:var(--muted); cursor:pointer; transition:all 0.18s; border:none; background:none; font-family:'Nunito',sans-serif; }
  .nav-link:hover, .nav-link.active { background:var(--coral-light); color:var(--coral); }
  .main { max-width:1100px; margin:0 auto; padding:24px; }
  .hero { background:linear-gradient(135deg, #FEE8E2 0%, #FDF9F4 50%, #E8F7EC 100%); border-radius:24px; padding:56px 48px; text-align:center; margin-bottom:32px; position:relative; overflow:hidden; }
  .hero h1 { font-family:'Fredoka One',cursive; font-size:48px; color:var(--coral); line-height:1.1; margin-bottom:12px; }
  .hero p { font-size:18px; color:var(--muted); font-weight:600; margin-bottom:32px; max-width:560px; margin-left:auto; margin-right:auto; }
  .search-bar { display:flex; gap:8px; max-width:600px; margin:0 auto; }
  .listing-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:20px; }
  .listing-card { background:#fff; border-radius:16px; border:1px solid var(--border); box-shadow:var(--shadow); overflow:hidden; cursor:pointer; transition:all 0.2s; }
  .listing-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
  .listing-img { width:100%; height:180px; object-fit:cover; background:#f0ebe0; display:flex; align-items:center; justify-content:center; font-size:56px; position:relative; }
  .listing-body { padding:14px; }
  .listing-title { font-size:15px; font-weight:800; margin-bottom:4px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .listing-price { font-size:20px; font-weight:900; color:var(--coral); margin-bottom:6px; }
  .listing-meta { font-size:12px; color:var(--muted); font-weight:600; }
  .cat-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:12px; margin-bottom:32px; }
  .cat-btn { border:2px solid transparent; border-radius:14px; padding:14px 8px; text-align:center; cursor:pointer; transition:all 0.18s; background:#fff; font-family:'Nunito',sans-serif; }
  .cat-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow); }
  .cat-btn.active { border-color:var(--coral); }
  .cat-emoji { font-size:28px; margin-bottom:4px; }
  .cat-label { font-size:11px; font-weight:800; color:var(--muted); }
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:#fff; border-radius:20px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; padding:32px; position:relative; }
  .modal-close { position:absolute; top:20px; right:20px; background:none; border:none; font-size:24px; cursor:pointer; color:var(--muted); line-height:1; }
  .msg-list { display:flex; flex-direction:column; gap:2px; }
  .msg-row { display:flex; gap:8px; align-items:flex-end; margin-bottom:8px; }
  .msg-row.mine { flex-direction:row-reverse; }
  .msg-bubble { max-width:70%; padding:10px 14px; border-radius:18px; font-size:14px; font-weight:600; line-height:1.4; }
  .msg-bubble.theirs { background:#f0ebe0; color:var(--text); border-bottom-left-radius:4px; }
  .msg-bubble.mine { background:var(--coral); color:#fff; border-bottom-right-radius:4px; }
  .avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0; }
  .section-title { font-family:'Fredoka One',cursive; font-size:26px; color:var(--text); margin-bottom:20px; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:800; }
  .story-card { background:linear-gradient(135deg, #FEE8E2, #FDF9F4); border-radius:20px; padding:40px; margin-bottom:32px; border:1px solid var(--border); }
  .form-label { font-size:13px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:block; }
  .form-group { margin-bottom:18px; }
  .select { width:100%; border:2px solid var(--border); border-radius:12px; padding:12px 16px; font-size:15px; font-family:'Nunito',sans-serif; background:#fff; color:var(--text); outline:none; transition:border 0.18s; font-weight:600; cursor:pointer; }
  .select:focus { border-color:var(--coral); }
  .textarea { width:100%; border:2px solid var(--border); border-radius:12px; padding:12px 16px; font-size:15px; font-family:'Nunito',sans-serif; background:#fff; color:var(--text); outline:none; transition:border 0.18s; font-weight:500; resize:vertical; min-height:100px; }
  .textarea:focus { border-color:var(--coral); }
  .conv-item { padding:14px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.15s; display:flex; gap:12px; align-items:center; }
  .conv-item:hover { background:#FDF9F4; }
  .conv-item.active { background:var(--coral-light); }
  .error-box { background:#FEE8E2; border:1px solid #F4845F; border-radius:10px; padding:12px 16px; color:#C0392B; font-size:14px; font-weight:700; margin-bottom:16px; }
  .success-box { background:#E8F7EC; border:1px solid #6BBF7A; border-radius:10px; padding:12px 16px; color:#2E7D32; font-size:14px; font-weight:700; margin-bottom:16px; }
  .tab-bar { display:flex; gap:4px; background:#f0ebe0; border-radius:12px; padding:4px; margin-bottom:24px; }
  .tab { flex:1; padding:10px; border-radius:10px; border:none; background:none; font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; color:var(--muted); cursor:pointer; transition:all 0.18s; }
  .tab.active { background:#fff; color:var(--coral); box-shadow:0 1px 4px rgba(0,0,0,0.1); }
  .spinner { display:inline-block; width:20px; height:20px; border:3px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .footer { background:#2C2C2A; color:#F7F3EE; padding:40px 24px; margin-top:64px; text-align:center; }
  .footer h3 { font-family:'Fredoka One',cursive; font-size:28px; color:var(--coral); margin-bottom:8px; }
  .footer p { font-size:14px; color:#888780; font-weight:600; margin-bottom:4px; }
  @media(max-width:600px) {
    .hero { padding:32px 24px; }
    .hero h1 { font-size:32px; }
    .search-bar { flex-direction:column; }
    .nav-links { display:none; }
    .listing-grid { grid-template-columns:1fr 1fr; gap:12px; }
  }
  .toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%); background:#2C2C2A; color:#fff; padding:14px 28px; border-radius:99px; font-size:15px; font-weight:700; z-index:999; box-shadow:0 8px 32px rgba(0,0,0,0.2); animation:toastIn 0.3s ease both; font-family:'Nunito',sans-serif; display:flex; align-items:center; gap:8px; }
  @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
`;

function Avatar({ name, size = 32, bg = "#F4845F" }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function ListingCard({ listing, onClick }) {
  const cat = CATEGORIES.find(c => c.id === listing.category) || CATEGORIES[8];
  return (
    <div className="listing-card fade-in" onClick={() => onClick(listing)}>
      <div className="listing-img" style={{ background: cat.bg }}>
        {listing.image_url
          ? <img src={listing.image_url} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span>{cat.emoji}</span>}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          {listing.type === "trade" && <span style={{ background: "#7B8FD4", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 99, fontFamily: "'Nunito',sans-serif" }}>🔄 TRADE</span>}
          {(listing.type === "free" || listing.is_free) && <span style={{ background: "#6BBF7A", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 99, fontFamily: "'Nunito',sans-serif" }}>🎁 FREE</span>}
          {listing.type === "sell" && <span style={{ background: "#F4845F", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 99, fontFamily: "'Nunito',sans-serif" }}>💰 SALE</span>}
        </div>
      </div>
      <div className="listing-body">
        <div className="listing-title">{listing.title}</div>
        <div className="listing-price">
          {listing.type === "free" || listing.is_free ? <span style={{ color: "#6BBF7A" }}>FREE</span> : listing.type === "trade" ? <span style={{ color: "#7B8FD4" }}>Trade</span> : `$${listing.price} CAD`}
        </div>
        <div className="listing-meta">
          <span>{cat.emoji} {cat.label}</span>
          <span style={{ margin: "0 6px" }}>·</span>
          <span>📍 {listing.location || "Canada"}</span>
        </div>
        {listing.condition && (
          <div style={{ marginTop: 6 }}>
            <span className="badge" style={{ background: cat.bg, color: cat.color }}>{listing.condition}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("splash");
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToast] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postCat, setPostCat] = useState("clothing");
  const [postCond, setPostCond] = useState("Gently used");
  const [postLocation, setPostLocation] = useState("");
  const [postFree, setPostFree] = useState(false);
  const [postType, setPostType] = useState("sell");
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postErr, setPostErr] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); fetchProfile(session.user.id); }
      else setTimeout(() => setScreen("main"), 1200);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      if (session) { setUser(session.user); fetchProfile(session.user.id); }
      else { setUser(null); setProfile(null); setScreen("main"); }
    });
    fetchListings();
  }, []);

  useEffect(() => {
    if (msgEndRef.current) msgEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let filtered = listings;
    if (selectedCat !== "all") filtered = filtered.filter(l => l.category === selectedCat);
    if (searchQ.trim()) filtered = filtered.filter(l => l.title.toLowerCase().includes(searchQ.toLowerCase()) || (l.description || "").toLowerCase().includes(searchQ.toLowerCase()));
    setFilteredListings(filtered);
  }, [listings, selectedCat, searchQ]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchUnreadCount = async (uid) => {
    const { data: convs } = await supabase.from("conversations").select("id, last_message_read_at, updated_at, user1_id, user2_id").or(`user1_id.eq.${uid},user2_id.eq.${uid}`);
    if (convs) {
      const unread = convs.filter(c => {
        if (!c.updated_at) return false;
        if (!c.last_message_read_at) return false;
        return new Date(c.updated_at) > new Date(c.last_message_read_at);
      }).length;
      setUnreadCount(unread);
    }
  };

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    setScreen("main");
    fetchUnreadCount(uid);
    // Real-time subscription for new messages
    supabase.channel("messages-channel").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      if (payload.new.sender_id !== uid) {
        showToast("💬 You have a new message!");
        fetchUnreadCount(uid);
      }
    }).subscribe();
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    const { data } = await supabase.from("listings").select("*").eq("active", true).order("created_at", { ascending: false });
    if (data) { setListings(data); setFilteredListings(data); }
    setLoadingListings(false);
  };

  const fetchMyListings = async () => {
    if (!user) return;
    const { data } = await supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setMyListings(data);
  };

  const fetchConversations = async () => {
    if (!user) return;
    const { data } = await supabase.from("conversations").select("*, listing:listings(title,category), other_user:profiles!conversations_other_user_id_fkey(id,name)").or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`).order("updated_at", { ascending: false });
    if (data) setConversations(data);
  };

  const fetchMessages = async (convId) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) setMessages(data);
    // Mark conversation as read
    await supabase.from("conversations").update({ last_message_read_at: new Date().toISOString() }).eq("id", convId);
    if (user) fetchUnreadCount(user.id);
  };

  const handleLogin = async () => {
    setAuthErr(""); setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPass });
    if (error) setAuthErr("Invalid email or password.");
    else { setPage("home"); showToast("👋 Welcome back! You're signed in."); }
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    if (!authName || !authEmail || !authPass) { setAuthErr("Please fill in all fields."); return; }
    setAuthErr(""); setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPass });
    if (error) { setAuthErr(error.message); setAuthLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, name: authName, email: authEmail.trim() });
      setUser(data.user); setProfile({ id: data.user.id, name: authName });
      setScreen("main"); setPage("home");
      showToast("🎉 Welcome to Mamaketplace, " + authName + "!");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setPage("home");
  };

  const handlePost = async () => {
    if (!postTitle.trim()) { setPostErr("Please enter a title."); return; }
    if (!postLocation.trim()) { setPostErr("Please enter your city/location."); return; }
    if (!postDesc.trim()) { setPostErr("Please add a description."); return; }
    if (postType === "sell" && !postPrice) { setPostErr("Please enter a price."); return; }
    if (postType === "trade" && !postPrice.trim()) { setPostErr("Please enter what you're looking to trade for."); return; }
    setPostErr(""); setPostLoading(true);
    let image_url = null;
    if (postImage) {
      const ext = postImage.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("listings").upload(fileName, postImage);
      if (!uploadErr) {
        const { data } = supabase.storage.from("listings").getPublicUrl(fileName);
        image_url = data.publicUrl;
      }
    }
    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      seller_name: profile?.name || user.email,
      title: postTitle,
      description: postDesc,
      price: postType === "free" ? 0 : postType === "trade" ? 0 : parseFloat(postPrice),
      is_free: postType === "free",
      category: postCat,
      condition: postCond,
      location: postLocation,
      type: postType,
      trade_for: postType === "trade" ? postPrice : null,
      image_url,
      active: true,
    });
    if (!error) {
      setPostSuccess("🎉 Listing posted successfully!");
      setPostTitle(""); setPostDesc(""); setPostPrice(""); setPostLocation(""); setPostFree(false); setPostImage(null); setPostImagePreview(null);
      await fetchListings();
      showToast("🎉 Your listing is live!");
      setTimeout(() => { setShowPostModal(false); setPostSuccess(""); setPage("home"); }, 1500);
    } else { setPostErr("Failed to post. Please try again."); }
    setPostLoading(false);
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    await supabase.from("listings").update({ active: false }).eq("id", id);
    fetchMyListings(); fetchListings();
    showToast("Listing deleted.");
  };

  const [editListing, setEditListing] = useState(null);

  const handleEditSave = async () => {
    if (!editListing.title.trim()) { alert("Title is required."); return; }
    if (!editListing.location.trim()) { alert("Location is required."); return; }
    await supabase.from("listings").update({
      title: editListing.title,
      description: editListing.description,
      price: editListing.type === "sell" ? parseFloat(editListing.price) : 0,
      location: editListing.location,
      condition: editListing.condition,
      category: editListing.category,
    }).eq("id", editListing.id);
    setEditListing(null);
    fetchMyListings(); fetchListings();
    showToast("Listing updated!");
  };

  const startConversation = async (listing) => {
    if (!user) { setPage("auth"); return; }
    if (listing.user_id === user.id) { alert("This is your own listing!"); return; }
    const { data: existing } = await supabase.from("conversations").select("*").eq("listing_id", listing.id).eq("user1_id", user.id).single();
    if (existing) {
      setSelectedConv(existing); fetchMessages(existing.id); setPage("messages"); setSelectedListing(null); return;
    }
    const { data: newConv } = await supabase.from("conversations").insert({ listing_id: listing.id, user1_id: user.id, user2_id: listing.user_id, other_user_id: listing.user_id }).select().single();
    if (newConv) { setSelectedConv(newConv); setMessages([]); setPage("messages"); setSelectedListing(null); }
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || !selectedConv) return;
    const text = msgInput.trim(); setMsgInput("");
    await supabase.from("messages").insert({ conversation_id: selectedConv.id, sender_id: user.id, text });
    await supabase.from("conversations").update({ updated_at: new Date().toISOString(), last_message: text }).eq("id", selectedConv.id);
    fetchMessages(selectedConv.id);
  };

  if (screen === "splash") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F4845F, #F7C948)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <style>{css}</style>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 42, color: "#fff", marginBottom: 8 }}>Mamaketplace</div>
      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 600 }}>Canada's marketplace for kids</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{css}</style>
      {toast && <div className="toast">✅ {toast}</div>}

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => setPage("home")}><img src="https://raw.githubusercontent.com/ksycheng/mamaketplace/master/public/logo.png" alt="Mamaketplace" style={{height:44, objectFit:"contain"}} /></div>
          <div className="nav-links">
            <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Browse</button>
            <button className={`nav-link ${page === "about" ? "active" : ""}`} onClick={() => setPage("about")}>Our Story</button>
            {user && (
              <button className={`nav-link ${page === "messages" ? "active" : ""}`} onClick={() => { setPage("messages"); fetchConversations(); setUnreadCount(0); }} style={{ position: "relative" }}>
                💬 Messages
                {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
              </button>
            )}
            {user && <button className={`nav-link ${page === "mylistings" ? "active" : ""}`} onClick={() => { setPage("mylistings"); fetchMyListings(); }}>My Listings</button>}
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            {user ? (
              <>
                <button className="btn btn-primary" onClick={() => setShowPostModal(true)} style={{ padding: "10px 18px", fontSize: 14 }}>+ Post Item</button>
                <button className="btn-ghost" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setPage("auth")} style={{ padding: "10px 20px", fontSize: 14 }}>Sign in</button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGES */}
      <div className="main">

        {/* HOME PAGE */}
        {page === "home" && (
          <div className="fade-in">
            {/* Hero */}
            <div className="hero">
              <img src="https://raw.githubusercontent.com/ksycheng/mamaketplace/master/public/logo.png" alt="Mamaketplace" style={{height:140, objectFit:"contain", marginBottom:12}} />
              <h1>Canada's Marketplace<br/>for Kids</h1>
              <p>Buy, sell, trade & discover children's items, classes, camps and more — right in your community.</p>
              <div className="search-bar">
                <input className="input" placeholder="🔍 Search for items, classes, camps..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={() => {}}>Search</button>
              </div>
            </div>

            {/* Categories */}
            <h2 className="section-title">Browse by category</h2>
            <div className="cat-grid">
              <div className={`cat-btn ${selectedCat === "all" ? "active" : ""}`} onClick={() => setSelectedCat("all")} style={{ borderColor: selectedCat === "all" ? "var(--coral)" : "transparent", background: selectedCat === "all" ? "var(--coral-light)" : "#fff" }}>
                <div className="cat-emoji">🏪</div>
                <div className="cat-label">All Items</div>
              </div>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className={`cat-btn ${selectedCat === cat.id ? "active" : ""}`} onClick={() => setSelectedCat(cat.id)} style={{ borderColor: selectedCat === cat.id ? cat.color : "transparent", background: selectedCat === cat.id ? cat.bg : "#fff" }}>
                  <div className="cat-emoji">{cat.emoji}</div>
                  <div className="cat-label" style={{ color: selectedCat === cat.id ? cat.color : "var(--muted)" }}>{cat.label}</div>
                </div>
              ))}
            </div>

            {/* Listings */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                {selectedCat === "all" ? "Recent listings" : CATEGORIES.find(c => c.id === selectedCat)?.label}
                <span style={{ fontSize: 16, color: "var(--muted)", fontFamily: "'Nunito',sans-serif", fontWeight: 700, marginLeft: 8 }}>({filteredListings.length})</span>
              </h2>
              {user && <button className="btn btn-primary" onClick={() => setShowPostModal(true)} style={{ padding: "10px 18px", fontSize: 14 }}>+ Post Item</button>}
            </div>

            {loadingListings ? (
              <div style={{ textAlign: "center", padding: 48, color: "var(--muted)", fontSize: 18, fontWeight: 700 }}>Loading listings... 🛍️</div>
            ) : filteredListings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 64, color: "var(--muted)" }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🏪</div>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No listings yet!</p>
                <p style={{ fontSize: 14, marginBottom: 24 }}>Be the first to post something amazing.</p>
                {user ? <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>Post the first item</button>
                  : <button className="btn btn-primary" onClick={() => setPage("auth")}>Sign up to post</button>}
              </div>
            ) : (
              <div className="listing-grid">
                {filteredListings.map(l => <ListingCard key={l.id} listing={l} onClick={setSelectedListing} />)}
              </div>
            )}
          </div>
        )}

        {/* ABOUT PAGE */}
        {page === "about" && (
          <div className="fade-in">
            <div className="story-card">
              <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👧‍👦</div>
              <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 36, color: "var(--coral)", marginBottom: 16 }}>Our Story</h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)", fontWeight: 600, whiteSpace: "pre-line" }}>
                {"As parents, we've all been there — buying that adorable formal outfit for one special night… only for it to sit untouched ever since. That plush toy from a generous aunt? Barely hugged before ending up in storage. The cute little chair? Rejected because it wasn't the \"right\" color.\n\nWith four kids of our own, we've tried to pass things down — but let's face it: what works for one doesn't always work for another. Between changing tastes, seasons, and siblings' preferences, so many perfectly good items get left behind.\n\nThat's why we created Mamaketplace — a caring, community-driven platform where parents can buy, sell, or even trade the things their children no longer need. Our mission is simple but powerful: To give children's clothes, toys, furniture, and gear a second life — and in doing so, help families save money, reduce waste, and support one another.\n\nBecause every item deserves more than just one chapter."}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
                <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "var(--coral)", marginBottom: 8 }}>Our Platform</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 600 }}>Dedicated exclusively to babies' and children's essentials — from the tiniest onesies to the sturdiest bunk beds. Created by parents, for parents.</p>
              </div>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏘️</div>
                <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "var(--coral)", marginBottom: 8 }}>Our Community</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 600 }}>Mamaketplace is more than just a marketplace — it's a village. Every listing you share helps build a space where families connect with trust and kindness.</p>
              </div>
            </div>
          </div>
        )}

        {/* AUTH PAGE */}
        {page === "auth" && (
          <div className="fade-in" style={{ maxWidth: 440, margin: "40px auto" }}>
            <div className="card" style={{ padding: 36 }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
                <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "var(--coral)" }}>Welcome!</h2>
                <p style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>Canada's marketplace for kids</p>
              </div>
              <div className="tab-bar" style={{ marginBottom: 24 }}>
                <button className={`tab ${authMode === "login" ? "active" : ""}`} onClick={() => { setAuthMode("login"); setAuthErr(""); }}>Sign In</button>
                <button className={`tab ${authMode === "signup" ? "active" : ""}`} onClick={() => { setAuthMode("signup"); setAuthErr(""); }}>Create Account</button>
              </div>
              {authErr && <div className="error-box">⚠️ {authErr}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {authMode === "signup" && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Your name</label>
                    <input className="input" placeholder="Jane Smith" value={authName} onChange={e => setAuthName(e.target.value)} />
                  </div>
                )}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email</label>
                  <input className="input" type="email" placeholder="jane@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Password</label>
                  <input className="input" type="password" placeholder="••••••••" value={authPass} onChange={e => setAuthPass(e.target.value)} onKeyDown={e => e.key === "Enter" && (authMode === "login" ? handleLogin() : handleSignup())} />
                </div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={authLoading} onClick={authMode === "login" ? handleLogin : handleSignup}>
                  {authLoading ? <span className="spinner" /> : authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES PAGE */}
        {page === "messages" && (
          <div className="fade-in">
            <h2 className="section-title">💬 Messages</h2>
            {!user ? (
              <div style={{ textAlign: "center", padding: 48 }}>
                <p style={{ marginBottom: 16, color: "var(--muted)", fontWeight: 700 }}>Sign in to view your messages</p>
                <button className="btn btn-primary" onClick={() => setPage("auth")}>Sign In</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, height: "calc(100vh - 200px)" }}>
                {/* Conversations list */}
                <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", fontWeight: 800, fontSize: 15 }}>Conversations</div>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    {conversations.length === 0 ? (
                      <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>No conversations yet.<br/>Message a seller to start!</div>
                    ) : conversations.map(conv => (
                      <div key={conv.id} className={`conv-item ${selectedConv?.id === conv.id ? "active" : ""}`} onClick={() => { setSelectedConv(conv); fetchMessages(conv.id); }}>
                        <Avatar name={conv.other_user?.name || "?"} size={40} bg="#F4845F" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{conv.other_user?.name || "User"}</div>
                          <div style={{ fontSize: 11, color: "var(--coral)", fontWeight: 700, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📦 {conv.listing?.title || "Item"}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.last_message || "New conversation"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat window */}
                <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {!selectedConv ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontWeight: 700 }}>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 8 }}>💬</div><p>Select a conversation</p></div>
                    </div>
                  ) : (
                    <>
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--coral-light)" }}>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{selectedConv.other_user?.name || "User"}</div>
                        <div style={{ fontSize: 12, color: "var(--coral)", fontWeight: 700, marginTop: 2 }}>📦 Re: {selectedConv.listing?.title || "Listing"}</div>
                      </div>
                      {selectedConv.listing && (
                        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                          {(() => {
                            const cat = CATEGORIES.find(c => c.id === selectedConv.listing.category) || CATEGORIES[8];
                            return (
                              <>
                                <div style={{ width: 48, height: 48, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{cat.emoji}</div>
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: 14 }}>{selectedConv.listing.title}</div>
                                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{cat.label}</div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                      <div style={{ flex: 1, overflowY: "auto", padding: 20 }} className="msg-list">
                        {messages.map(msg => (
                          <div key={msg.id} className={`msg-row ${msg.sender_id === user.id ? "mine" : ""}`}>
                            {msg.sender_id !== user.id && <Avatar name={selectedConv.other_user?.name || "?"} size={28} bg="#6BBF7A" />}
                            <div className={`msg-bubble ${msg.sender_id === user.id ? "mine" : "theirs"}`}>{msg.text}</div>
                          </div>
                        ))}
                        <div ref={msgEndRef} />
                      </div>
                      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                        <input className="input" placeholder="Type a message..." value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} style={{ flex: 1 }} />
                        <button className="btn btn-primary" onClick={sendMessage} style={{ padding: "12px 20px" }}>Send</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY LISTINGS PAGE */}
        {page === "mylistings" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 className="section-title" style={{ margin: 0 }}>My Listings</h2>
              <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>+ Post New Item</button>
            </div>
            {myListings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 64, color: "var(--muted)" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No listings yet</p>
                <button className="btn btn-primary" onClick={() => setShowPostModal(true)} style={{ marginTop: 8 }}>Post your first item</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myListings.map(l => {
                  const cat = CATEGORIES.find(c => c.id === l.category) || CATEGORIES[8];
                  return (
                    <div key={l.id} className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 72, height: 72, borderRadius: 12, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, overflow: "hidden" }}>
                        {l.image_url ? <img src={l.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : cat.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{l.title}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{cat.emoji} {cat.label} · 📍 {l.location}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          {l.type === "trade" && <span style={{ background: "#EEF1FB", color: "#7B8FD4", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>🔄 Trade</span>}
                          {l.type === "free" && <span style={{ background: "#E8F7EC", color: "#6BBF7A", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>🎁 Free</span>}
                          {l.type === "sell" && <span style={{ background: "#FEE8E2", color: "#F4845F", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 99 }}>💰 ${l.price}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => setEditListing({ ...l })}>✏️ Edit</button>
                        <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 14px", color: "#c0392b", borderColor: "#f5c0c0" }} onClick={() => handleDeleteListing(l.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LISTING DETAIL MODAL */}
      {selectedListing && (
        <div className="modal-bg" onClick={() => setSelectedListing(null)}>
          <div className="modal slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedListing(null)}>✕</button>
            {(() => {
              const cat = CATEGORIES.find(c => c.id === selectedListing.category) || CATEGORIES[8];
              return (
                <>
                  <div style={{ width: "100%", height: 220, background: cat.bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, marginBottom: 20 }}>
                    {selectedListing.image_url ? <img src={selectedListing.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} /> : cat.emoji}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "var(--text)", flex: 1 }}>{selectedListing.title}</h2>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "var(--coral)", marginLeft: 12 }}>
                      {selectedListing.is_free ? <span style={{ color: "#6BBF7A" }}>FREE</span> : `$${selectedListing.price}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    <span className="badge" style={{ background: cat.bg, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    {selectedListing.condition && <span className="badge" style={{ background: "#f0ebe0", color: "#888780" }}>{selectedListing.condition}</span>}
                    {selectedListing.location && <span className="badge" style={{ background: "#f0ebe0", color: "#888780" }}>📍 {selectedListing.location}</span>}
                    <span className="badge" style={{ background: "#f0ebe0", color: "#888780" }}>{selectedListing.type === "trade" ? "🔄 Trade" : selectedListing.type === "free" ? "🎁 Free" : "💰 For Sale"}</span>
                  </div>
                  {selectedListing.description && <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, fontWeight: 600, marginBottom: 20 }}>{selectedListing.description}</p>}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <Avatar name={selectedListing.seller_name} size={40} bg="#F4845F" />
                    <div><div style={{ fontWeight: 800 }}>{selectedListing.seller_name}</div><div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Seller</div></div>
                  </div>
                  {user && user.id !== selectedListing.user_id && (
                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => startConversation(selectedListing)}>
                      💬 Message Seller
                    </button>
                  )}
                  {!user && <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setSelectedListing(null); setPage("auth"); }}>Sign in to Message Seller</button>}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* POST LISTING MODAL */}
      {showPostModal && (
        <div className="modal-bg" onClick={() => setShowPostModal(false)}>
          <div className="modal slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPostModal(false)}>✕</button>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "var(--coral)", marginBottom: 24 }}>Post an Item</h2>
            {postErr && <div className="error-box">⚠️ {postErr}</div>}
            {postSuccess && <div className="success-box">{postSuccess}</div>}
            <div className="form-group">
              <label className="form-label">Listing type</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["sell", "💰 Sell"], ["trade", "🔄 Trade"], ["free", "🎁 Give Free"]].map(([v, l]) => (
                  <button key={v} className={postType === v ? "btn btn-primary" : "btn-ghost"} style={{ flex: 1, fontSize: 13 }} onClick={() => { setPostType(v); if (v === "free") setPostFree(true); else setPostFree(false); }}>{l}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" placeholder="e.g. Blue baby stroller, size 4 winter jacket..." value={postTitle} onChange={e => setPostTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="select" value={postCat} onChange={e => setPostCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {postType === "sell" && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Price (CAD) *</label>
                  <input className="input" type="number" placeholder="25.00" value={postPrice} onChange={e => setPostPrice(e.target.value)} />
                </div>
              )}
              {postType === "trade" && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Looking to trade for</label>
                  <input className="input" placeholder="e.g. Size 6 winter jacket..." value={postPrice} onChange={e => setPostPrice(e.target.value)} />
                </div>
              )}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Condition</label>
                <select className="select" value={postCond} onChange={e => setPostCond(e.target.value)}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input className="input" placeholder="e.g. Toronto, ON" value={postLocation} onChange={e => setPostLocation(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="textarea" placeholder="Describe the item — size, brand, any wear and tear..." value={postDesc} onChange={e => setPostDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Photo</label>
              <div style={{ border: "2px dashed var(--border)", borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", background: "#fafafa" }} onClick={() => document.getElementById("imgUpload").click()}>
                {postImagePreview ? (
                  <img src={postImagePreview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: "contain" }} />
                ) : (
                  <div><div style={{ fontSize: 32, marginBottom: 8 }}>📷</div><p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>Click to add a photo</p><p style={{ fontSize: 12, color: "#aaa" }}>JPG, PNG up to 5MB</p></div>
                )}
                <input id="imgUpload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setPostImage(f); setPostImagePreview(URL.createObjectURL(f)); } }} />
              </div>
              {postImagePreview && <button className="btn-ghost" style={{ marginTop: 8, width: "100%", fontSize: 13 }} onClick={() => { setPostImage(null); setPostImagePreview(null); }}>Remove photo</button>}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", fontSize: 16 }} disabled={postLoading} onClick={handlePost}>
              {postLoading ? <span className="spinner" /> : "🎉 Post Listing"}
            </button>
          </div>
        </div>
      )}

      {/* EDIT LISTING MODAL */}
      {editListing && (
        <div className="modal-bg" onClick={() => setEditListing(null)}>
          <div className="modal slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditListing(null)}>✕</button>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "var(--coral)", marginBottom: 24 }}>Edit Listing</h2>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" value={editListing.title} onChange={e => setEditListing({ ...editListing, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={editListing.category} onChange={e => setEditListing({ ...editListing, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            {editListing.type === "sell" && (
              <div className="form-group">
                <label className="form-label">Price (CAD)</label>
                <input className="input" type="number" value={editListing.price} onChange={e => setEditListing({ ...editListing, price: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select className="select" value={editListing.condition} onChange={e => setEditListing({ ...editListing, condition: e.target.value })}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="input" value={editListing.location} onChange={e => setEditListing({ ...editListing, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="textarea" value={editListing.description} onChange={e => setEditListing({ ...editListing, description: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleEditSave}>💾 Save Changes</button>
              <button className="btn-ghost" onClick={() => setEditListing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <h3>🛒 Mamaketplace</h3>
        <p>Because every item deserves more than just one chapter.</p>
        <p style={{ marginTop: 8 }}>Made with ❤️ by parents, for parents · Toronto, Canada</p>
        <p style={{ marginTop: 4, fontSize: 12 }}>© 2026 Mamaketplace · <span style={{ cursor: "pointer", color: "var(--coral)" }} onClick={() => setPage("about")}>Our Story</span></p>
      </footer>
    </div>
  );
}
