// ================= DATA MENU =================
const menu = {
    makanan: [
        { id:1, nama:"Nasi Rendang Daging", harga:25000, deskripsi:"Nasi putih + daging rendang empuk bumbu pedas gurih", ikon:"🍛" },
        { id:2, nama:"Nasi Ayam Gulai", harga:22000, deskripsi:"Nasi putih + ayam potong kuah gulai kental", ikon:"🍗" },
        { id:3, nama:"Nasi Ikan Gulai", harga:23000, deskripsi:"Nasi putih + ikan laut segar kuah kuning khas", ikon:"🐟" },
        { id:4, nama:"Nasi Telur Balado", harga:18000, deskripsi:"Nasi putih + telur rebus sambal balado", ikon:"🥚" },
        { id:5, nama:"Nasi Daging Pop", harga:24000, deskripsi:"Nasi putih + daging sapi goreng bumbu rempah", ikon:"🥩" },
        { id:6, nama:"Nasi Sayur Lauk", harga:15000, deskripsi:"Nasi putih + sayur nangka & daun singkong", ikon:"🥬" },
    ],
    lauk: [
        { id:7, nama:"Rendang Daging", harga:18000, deskripsi:"Per porsi — daging sapi dimasak lama bumbu kelapa", ikon:"🥘" },
        { id:8, nama:"Ayam Gulai", harga:15000, deskripsi:"1 potong ayam dengan kuah gulai", ikon:"🍗" },
        { id:9, nama:"Ikan Masak Asam Padeh", harga:16000, deskripsi:"Ikan kuah asam pedas segar khas Padang", ikon:"🐟" },
        { id:10, nama:"Telur Balado", harga:8000, deskripsi:"Telur rebus sambal merah pedas manis", ikon:"🥚" },
        { id:11, nama:"Dendeng Balado", harga:20000, deskripsi:"Daging tipis kering digoreng + sambal balado", ikon:"🥩" },
        { id:12, nama:"Sayur Nangka & Daun Singkong", harga:5000, deskripsi:"Lauk pendamping wajib makan Padang", ikon:"🥬" },
    ],
    minuman: [
        { id:13, nama:"Es Teh Manis", harga:4000, deskripsi:"Teh melati segar + gula pasir + es batu", ikon:"🍹" },
        { id:14, nama:"Es Jeruk", harga:6000, deskripsi:"Jeruk peras asli, manis pas, segar!", ikon:"🍊" },
        { id:15, nama:"Teh Talua", harga:8000, deskripsi:"Minuman khas Minang — kuning telur + gula + teh", ikon:"🥚🍵" },
        { id:16, nama:"Es Kelapa Muda", harga:10000, deskripsi:"Kelapa muda asli, gula merah atau putih", ikon:"🥥" },
        { id:17, nama:"Kopi Hitam Padang", harga:5000, deskripsi:"Kopi robusta khas dataran tinggi Minang", ikon:"☕" },
        { id:18, nama:"Air Mineral Botol", harga:3000, deskripsi:"Air minum kemasan 600ml", ikon:"💧" },
    ]
};

// Keranjang pesanan
let keranjang = [];

// Format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(angka);
}

// Tampilkan daftar menu ke halaman
function tampilkanMenu(daftar, elemenId) {
    const wadah = document.getElementById(elemenId);
    if (!wadah) return;
    
    wadah.innerHTML = '';
    daftar.forEach(item => {
        const kartu = document.createElement('div');
        kartu.className = 'menu-card';
        kartu.innerHTML = `
            <div class="menu-icon">${item.ikon}</div>
            <div class="menu-content">
                <h3>${item.nama}</h3>
                <p class="deskripsi">${item.deskripsi}</p>
                <p class="harga">${formatRupiah(item.harga)}</p>
                <button class="btn-tambah" data-id="${item.id}" data-nama="${item.nama}" data-harga="${item.harga}">➕ Tambah ke Pesanan</button>
            </div>
        `;
        wadah.appendChild(kartu);
    });
}

// Tambah ke keranjang
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-tambah')) {
        const id = parseInt(e.target.dataset.id);
        const nama = e.target.dataset.nama;
        const harga = parseInt(e.target.dataset.harga);
        
        const ada = keranjang.find(b => b.id === id);
        if (ada) {
            ada.jumlah += 1;
        } else {
            keranjang.push({ id, nama, harga, jumlah: 1 });
        }
        perbaruiKeranjang();
        
        // Ubah teks tombol sebentar
        e.target.textContent = '✅ Ditambahkan!';
        setTimeout(() => {
            e.target.textContent = '➕ Tambah ke Pesanan';
        }, 1200);
    }
});

// Ubah jumlah item di keranjang
function ubahJumlah(id, tambah) {
    const item = keranjang.find(b => b.id === id);
    if (item) {
        item.jumlah += tambah;
        if (item.jumlah <= 0) {
            keranjang = keranjang.filter(b => b.id !== id);
        }
    }
    perbaruiKeranjang();
}

// Hapus item dari keranjang
function hapusItem(id) {
    keranjang = keranjang.filter(b => b.id !== id);
    perbaruiKeranjang();
}

// Perbarui tampilan keranjang
function perbaruiKeranjang() {
    const wadah = document.getElementById('isi-keranjang');
    const totalEl = document.getElementById('total-bayar');
    const btnPesan = document.getElementById('btn-pesan');
    
    if (!wadah || !totalEl || !btnPesan) return;
    
    if (keranjang.length === 0) {
        wadah.innerHTML = '<p class="kosong">Keranjang masih kosong, silakan pilih menu di atas!</p>';
        totalEl.textContent = 'Total: Rp 0';
        btnPesan.style.display = 'none';
        return;
    }
    
    let total = 0;
    wadah.innerHTML = '';
    keranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        total += subtotal;
        const baris = document.createElement('div');
        baris.className = 'keranjang-item';
        baris.innerHTML = `
            <div class="item-kiri">
                <div>
                    <strong>${item.nama}</strong><br>
                    <small>${formatRupiah(item.harga)} × ${item.jumlah} = ${formatRupiah(subtotal)}</small>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div class="jumlah-kontrol">
                    <button onclick="ubahJumlah(${item.id}, -1)">−</button>
                    <span>${item.jumlah}</span>
                    <button onclick="ubahJumlah(${item.id}, 1)">+</button>
                </div>
                <button class="btn-hapus" onclick="hapusItem(${item.id})">🗑️ Hapus</button>
            </div>
        `;
        wadah.appendChild(baris);
    });
    
    totalEl.textContent = `Total: ${formatRupiah(total)}`;
    btnPesan.style.display = 'block';
}

// Tombol pesan sekarang
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-pesan') {
        if (keranjang.length === 0) return;
        alert('✅ Terima kasih! Pesanan Anda sedang diproses. Selamat menikmati hidangan kami!');
        keranjang = [];
        perbaruiKeranjang();
    }
});

// Tampilkan semua menu saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    tampilkanMenu(menu.makanan, 'daftar-makanan');
    tampilkanMenu(menu.lauk, 'daftar-lauk');
    tampilkanMenu(menu.minuman, 'daftar-minuman');
    perbaruiKeranjang();
});
